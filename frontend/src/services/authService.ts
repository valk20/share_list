/**
 * Authentication Service demonstrating secure event logging.
 * Illustrates defensive logging: sanitizing data before logging and relying
 * on the logger's automatic masking engine as defense-in-depth.
 */

import { createLogger } from '../utils/logger';

// Create a contextual logger dedicated to authentication events
export const authLogger = createLogger('AuthService');

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  identifier: string; // username or email
  password: string;   // SENSITIVE: MUST NEVER BE LOGGED IN PLAIN TEXT
  rememberMe?: boolean;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;   // SENSITIVE: MUST NEVER BE LOGGED IN PLAIN TEXT
  confirmPassword?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresIn: string;
}

export class AuthenticationError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code: string, status: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Perform login operation with comprehensive, sanitized audit logging.
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const startTime = performance.now();
  const requestId = `req_log_${Math.random().toString(36).substring(2, 9)}`;

  // 1. EVENT: LOGIN ATTEMPT / INITIATED
  // BEST PRACTICE: Explicitly omit the password when passing metadata to the logger.
  authLogger.info('User login initiated', {
    requestId,
    identifier: credentials.identifier,
    rememberMe: credentials.rememberMe ?? false,
    clientTimestamp: new Date().toISOString(),
  });

  // Defense-in-depth:
  // Even if an engineer logs the raw credentials object, the logger masks 'password' to '********'
  authLogger.debug('Raw login payload (auto-sanitized by logger)', {
    requestId,
    credentialsPayload: credentials,
  });

  try {
    // Simulated network delay / validation logic
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedIdentifier = credentials.identifier.trim().toLowerCase();

    if (!normalizedIdentifier) {
      throw new AuthenticationError('Identifier cannot be empty', 'EMPTY_IDENTIFIER', 400);
    }

    if (credentials.password.length < 6) {
      throw new AuthenticationError(
        'Password must be at least 6 characters long',
        'INVALID_PASSWORD_LENGTH',
        400
      );
    }

    // Demo check: wrong password trigger for test user
    if (credentials.password === 'wrongpassword' || credentials.password === 'fail') {
      throw new AuthenticationError(
        'Invalid credentials provided. Please check your username/password.',
        'INVALID_CREDENTIALS',
        401
      );
    }

    // Demo check: locked account simulation
    if (normalizedIdentifier === 'locked@example.com') {
      throw new AuthenticationError(
        'Account is temporarily locked due to multiple failed attempts.',
        'ACCOUNT_LOCKED',
        403
      );
    }

    // Successful login simulation
    const user: User = {
      id: 101,
      username: normalizedIdentifier.includes('@')
        ? normalizedIdentifier.split('@')[0]
        : normalizedIdentifier,
      email: normalizedIdentifier.includes('@')
        ? normalizedIdentifier
        : `${normalizedIdentifier}@sharelist.local`,
      role: 'curator',
    };

    const session: AuthSession = {
      user,
      token: 'jwt_mock_token_eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxfQ',
      expiresIn: '7d',
    };

    const durationMs = Math.round(performance.now() - startTime);

    // 2. EVENT: LOGIN SUCCESS
    authLogger.info('User login succeeded', {
      requestId,
      userId: user.id,
      username: user.username,
      durationMs: `${durationMs}ms`,
      role: user.role,
    });

    return session;
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startTime);

    const error =
      err instanceof AuthenticationError
        ? err
        : new AuthenticationError(
            err instanceof Error ? err.message : 'Unknown authentication error',
            'AUTH_UNEXPECTED_ERROR',
            500
          );

    // 3. EVENT: LOGIN ERROR (Sanitized, password never logged)
    authLogger.error('User login failed', {
      requestId,
      identifier: credentials.identifier,
      errorCode: error.code,
      statusCode: error.status,
      errorMessage: error.message,
      durationMs: `${durationMs}ms`,
    });

    throw error;
  }
}

/**
 * Perform sign up / registration operation with comprehensive, sanitized audit logging.
 */
export async function register(payload: RegisterPayload): Promise<AuthSession> {
  const startTime = performance.now();
  const requestId = `req_reg_${Math.random().toString(36).substring(2, 9)}`;

  // 1. EVENT: SIGN UP ATTEMPT / INITIATED
  // BEST PRACTICE: Pass safe metadata (username, email, requestId); NEVER pass raw password
  authLogger.info('User registration initiated', {
    requestId,
    username: payload.username,
    email: payload.email,
    clientTimestamp: new Date().toISOString(),
  });

  // Defense-in-depth:
  // Auto-masking sanitization prevents accidental exposure
  authLogger.debug('Raw registration payload (auto-sanitized by logger)', {
    requestId,
    registrationPayload: payload,
  });

  try {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const cleanUsername = payload.username.trim().toLowerCase();
    const cleanEmail = payload.email.trim().toLowerCase();

    // Validation
    if (!cleanUsername || cleanUsername.length < 3) {
      throw new AuthenticationError(
        'Username must be at least 3 characters long',
        'INVALID_USERNAME_LENGTH',
        400
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new AuthenticationError(
        'Please enter a valid email address',
        'INVALID_EMAIL_FORMAT',
        400
      );
    }

    if (payload.password.length < 6) {
      throw new AuthenticationError(
        'Password must be at least 6 characters long',
        'INVALID_PASSWORD_LENGTH',
        400
      );
    }

    if (payload.confirmPassword !== undefined && payload.password !== payload.confirmPassword) {
      throw new AuthenticationError(
        'Passwords do not match',
        'PASSWORD_MISMATCH',
        400
      );
    }

    // Demo check: existing user conflict simulation
    if (cleanUsername === 'existing_user' || cleanEmail === 'taken@example.com') {
      throw new AuthenticationError(
        'An account with this username or email already exists',
        'USER_ALREADY_EXISTS',
        409
      );
    }

    // Successful registration simulation
    const user: User = {
      id: Math.floor(Math.random() * 900) + 100,
      username: cleanUsername,
      email: cleanEmail,
      role: 'curator',
    };

    const session: AuthSession = {
      user,
      token: 'jwt_mock_token_reg_' + Math.random().toString(36).substring(2, 12),
      expiresIn: '7d',
    };

    const durationMs = Math.round(performance.now() - startTime);

    // 2. EVENT: SIGN UP SUCCESS
    authLogger.info('User registration succeeded', {
      requestId,
      userId: user.id,
      username: user.username,
      email: user.email,
      durationMs: `${durationMs}ms`,
    });

    return session;
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startTime);

    const error =
      err instanceof AuthenticationError
        ? err
        : new AuthenticationError(
            err instanceof Error ? err.message : 'Unknown registration error',
            'REGISTRATION_UNEXPECTED_ERROR',
            500
          );

    // 3. EVENT: SIGN UP ERROR (Sanitized, password never logged)
    authLogger.error('User registration failed', {
      requestId,
      username: payload.username,
      email: payload.email,
      errorCode: error.code,
      statusCode: error.status,
      errorMessage: error.message,
      durationMs: `${durationMs}ms`,
    });

    throw error;
  }
}

/**
 * Perform logout operation with audit logging.
 */
export function logout(userId?: number): void {
  authLogger.info('User logged out', {
    userId: userId ?? 'unknown',
    timestamp: new Date().toISOString(),
  });
}
