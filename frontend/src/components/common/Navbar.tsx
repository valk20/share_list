import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Compass,
  PlusCircle,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Globe,
  Palette,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme, type BackgroundPreset } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t, direction } = useLanguage();
  const { themeMode, toggleThemeMode, backgroundPreset, setBackgroundPreset } = useTheme();
  const navigate = useNavigate();

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close palette dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: isActive ? '#06b6d4' : 'var(--text-muted)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
    transition: 'all 0.15s ease',
  });

  const bgPresets: { id: BackgroundPreset; name: string; color: string }[] = [
    { id: 'dark-modern', name: t.bgDarkModern, color: '#6366f1' },
    { id: 'vibrant', name: t.bgVibrant, color: '#ec4899' },
    { id: 'mesh', name: t.bgMesh, color: '#10b981' },
    { id: 'minimal', name: t.bgMinimal, color: '#94a3b8' },
  ];

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand & Main Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                {t.brandName}
              </span>
              <span
                style={{
                  marginRight: direction === 'rtl' ? '8px' : '0',
                  marginLeft: direction === 'ltr' ? '8px' : '0',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}
              >
                {t.brandTag}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <NavLink to="/feed" style={navLinkStyle}>
              <Compass size={15} /> {t.feed}
            </NavLink>
            <NavLink to="/create" style={navLinkStyle}>
              <PlusCircle size={15} /> {t.newList}
            </NavLink>
          </nav>
        </div>

        {/* Right Controls: i18n, Theme & Background Switchers, Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Language Switcher (EN / HE) */}
          <button
            type="button"
            id="btn-language-toggle"
            onClick={toggleLanguage}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '6px 10px',
              fontFamily: 'inherit',
              fontSize: '0.78rem',
              fontWeight: 700,
              gap: '6px',
            }}
            title={language === 'en' ? 'החלף לעברית' : 'Switch to English'}
          >
            <Globe size={14} color="#38bdf8" />
            <span>{language === 'en' ? 'עברית' : 'EN'}</span>
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            type="button"
            id="btn-theme-toggle"
            onClick={toggleThemeMode}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '6px 10px',
              fontSize: '0.78rem',
            }}
            title={themeMode === 'dark' ? t.lightMode : t.darkMode}
          >
            {themeMode === 'dark' ? (
              <Sun size={15} color="#fbbf24" />
            ) : (
              <Moon size={15} color="#6366f1" />
            )}
          </button>

          {/* Background Preset Dropdown */}
          <div style={{ position: 'relative' }} ref={themeMenuRef}>
            <button
              type="button"
              id="btn-bg-presets-menu"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '6px 10px',
                fontSize: '0.78rem',
              }}
              title={t.backgroundStyle}
            >
              <Palette size={15} color="#ec4899" />
            </button>

            {isThemeMenuOpen && (
              <div
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: direction === 'ltr' ? 0 : 'auto',
                  left: direction === 'rtl' ? 0 : 'auto',
                  width: '180px',
                  padding: '8px',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--text-dim)',
                    padding: '4px 8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {t.backgroundStyle}
                </div>
                {bgPresets.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => {
                      setBackgroundPreset(bg.id);
                      setIsThemeMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor:
                        backgroundPreset === bg.id
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'transparent',
                      color:
                        backgroundPreset === bg.id
                          ? 'var(--accent-primary)'
                          : 'var(--text-main)',
                      fontSize: '0.78rem',
                      fontWeight: backgroundPreset === bg.id ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: direction === 'rtl' ? 'right' : 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: bg.color,
                        }}
                      />
                      {bg.name}
                    </span>
                    {backgroundPreset === bg.id && <Check size={13} color="var(--accent-primary)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Sign In */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <NavLink to="/profile" style={navLinkStyle}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {user.username[0].toUpperCase()}
                </div>
                <span>{user.username}</span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                style={{ color: '#fb7185', padding: '6px' }}
                title={t.logOut}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <NavLink to="/login" style={navLinkStyle}>
              <LogIn size={15} />
              <span>{t.signIn}</span>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};
