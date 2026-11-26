import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthPage: React.FC = () => {
  const { login, register, isAuthenticated, user } = useAuth();
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode state: 'login' or 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('curator_sarah');
  const [loginPassword, setLoginPassword] = useState('SecretChecklist2026!');
  const [rememberMe, setRememberMe] = useState(true);

  const [signupUsername, setSignupUsername] = useState('alex_hiker');
  const [signupEmail, setSignupEmail] = useState('alex@trails.net');
  const [signupPassword, setSignupPassword] = useState('ExplorerPass2026!');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('ExplorerPass2026!');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/feed';

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    try {
      const session = await login({
        identifier: loginIdentifier,
        password: loginPassword,
        rememberMe,
      });
      setSuccessMessage(t.welcomeBack.replace('{username}', session.user.username));
      setTimeout(() => navigate(from, { replace: true }), 700);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    if (!agreeTerms) {
      setErrorMessage(t.acceptTermsError);
      setIsLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage(t.passwordMismatchError);
      setIsLoading(false);
      return;
    }

    try {
      const session = await register({
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
      });
      setSuccessMessage(t.accountCreated.replace('{username}', session.user.username));
      setTimeout(() => navigate(from, { replace: true }), 700);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated and visiting /login directly
  if (isAuthenticated && user) {
    return (
      <div style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px' }}>
        <div className="glass-panel" style={{ padding: '36px 32px', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={30} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>
            {t.alreadySignedIn}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {t.loggedInAs} <strong>{user.username}</strong> ({user.email}).
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/feed')}
              style={{ flex: 1 }}
            >
              {t.goToFeed}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/profile')}
              style={{ flex: 1 }}
            >
              {t.myProfile}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic input icon styling based on direction (LTR vs RTL)
  const isRtl = direction === 'rtl';
  const iconInputPadding = isRtl
    ? { paddingRight: '38px', paddingLeft: '14px' }
    : { paddingLeft: '38px', paddingRight: '14px' };

  const passInputPadding = isRtl
    ? { paddingRight: '38px', paddingLeft: '40px' }
    : { paddingLeft: '38px', paddingRight: '40px' };

  const iconPositionStyle = isRtl
    ? { right: '12px', left: 'auto' }
    : { left: '12px', right: 'auto' };

  const toggleEyePositionStyle = isRtl
    ? { left: '10px', right: 'auto' }
    : { right: '10px', left: 'auto' };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
      }}
    >
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div className="glass-panel" style={{ padding: '36px 32px' }}>
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {mode === 'login' ? t.signInTitle : t.signUpTitle}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {mode === 'login' ? t.signInSubtitle : t.signUpSubtitle}
            </p>
          </div>

          {/* Mode Toggle Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: 'var(--bg-input)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
            }}
          >
            <button
              type="button"
              id="tab-toggle-login"
              onClick={() => {
                setMode('login');
                resetMessages();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: mode === 'login' ? 'var(--accent-primary)' : 'transparent',
                color: mode === 'login' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <LogIn size={15} /> {t.logInTab}
            </button>
            <button
              type="button"
              id="tab-toggle-signup"
              onClick={() => {
                setMode('signup');
                resetMessages();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: mode === 'signup' ? 'var(--accent-primary)' : 'transparent',
                color: mode === 'signup' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <UserPlus size={15} /> {t.signUpTab}
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div
              className="animate-fade-in"
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '0.825rem',
                color: '#fb7185',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              className="animate-fade-in"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '0.825rem',
                color: '#34d399',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM (Quick Test Scenarios completely removed) */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} id="auth-login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="input-login-identifier">
                  <span>{t.usernameOrEmail}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)',
                      ...iconPositionStyle,
                    }}
                  />
                  <input
                    id="input-login-identifier"
                    type="text"
                    className="form-input"
                    style={iconInputPadding}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={t.usernameOrEmailPlaceholder}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-login-password">
                  <span>{t.password}</span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                    {t.neverLogged}
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)',
                      ...iconPositionStyle,
                    }}
                  />
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={passInputPadding}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      ...toggleEyePositionStyle,
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '22px',
                  fontSize: '0.825rem',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#6366f1', cursor: 'pointer' }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>{t.rememberMe}</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert(t.resetLinkSent)}
                  style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  {t.forgotPassword}
                </button>
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%' }}
              >
                {isLoading ? (
                  <span>{t.signingIn}</span>
                ) : (
                  <>
                    <LogIn size={16} /> {t.signInButton} <ArrowIcon size={15} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* SIGNUP FORM (Quick Test Scenarios completely removed) */
            <form onSubmit={handleSignupSubmit} id="auth-signup-form">
              <div className="form-group">
                <label className="form-label" htmlFor="input-signup-username">
                  <span>{t.username}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{t.minThreeChars}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)',
                      ...iconPositionStyle,
                    }}
                  />
                  <input
                    id="input-signup-username"
                    type="text"
                    className="form-input"
                    style={iconInputPadding}
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder={t.usernamePlaceholder}
                    required
                    minLength={3}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-signup-email">
                  <span>{t.emailAddress}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)',
                      ...iconPositionStyle,
                    }}
                  />
                  <input
                    id="input-signup-email"
                    type="email"
                    className="form-input"
                    style={iconInputPadding}
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-signup-password">
                  <span>{t.createPassword}</span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                    {t.neverLogged}
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)',
                      ...iconPositionStyle,
                    }}
                  />
                  <input
                    id="input-signup-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={passInputPadding}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder={t.minSixChars}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      ...toggleEyePositionStyle,
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-signup-confirm-password">
                  <span>{t.confirmPassword}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-dim)',
                      ...iconPositionStyle,
                    }}
                  />
                  <input
                    id="input-signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    style={passInputPadding}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder={t.confirmPasswordPlaceholder}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      ...toggleEyePositionStyle,
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '22px', fontSize: '0.825rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ accentColor: '#6366f1', cursor: 'pointer', marginTop: '3px' }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>
                    {t.termsAgreement}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                id="btn-signup-submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%' }}
              >
                {isLoading ? (
                  <span>{t.creatingAccount}</span>
                ) : (
                  <>
                    <UserPlus size={16} /> {t.signUpButton} <ArrowIcon size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Log Redaction Guarantee */}
          <div
            style={{
              marginTop: '22px',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.74rem',
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ShieldCheck size={14} color="#10b981" style={{ flexShrink: 0 }} />
            <span>{t.securityNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
