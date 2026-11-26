import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  PlusCircle,
  ListFilter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Sign In Required</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Please log in to view your dashboard and saved checklists.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#ffffff',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user.username}</h1>
                <span className="badge badge-info">{user.role}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                User ID: #{user.id}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/create" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              <PlusCircle size={14} /> New List
            </Link>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
              style={{ color: '#fb7185' }}
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>4</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Lists Created</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>12</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Lists Cloned / Forked</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc' }}>94%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tasks Completion Rate</div>
        </div>
      </div>

      {/* My Lists Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListFilter size={18} color="#6366f1" /> My Active Checklists
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Tokyo 7-Day Travel Itinerary & Packing Guide</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cloned from @globetrotter_ken • 24 items (6 completed)</div>
            </div>
            <Link to="/lists/2" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
              Open Checklist
            </Link>
          </div>

          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Apartment Rental Handover & Inspection Checklist</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Created by you • 18 items (2 completed)</div>
            </div>
            <Link to="/lists/1" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
              Open Checklist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
