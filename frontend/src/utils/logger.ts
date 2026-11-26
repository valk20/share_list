/**
 * Production-ready frontend logger utility.
 * Supports configurable log levels, namespace context, sensitive data sanitization,
 * browser DevTools console formatting, and subscriber listeners (transports).
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

export interface LogEntry {
  id: string;
  timestamp: string; // ISO 8601 string
  level: Exclude<LogLevel, 'none'>;
  namespace?: string;
  message: string;
  data?: unknown;
}

export type LogListener = (entry: LogEntry) => void;

export interface LoggerConfig {
  minLevel?: LogLevel;
  enableConsole?: boolean;
  enableTimestamp?: boolean;
  sensitiveKeys?: string[];
  maskString?: string;
}

const LOG_LEVEL_PRIORITIES: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  none: 100,
};

// Default sensitive field names to automatically mask (case-insensitive)
const DEFAULT_SENSITIVE_KEYS = [
  'password',
  'pass',
  'passwd',
  'token',
  'accesstoken',
  'refreshtoken',
  'secret',
  'authorization',
  'apikey',
  'api_key',
  'privatekey',
  'creditcard',
  'cvv',
  'ssn',
];

const CONSOLE_COLORS = {
  timestamp: 'color: #94a3b8; font-size: 10px;',
  namespace: 'background: #4f46e5; color: #ffffff; padding: 1px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;',
  debug: 'background: #475569; color: #f8fafc; padding: 1px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;',
  info: 'background: #0284c7; color: #f0f9ff; padding: 1px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;',
  warn: 'background: #d97706; color: #fffbeb; padding: 1px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;',
  error: 'background: #dc2626; color: #fef2f2; padding: 1px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;',
  text: 'color: inherit;',
};

export class Logger {
  private minLevel: LogLevel;
  private enableConsole: boolean;
  private enableTimestamp: boolean;
  private sensitiveKeys: Set<string>;
  private maskString: string;
  private listeners: Set<LogListener> = new Set();
  private namespace?: string;
  private parent?: Logger;

  constructor(config?: LoggerConfig, namespace?: string, parent?: Logger) {
    const isProduction = Boolean(
      typeof import.meta !== 'undefined' && import.meta.env?.PROD
    );
    const envLevel =
      typeof import.meta !== 'undefined' && import.meta.env?.VITE_LOG_LEVEL
        ? (import.meta.env.VITE_LOG_LEVEL as LogLevel)
        : undefined;

    this.minLevel =
      config?.minLevel ?? envLevel ?? (isProduction ? 'info' : 'debug');
    this.enableConsole = config?.enableConsole ?? true;
    this.enableTimestamp = config?.enableTimestamp ?? true;
    this.maskString = config?.maskString ?? '********';
    this.namespace = namespace;
    this.parent = parent;

    const customKeys = config?.sensitiveKeys ?? [];
    this.sensitiveKeys = new Set(
      [...DEFAULT_SENSITIVE_KEYS, ...customKeys].map((k) => k.toLowerCase())
    );
  }

  /**
   * Set minimum threshold log level.
   */
  public setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Get current minimum threshold log level.
   */
  public getLevel(): LogLevel {
    return this.minLevel;
  }

  /**
   * Create a scoped sub-logger with a specific namespace prefix.
   */
  public forContext(namespace: string): Logger {
    const fullNamespace = this.namespace
      ? `${this.namespace}:${namespace}`
      : namespace;

    return new Logger(
      {
        minLevel: this.minLevel,
        enableConsole: this.enableConsole,
        enableTimestamp: this.enableTimestamp,
        sensitiveKeys: Array.from(this.sensitiveKeys),
        maskString: this.maskString,
      },
      fullNamespace,
      this
    );
  }

  /**
   * Register a listener callback to receive log events.
   * Returns an unsubscribe function.
   */
  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Deeply sanitizes an object, masking sensitive keys and Bearer tokens.
   */
  public sanitize<T>(target: T): T {
    const seen = new WeakSet<object>();

    const isKeySensitive = (key: string): boolean => {
      const lower = key.toLowerCase();
      return Array.from(this.sensitiveKeys).some(
        (sens) => lower === sens || lower.endsWith(`_${sens}`) || lower.endsWith(sens)
      );
    };

    const sanitizeRecursive = (value: unknown): unknown => {
      if (value === null || value === undefined) {
        return value;
      }

      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack,
          ...(value as unknown as Record<string, unknown>),
        };
      }

      if (typeof value === 'string') {
        // Redact Bearer token strings
        return value.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer ********');
      }

      if (typeof value !== 'object') {
        return value;
      }

      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);

      if (Array.isArray(value)) {
        return value.map((item) => sanitizeRecursive(item));
      }

      const sanitizedObj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        if (isKeySensitive(key)) {
          if (val !== null && typeof val === 'object') {
            // Recurse into objects even if key has 'token' or similar in name
            sanitizedObj[key] = sanitizeRecursive(val);
          } else {
            sanitizedObj[key] = this.maskString;
          }
        } else {
          sanitizedObj[key] = sanitizeRecursive(val);
        }
      }

      return sanitizedObj;
    };

    return sanitizeRecursive(target) as T;
  }

  public debug(message: string, data?: unknown, explicitNamespace?: string): void {
    this.emit('debug', message, data, explicitNamespace);
  }

  public info(message: string, data?: unknown, explicitNamespace?: string): void {
    this.emit('info', message, data, explicitNamespace);
  }

  public warn(message: string, data?: unknown, explicitNamespace?: string): void {
    this.emit('warn', message, data, explicitNamespace);
  }

  public error(message: string, data?: unknown, explicitNamespace?: string): void {
    this.emit('error', message, data, explicitNamespace);
  }

  private shouldLog(level: Exclude<LogLevel, 'none'>): boolean {
    return LOG_LEVEL_PRIORITIES[level] >= LOG_LEVEL_PRIORITIES[this.minLevel];
  }

  private notifyListeners(entry: LogEntry): void {
    this.listeners.forEach((listener) => {
      try {
        listener(entry);
      } catch (err) {
        console.error('[Logger] Listener threw an unhandled error:', err);
      }
    });

    if (this.parent) {
      this.parent.notifyListeners(entry);
    }
  }

  private emit(
    level: Exclude<LogLevel, 'none'>,
    message: string,
    rawData?: unknown,
    explicitNamespace?: string
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const sanitizedData = rawData !== undefined ? this.sanitize(rawData) : undefined;
    const finalNamespace = explicitNamespace || this.namespace;

    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp,
      level,
      namespace: finalNamespace,
      message,
      data: sanitizedData,
    };

    if (this.enableConsole) {
      this.printConsole(entry);
    }

    this.notifyListeners(entry);
  }

  private printConsole(entry: LogEntry): void {
    const { timestamp, level, namespace, message, data } = entry;

    const formatParts: string[] = [];
    const styleArgs: string[] = [];

    if (this.enableTimestamp) {
      const timeOnly = timestamp.split('T')[1].replace('Z', '');
      formatParts.push(`%c${timeOnly}`);
      styleArgs.push(CONSOLE_COLORS.timestamp);
    }

    formatParts.push(`%c${level.toUpperCase()}`);
    styleArgs.push(CONSOLE_COLORS[level]);

    if (namespace) {
      formatParts.push(`%c${namespace}`);
      styleArgs.push(CONSOLE_COLORS.namespace);
    }

    formatParts.push(`%c${message}`);
    styleArgs.push(CONSOLE_COLORS.text);

    const logMethod =
      level === 'error'
        ? console.error
        : level === 'warn'
        ? console.warn
        : level === 'info'
        ? console.info
        : console.debug;

    const messageTemplate = formatParts.join(' ');

    if (data !== undefined) {
      logMethod(messageTemplate, ...styleArgs, data);
    } else {
      logMethod(messageTemplate, ...styleArgs);
    }
  }
}

// Export default singleton instance
export const logger = new Logger();

// Export factory for easy scoped loggers
export const createLogger = (namespace: string, config?: LoggerConfig): Logger => {
  if (config) {
    return new Logger(config, namespace, logger);
  }
  return logger.forContext(namespace);
};
