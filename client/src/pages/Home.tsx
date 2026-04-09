import { useState } from 'react';
import { useSportsStore } from '../store/useSportsStore';
import { useFavourites } from '../hooks/useFavourites';
import { CompetitionBlock } from '../components/CompetitionBlock';
import Competitions from './Competitions';
import { Activity, Star, Trophy, LayoutGrid } from 'lucide-react';

type Tab = 'all' | 'live' | 'favourites' | 'competitions';

export default function Home() {
  const games = useSportsStore((state) => state.games);
  const { isFavourite } = useFavourites();
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const allMatches = Object.values(games);

  const filtered = allMatches.filter((match) => {
    if (activeTab === 'live') return match.status === 'live';
    if (activeTab === 'favourites') return isFavourite(match.gameId);
    return true;
  });

  const grouped = filtered.reduce((acc, match) => {
    const comp = match.competition || (match.sport === 'soccer' ? 'Football' : 'Basketball');
    if (!acc[comp]) acc[comp] = [];
    acc[comp].push(match);
    return acc;
  }, {} as Record<string, typeof filtered>);

  const liveCount = allMatches.filter((m) => m.status === 'live').length;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'all',          label: 'All',          icon: LayoutGrid },
    { key: 'live',         label: 'Live',         icon: Activity   },
    { key: 'favourites',   label: 'Favourites',   icon: Star       },
    { key: 'competitions', label: 'Competitions', icon: Trophy     },
  ];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>

      {/* ── Tab bar ─────────────────────────────────── */}
      <div style={{
        position: 'sticky',
        top: '52px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        background: 'hsl(var(--background))',
        borderBottom: '1px solid hsl(var(--border))',
        marginBottom: '14px',
      }}>
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`tab-item ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
              }}
            >
              <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
              {label}
              {key === 'live' && liveCount > 0 && (
                <span className="live-pill">{liveCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ─────────────────────────────────── */}
      {activeTab === 'competitions' ? (
        <Competitions />
      ) : (
        <div className="stagger-list">
          {Object.entries(grouped).map(([competition, matches]) => (
            <CompetitionBlock
              key={competition}
              competitionName={competition}
              matches={matches}
            />
          ))}

          {filtered.length === 0 && (
            <div className="empty-state animate-fade-in">
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '12px',
                background: 'hsl(var(--surface-1))',
                border: '1px solid hsl(var(--border))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
              }}>
                {activeTab === 'favourites'
                  ? <Star size={20} style={{ color: 'hsl(var(--muted))' }} />
                  : <Activity size={20} style={{ color: 'hsl(var(--muted))' }} />
                }
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'hsl(var(--foreground-2))', letterSpacing: '-0.01em' }}>
                {activeTab === 'favourites' ? 'No favourites yet' : 'No matches found'}
              </p>
              <p style={{ fontSize: '12.5px', color: 'hsl(var(--muted))', marginTop: '2px' }}>
                {activeTab === 'favourites'
                  ? 'Star a match to follow it here.'
                  : 'Check back soon for upcoming fixtures.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
