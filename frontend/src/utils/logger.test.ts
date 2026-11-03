import { describe, it, expect, vi } from 'vitest';
import { Logger } from './logger';
import { login, register, AuthenticationError, authLogger } from '../services/authService';

describe('Logger Utility', () => {
  it('should emit logs to subscribers with proper log levels and metadata', () => {
    const logger = new Logger({ enableConsole: false, minLevel: 'debug' });
    const logSpy = vi.fn();
    logger.subscribe(logSpy);

    logger.debug('Debug message', { step: 1 });
    logger.info('Info message', { step: 2 });
    logger.warn('Warn message', { step: 3 });
    logger.error('Error message', { step: 4 });

    expect(logSpy).toHaveBeenCalledTimes(4);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        level: 'debug',
        message: 'Debug message',
        data: { step: 1 },
      })
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        level: 'error',
        message: 'Error message',
        data: { step: 4 },
      })
    );
  });

  it('should filter logs below the configured minLevel', () => {
    const logger = new Logger({ enableConsole: false, minLevel: 'warn' });
    const logSpy = vi.fn();
    logger.subscribe(logSpy);

    logger.debug('This should be ignored');
    logger.info('This should also be ignored');
    logger.warn('This should pass');
    logger.error('This should pass');

    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(1, expect.objectContaining({ level: 'warn' }));
    expect(logSpy).toHaveBeenNthCalledWith(2, expect.objectContaining({ level: 'error' }));
  });

  it('should automatically sanitize passwords, tokens, and sensitive fields', () => {
    const logger = new Logger({ enableConsole: false });

    const rawData = {
      username: 'alice_wanderer',
      password: 'superSecretPassword123!',
      nested: {
        accessToken: 'eyJhbGciOi...',
        apiKey: 'sk-9938102948',
        safeProperty: 'list_123',
      },
    };

    const sanitized = logger.sanitize(rawData);

    expect(sanitized.username).toBe('alice_wanderer');
    expect(sanitized.password).toBe('********');
    expect(sanitized.nested.accessToken).toBe('********');
    expect(sanitized.nested.apiKey).toBe('********');
    expect(sanitized.nested.safeProperty).toBe('list_123');
  });

  it('should sanitize Bearer tokens inside strings', () => {
    const logger = new Logger({ enableConsole: false });
    const headerString = 'Bearer 12345abcdefg';
    const sanitized = logger.sanitize(headerString);
    expect(sanitized).toBe('Bearer ********');
  });

  it('should support scoped child loggers with namespaces', () => {
    const rootLogger = new Logger({ enableConsole: false, minLevel: 'debug' });
    const logSpy = vi.fn();
    rootLogger.subscribe(logSpy);

    const authLogger = rootLogger.forContext('AuthModule');
    authLogger.info('Handshake initialized', { client: 'web' });

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        namespace: 'AuthModule',
        message: 'Handshake initialized',
      })
    );
  });
});

describe('User Authentication Event Logging', () => {
  it('should log login initiated and login success without exposing password', async () => {
    const logs: any[] = [];
    const unsubscribe = authLogger.subscribe((entry) => {
      logs.push(entry);
    });

    const session = await login({
      identifier: 'testuser',
      password: 'ValidPassword123!',
    });

    unsubscribe();

    expect(session.user.username).toBe('testuser');

    // Verify events were logged
    const messages = logs.map((l: any) => l.message);
    expect(messages).toContain('User login initiated');
    expect(messages).toContain('User login succeeded');

    // CRITICAL: Ensure raw password was NEVER logged in plain text anywhere
    const fullLogDump = JSON.stringify(logs);
    expect(fullLogDump).not.toContain('ValidPassword123!');
  });

  it('should log login error with sanitized details when credentials are invalid', async () => {
    const logs: any[] = [];
    const unsubscribe = authLogger.subscribe((entry) => {
      logs.push(entry);
    });

    await expect(
      login({
        identifier: 'failuser',
        password: 'wrongpassword',
      })
    ).rejects.toThrow(AuthenticationError);

    unsubscribe();

    const messages = logs.map((l: any) => l.message);
    expect(messages).toContain('User login initiated');
    expect(messages).toContain('User login failed');

    const errorLog = logs.find((l: any) => l.message === 'User login failed') as any;
    expect(errorLog.level).toBe('error');
    expect(errorLog.data).toEqual(
      expect.objectContaining({
        identifier: 'failuser',
        errorCode: 'INVALID_CREDENTIALS',
        statusCode: 401,
      })
    );

    // Confirm passwords never leaked
    const fullLogDump = JSON.stringify(logs);
    expect(fullLogDump).not.toContain('wrongpassword');
  });

  it('should log registration initiated and registration success without exposing password', async () => {
    const logs: any[] = [];
    const unsubscribe = authLogger.subscribe((entry) => {
      logs.push(entry);
    });

    const session = await register({
      username: 'new_explorer',
      email: 'explorer@example.com',
      password: 'SuperSecurePassword999!',
    });

    unsubscribe();

    expect(session.user.username).toBe('new_explorer');
    expect(session.user.email).toBe('explorer@example.com');

    const messages = logs.map((l: any) => l.message);
    expect(messages).toContain('User registration initiated');
    expect(messages).toContain('User registration succeeded');

    // Confirm passwords never leaked
    const fullLogDump = JSON.stringify(logs);
    expect(fullLogDump).not.toContain('SuperSecurePassword999!');
  });

  it('should log registration error with sanitized details on failure without leaking password', async () => {
    const logs: any[] = [];
    const unsubscribe = authLogger.subscribe((entry) => {
      logs.push(entry);
    });

    await expect(
      register({
        username: 'existing_user',
        email: 'taken@example.com',
        password: 'Password123!',
      })
    ).rejects.toThrow(AuthenticationError);

    unsubscribe();

    const messages = logs.map((l: any) => l.message);
    expect(messages).toContain('User registration initiated');
    expect(messages).toContain('User registration failed');

    const errorLog = logs.find((l: any) => l.message === 'User registration failed') as any;
    expect(errorLog.level).toBe('error');
    expect(errorLog.data).toEqual(
      expect.objectContaining({
        username: 'existing_user',
        email: 'taken@example.com',
        errorCode: 'USER_ALREADY_EXISTS',
        statusCode: 409,
      })
    );

    // Confirm passwords never leaked
    const fullLogDump = JSON.stringify(logs);
    expect(fullLogDump).not.toContain('Password123!');
  });
});

