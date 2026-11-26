import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type BackgroundPreset = 'minimal' | 'vibrant' | 'mesh' | 'dark-modern';

interface ThemeContextType {
  themeMode: ThemeMode;
  backgroundPreset: BackgroundPreset;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setBackgroundPreset: (preset: BackgroundPreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'sharelist_theme_mode';
const BG_STORAGE_KEY = 'sharelist_background_preset';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' ? 'light' : 'dark';
  });

  const [backgroundPreset, setBackgroundPresetState] = useState<BackgroundPreset>(() => {
    const saved = localStorage.getItem(BG_STORAGE_KEY) as BackgroundPreset | null;
    return saved && ['minimal', 'vibrant', 'mesh', 'dark-modern'].includes(saved)
      ? saved
      : 'dark-modern';
  });

  useEffect(() => {
    // Apply attributes to both root <html> and <body> for maximum CSS selector compatibility
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.setAttribute('data-bg', backgroundPreset);
    document.body.setAttribute('data-theme', themeMode);
    document.body.setAttribute('data-bg', backgroundPreset);

    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    localStorage.setItem(BG_STORAGE_KEY, backgroundPreset);
  }, [themeMode, backgroundPreset]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleThemeMode = () => {
    setThemeModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setBackgroundPreset = (preset: BackgroundPreset) => {
    setBackgroundPresetState(preset);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        backgroundPreset,
        setThemeMode,
        toggleThemeMode,
        setBackgroundPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
