import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const BackgroundAccents: React.FC = () => {
  const { themeMode, backgroundPreset } = useTheme();
  const isDark = themeMode === 'dark';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* 1. MINIMAL: Architectural Dot Grid */}
      {backgroundPreset === 'minimal' && (
        <svg
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: isDark ? 0.22 : 0.45,
          }}
        >
          <defs>
            <pattern
              id="minimal-dot-pattern"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1.2"
                fill={isDark ? '#818cf8' : '#6366f1'}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#minimal-dot-pattern)" />
        </svg>
      )}

      {/* 2. VIBRANT GRADIENT: Fluid Waves & Floating Card Accents */}
      {backgroundPreset === 'vibrant' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-10%',
              width: '60vw',
              height: '60vw',
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(165, 180, 252, 0.35) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              right: '-10%',
              width: '55vw',
              height: '55vw',
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(204, 251, 241, 0.5) 0%, transparent 70%)',
              filter: 'blur(70px)',
            }}
          />
          {/* Subtle SVG Wave Curves */}
          <svg
            viewBox="0 0 1440 800"
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              opacity: isDark ? 0.12 : 0.25,
            }}
            preserveAspectRatio="none"
          >
            <path
              d="M0,192L48,208C96,224,192,256,288,245.3C384,235,480,181,576,176C672,171,768,213,864,224C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,800L1392,800C1344,800,1248,800,1152,800C1056,800,960,800,864,800C768,800,672,800,576,800C480,800,384,800,288,800C192,800,96,800,48,800L0,800Z"
              fill={isDark ? '#6366f1' : '#818cf8'}
            />
          </svg>
        </>
      )}

      {/* 3. SOFT MESH / GEOMETRIC: Checklist Doodles & Aurora Spheres */}
      {backgroundPreset === 'mesh' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '5%',
              right: '15%',
              width: '45vw',
              height: '45vw',
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, transparent 65%)'
                : 'radial-gradient(circle, rgba(251, 207, 232, 0.45) 0%, transparent 65%)',
              filter: 'blur(75px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '10%',
              width: '40vw',
              height: '40vw',
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 65%)'
                : 'radial-gradient(circle, rgba(167, 243, 208, 0.45) 0%, transparent 65%)',
              filter: 'blur(75px)',
            }}
          />
          {/* Subtle Geometric Checklist / Note Outlines */}
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, opacity: isDark ? 0.08 : 0.18 }}
          >
            {/* Floating rounded checklist rectangle illustration */}
            <g transform="translate(100, 140) rotate(-6)">
              <rect
                x="0"
                y="0"
                width="160"
                height="220"
                rx="14"
                fill="none"
                stroke={isDark ? '#a5b4fc' : '#6366f1'}
                strokeWidth="2"
              />
              <rect x="20" y="30" width="16" height="16" rx="4" fill={isDark ? '#10b981' : '#059669'} />
              <line x1="46" y1="38" x2="135" y2="38" stroke={isDark ? '#a5b4fc' : '#6366f1'} strokeWidth="2.5" strokeLinecap="round" />
              <rect x="20" y="65" width="16" height="16" rx="4" fill={isDark ? '#10b981' : '#059669'} />
              <line x1="46" y1="73" x2="125" y2="73" stroke={isDark ? '#a5b4fc' : '#6366f1'} strokeWidth="2.5" strokeLinecap="round" />
              <rect x="20" y="100" width="16" height="16" rx="4" fill="none" stroke={isDark ? '#a5b4fc' : '#6366f1'} strokeWidth="2" />
              <line x1="46" y1="108" x2="140" y2="108" stroke={isDark ? '#a5b4fc' : '#6366f1'} strokeWidth="2.5" strokeLinecap="round" />
            </g>

            <g transform="translate(1120, 360) rotate(8)">
              <rect
                x="0"
                y="0"
                width="180"
                height="240"
                rx="16"
                fill="none"
                stroke={isDark ? '#38bdf8' : '#0284c7'}
                strokeWidth="2"
              />
              <circle cx="28" cy="36" r="8" fill={isDark ? '#38bdf8' : '#0284c7'} />
              <line x1="48" y1="36" x2="150" y2="36" stroke={isDark ? '#38bdf8' : '#0284c7'} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="28" cy="72" r="8" fill={isDark ? '#38bdf8' : '#0284c7'} />
              <line x1="48" y1="72" x2="130" y2="72" stroke={isDark ? '#38bdf8' : '#0284c7'} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </svg>
        </>
      )}

      {/* 4. DARK MODERN: Perspective Cyber Grid & Futuristic Nodes */}
      {backgroundPreset === 'dark-modern' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: '10%',
              width: '50vw',
              height: '50vw',
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(199, 210, 254, 0.45) 0%, transparent 70%)',
              filter: 'blur(70px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10%',
              right: '5%',
              width: '45vw',
              height: '45vw',
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(165, 243, 252, 0.45) 0%, transparent 70%)',
              filter: 'blur(70px)',
            }}
          />
          <svg
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isDark ? 0.15 : 0.28,
            }}
          >
            <defs>
              <pattern
                id="modern-grid-pattern"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke={isDark ? '#6366f1' : '#4f46e5'}
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modern-grid-pattern)" />
          </svg>
        </>
      )}
    </div>
  );
};
