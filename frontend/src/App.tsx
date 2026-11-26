import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createLogger } from './utils/logger';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { BackgroundAccents } from './components/common/BackgroundAccents';
import { AuthPage } from './pages/AuthPage';
import { FeedPage } from './pages/FeedPage';
import { ListDetailPage } from './pages/ListDetailPage';
import { CreateListPage } from './pages/CreateListPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

const appLogger = createLogger('AppRouter');

export const App: React.FC = () => {
  useEffect(() => {
    // Internal logging only (visible in browser DevTools console, not to end users)
    appLogger.info('ShareList Client Framework initialized', {
      framework: 'React 19 + TypeScript + Vite',
      router: 'react-router-dom',
      phase: 'Phase 3: Frontend Development & UI',
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            {/* Themed SVG / Pattern Accents Layer */}
            <BackgroundAccents />

            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
              {/* Global Header Navigation (Clean, no debug/logs UI) */}
              <Navbar />

              {/* Client Application Routing */}
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Default redirect to Auth/Login view placeholder */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/auth" element={<Navigate to="/login" replace />} />

                  {/* Phase 3 Roadmap Pages */}
                  <Route path="/feed" element={<FeedPage />} />
                  <Route path="/lists/:id" element={<ListDetailPage />} />
                  <Route path="/create" element={<CreateListPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
