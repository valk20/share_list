import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  GitFork,
  Heart,
  CheckSquare,
  PlusCircle,
  Tag,
} from 'lucide-react';
import { createLogger } from '../utils/logger';
import { useLanguage } from '../context/LanguageContext';

const feedLogger = createLogger('FeedView');

interface MockList {
  id: number;
  categoryKey: string;
  owner: string;
  itemCount: number;
  completedSample: number;
  likes: number;
  forks: number;
}

const BASE_LISTS: MockList[] = [
  {
    id: 1,
    categoryKey: 'Relocation',
    owner: 'berlin_tenant',
    itemCount: 18,
    completedSample: 0,
    likes: 142,
    forks: 89,
  },
  {
    id: 2,
    categoryKey: 'Travel',
    owner: 'globetrotter_ken',
    itemCount: 24,
    completedSample: 0,
    likes: 318,
    forks: 215,
  },
  {
    id: 3,
    categoryKey: 'Career',
    owner: 'dev_mentor_amy',
    itemCount: 30,
    completedSample: 0,
    likes: 564,
    forks: 412,
  },
  {
    id: 4,
    categoryKey: 'Events',
    owner: 'curator_sarah',
    itemCount: 22,
    completedSample: 0,
    likes: 89,
    forks: 47,
  },
];

export const FeedPage: React.FC = () => {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [forkCounts, setForkCounts] = useState<Record<number, number>>({
    1: 89,
    2: 215,
    3: 412,
    4: 47,
  });

  const categories = useMemo(() => [
    { key: 'All', label: t.catAll },
    { key: 'Travel', label: t.catTravel },
    { key: 'Relocation', label: t.catRelocation },
    { key: 'Career', label: t.catCareer },
    { key: 'Events', label: t.catEvents },
  ], [t]);

  // Localized mock list metadata
  const localizedLists = useMemo(() => {
    return BASE_LISTS.map((item) => {
      let title = '';
      let description = '';
      let categoryLabel = '';

      switch (item.id) {
        case 1:
          title = t.mockList1Title;
          description = t.mockList1Desc;
          categoryLabel = t.catRelocation;
          break;
        case 2:
          title = t.mockList2Title;
          description = t.mockList2Desc;
          categoryLabel = t.catTravel;
          break;
        case 3:
          title = t.mockList3Title;
          description = t.mockList3Desc;
          categoryLabel = t.catCareer;
          break;
        case 4:
        default:
          title = t.mockList4Title;
          description = t.mockList4Desc;
          categoryLabel = t.catEvents;
          break;
      }

      return {
        ...item,
        title,
        description,
        categoryLabel,
        forks: forkCounts[item.id] ?? item.forks,
      };
    });
  }, [t, forkCounts]);

  const handleFork = (list: { id: number; title: string; owner: string }) => {
    feedLogger.info('User initiated checklist cloning/forking', {
      sourceListId: list.id,
      listTitle: list.title,
      sourceOwner: list.owner,
    });
    setForkCounts((prev) => ({
      ...prev,
      [list.id]: (prev[list.id] ?? 0) + 1,
    }));
    alert(t.clonedAlert.replace('{title}', list.title));
  };

  const filteredLists = localizedLists.filter((list) => {
    const matchesCategory =
      selectedCategory === 'All' || list.categoryKey.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesSearch =
      list.title.toLowerCase().includes(query) ||
      list.description.toLowerCase().includes(query) ||
      list.categoryLabel.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Feed Hero */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={22} color="#06b6d4" />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              {t.feedTitle}
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '640px', lineHeight: 1.6 }}>
            {t.feedSubtitle}
          </p>
        </div>

        <Link to="/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <PlusCircle size={16} /> {t.createNewList}
        </Link>
      </div>

      {/* Search and Category Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search Input with RTL Aware Icon Placement */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
              left: isRtl ? 'auto' : '14px',
              right: isRtl ? '14px' : 'auto',
            }}
          />
          <input
            type="text"
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              paddingLeft: isRtl ? '14px' : '40px',
              paddingRight: isRtl ? '40px' : '14px',
              height: '42px',
            }}
          />
        </div>

        {/* High-Contrast Category Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            <Tag size={14} />
          </div>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`filter-chip ${selectedCategory === cat.key ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredLists.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              gridColumn: '1 / -1',
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <Compass size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>{t.searchPlaceholder}</p>
          </div>
        ) : (
          filteredLists.map((item) => (
            <div
              key={item.id}
              className="glass-panel animate-fade-in"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span className="badge badge-info">{item.categoryLabel}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {t.byAuthor} @{item.owner}
                  </span>
                </div>

                <Link
                  to={`/lists/${item.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'var(--text-main)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '10px',
                    lineHeight: 1.45,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#6366f1')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                >
                  {item.title}
                </Link>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckSquare size={14} color="#10b981" /> {item.itemCount} {t.itemsCount}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Heart size={14} color="#f43f5e" /> {item.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <GitFork size={14} color="#818cf8" /> {item.forks}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleFork(item)}
                  title={t.forkAction}
                >
                  <GitFork size={13} /> {t.forkAction}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
