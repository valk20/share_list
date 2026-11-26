import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  type User,
  type AuthSession,
  type LoginCredentials,
  type RegisterPayload,
  authLogger,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sharelist_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore stored session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AuthSession = JSON.parse(stored);
        setSession(parsed);
        authLogger.debug('Restored cached authentication session', {
          userId: parsed.user.id,
          username: parsed.user.username,
        });
      }
    } catch (e) {
      authLogger.warn('Failed to parse cached session from localStorage', { error: String(e) });
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthSession> => {
    const activeSession = await apiLogin(credentials);
    setSession(activeSession);
    if (credentials.rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeSession));
    }
    return activeSession;
  };

  const register = async (payload: RegisterPayload): Promise<AuthSession> => {
    const newSession = await apiRegister(payload);
    setSession(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    return newSession;
  };

  const logout = () => {
    if (session) {
      apiLogout(session.user.id);
    } else {
      apiLogout();
    }
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session ? session.user : null,
        session,
        isAuthenticated: Boolean(session),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
