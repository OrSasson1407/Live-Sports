import { useState } from 'react';
import { useSportsStore } from '../store/useSportsStore';
import { useFavourites } from '../hooks/useFavourites';
import { CompetitionBlock } from '../components/CompetitionBlock';
import Competitions from './Competitions';

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

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'live', label: 'Live' },
    { key: 'favourites', label: 'Favourites' },
    { key: 'competitions', label: 'Competitions' },
  ];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>

      {/* ── Tab bar ──────────────────────────────────────── */}
      <div
        className="sticky z-20 flex"
        style={{
          top: '48px',           /* sits just below the 48px header */
          background: 'hsl(var(--background))',
          borderBottom: '1px solid hsl(var(--border))',
          marginBottom: '12px',
        }}
      >
        {tabs.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors"
              style={{
                color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
              {key === 'live' && liveCount > 0 && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#fff',
                    background: '#e03434',
                    padding: '1px 5px',
                    borderRadius: '10px',
                    lineHeight: '16px',
                  }}
                >
                  {liveCount}
                </span>
              )}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'hsl(var(--primary))',
                    borderRadius: '1px 1px 0 0',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      {activeTab === 'competitions' ? (
        <Competitions />
      ) : (
        <div>
          {Object.entries(grouped).map(([competition, matches]) => (
            <CompetitionBlock
              key={competition}
              competitionName={competition}
              matches={matches}
            />
          ))}

          {filtered.length === 0 && (
            <div
              className="text-center py-16"
              style={{
                color: 'hsl(var(--muted-foreground))',
                fontSize: '14px',
              }}
            >
              {activeTab === 'favourites'
                ? 'No favourites yet. Star a match to follow it here.'
                : 'No matches found.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
