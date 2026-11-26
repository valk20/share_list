import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  GitFork,
  Heart,
} from 'lucide-react';
import { createLogger } from '../utils/logger';

const listLogger = createLogger('ListDetailView');

interface ChecklistTask {
  id: number;
  title: string;
  isCompleted: boolean;
}

export const ListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [tasks, setTasks] = useState<ChecklistTask[]>([
    { id: 1, title: 'Document water, electricity, and gas meter readings with photos', isCompleted: true },
    { id: 2, title: 'Test all wall socket outlets and light switches', isCompleted: true },
    { id: 3, title: 'Check water pressure and drainage in kitchen and bathroom sinks', isCompleted: false },
    { id: 4, title: 'Inspect window seals, latches, and balcony door hinges for drafts', isCompleted: false },
    { id: 5, title: 'Test heating elements and radiator thermostats in every room', isCompleted: false },
    { id: 6, title: 'Sign the keys handover protocol with landlord signature', isCompleted: false },
  ]);

  const [likes, setLikes] = useState(142);
  const [hasLiked, setHasLiked] = useState(false);

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          listLogger.info('Checklist item completion toggled', {
            listId: id,
            itemId: taskId,
            newState: nextState ? 'completed' : 'pending',
          });
          return { ...t, isCompleted: nextState };
        }
        return t;
      })
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const toggleLike = () => {
    setHasLiked(!hasLiked);
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    listLogger.info('List like status toggled', { listId: id, liked: !hasLiked });
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Back button */}
      <Link
        to="/feed"
        className="btn btn-ghost btn-sm"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}
      >
        <ArrowLeft size={16} /> Back to Public Feed
      </Link>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-info">Relocation</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Owner: @berlin_tenant</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.3 }}>
              Apartment Rental Handover & Inspection Checklist
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`btn btn-sm ${hasLiked ? 'btn-primary' : 'btn-secondary'}`}
              onClick={toggleLike}
            >
              <Heart size={14} fill={hasLiked ? '#ffffff' : 'none'} /> {likes}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                listLogger.info('Checklist cloned to personal library', { listId: id });
                alert('Cloned checklist to your library!');
              }}
            >
              <GitFork size={14} /> Clone / Fork
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '28px', background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Progress: {completedCount} of {tasks.length} tasks</span>
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Checklist Item Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: task.isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(15, 23, 42, 0.7)',
                border: '1px solid',
                borderColor: task.isCompleted ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {task.isCompleted ? (
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
              ) : (
                <Circle size={18} color="#64748b" style={{ flexShrink: 0 }} />
              )}
              <span
                style={{
                  fontSize: '0.9rem',
                  color: task.isCompleted ? 'var(--text-muted)' : '#f8fafc',
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
