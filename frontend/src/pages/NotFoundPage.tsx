import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#6366f1', marginBottom: '8px' }}>404</h1>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Page Not Found</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          The checklist or page you are looking for does not exist or has been moved.
        </p>
        <Link to="/feed" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Return to Feed
        </Link>
      </div>
    </div>
  );
};
