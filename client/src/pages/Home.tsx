import { useState } from 'react';
import { useSportsStore } from '../store/useSportsStore';
import { useFavourites } from '../hooks/useFavourites';
import { MatchCard } from '../components/MatchCard';

type Tab = 'all' | 'live' | 'favourites';

export default function Home() {
  const games = useSportsStore((state) => state.games);
  const { isFavourite, toggleFavourite } = useFavourites();
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const allMatches = Object.values(games);

  const filtered = allMatches.filter((match) => {
    if (activeTab === 'live') return match.status === 'live';
    if (activeTab === 'favourites') return isFavourite(match.gameId);
    return true;
  });

  const grouped = filtered.reduce((acc, match) => {
    const key = match.sport === 'soccer' ? '⚽ Football' : '🏀 Basketball';
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {} as Record<string, typeof filtered>);

  const liveCount = allMatches.filter((m) => m.status === 'live').length;

  return (
    <div className="px-2">

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-3 sticky top-0 bg-background z-20">
        {(['all', 'live', 'favourites'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold transition ${
              activeTab === tab
                ? 'text-primary'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            {tab.toUpperCase()}
            {tab === 'live' && liveCount > 0 && (
              <span className="ml-2 text-xs bg-red-500 px-1.5 py-0.5 rounded">
                {liveCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Match sections */}
      <div className="space-y-3">
        {Object.entries(grouped).map(([comp, matches]) => (
          <div key={comp} className="card-glass rounded-lg overflow-hidden">

            {/* Header */}
            <div className="px-4 py-2 text-[11px] font-bold tracking-wider text-muted-foreground bg-gradient-to-r from-white/5 to-transparent">
              {comp}
            </div>

            {/* Matches */}
            <div className="divide-y divide-border/60">
              {matches.map((match) => (
                <MatchCard
                  key={match.gameId}
                  match={match}
                  isFavourite={isFavourite(match.gameId)}
                  onToggleFavourite={toggleFavourite}
                />
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}