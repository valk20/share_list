import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Globe, Lock, ArrowLeft, Save } from 'lucide-react';
import { createLogger } from '../utils/logger';
import { useAuth } from '../context/AuthContext';

const createLoggerInstance = createLogger('ListEditor');

export const CreateListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Travel');
  const [isPublic, setIsPublic] = useState(true);
  const [items, setItems] = useState<string[]>(['Passport & Visa Copies', 'International Travel Adapter']);
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setItems((prev) => [...prev, newItemText.trim()]);
    setNewItemText('');
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please specify a list title.');
      return;
    }

    createLoggerInstance.info('New checklist created by user', {
      title,
      category,
      isPublic,
      itemCount: items.length,
      authorId: user ? user.id : 'anonymous',
    });

    alert('List created successfully!');
    navigate('/feed');
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
          Create New Checklist
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Define structured tasks, set visibility, and publish for community cloning.
        </p>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">List Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., First Apartment Moving Checklist"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="Travel" style={{ background: '#0f172a' }}>Travel</option>
                <option value="Relocation" style={{ background: '#0f172a' }}>Relocation</option>
                <option value="Career" style={{ background: '#0f172a' }}>Career</option>
                <option value="Events" style={{ background: '#0f172a' }}>Events</option>
                <option value="Personal" style={{ background: '#0f172a' }}>Personal</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Visibility</label>
              <div style={{ display: 'flex', gap: '8px', height: '42px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${isPublic ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setIsPublic(true)}
                  style={{ flex: 1 }}
                >
                  <Globe size={14} /> Public
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${!isPublic ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setIsPublic(false)}
                  style={{ flex: 1 }}
                >
                  <Lock size={14} /> Private
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Tasks Editor */}
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '8px' }}>
              <span>Checklist Items ({items.length})</span>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                  }}
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="btn-ghost"
                    style={{ border: 'none', color: '#fb7185', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Item Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add next checklist task..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(e);
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddItem}
              >
                <PlusCircle size={15} /> Add
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Save size={16} /> Save & Publish Checklist
          </button>
        </form>
      </div>
    </div>
  );
};
