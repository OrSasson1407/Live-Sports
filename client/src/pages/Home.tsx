import { useState } from 'react';
import { useSportsStore } from '../store/useSportsStore';
import { useFavourites } from '../hooks/useFavourites';
import { MatchCard } from '../components/MatchCard';
import { ChevronRight } from 'lucide-react';

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
    <div className="animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-5">
        {(['all', 'live', 'favourites'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'live' && liveCount > 0 && (
              <span className="ml-1.5 text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">
                {liveCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Match list */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([comp, matches]) => (
          <div key={comp} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-secondary/30 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold">{comp}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
            <div className="divide-y divide-border">
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

        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border">
            <p className="text-lg font-medium mb-1">No matches found</p>
            <p className="text-sm">Try changing the filter</p>
          </div>
        )}
      </div>
    </div>
  );
}