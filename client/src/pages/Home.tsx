import { useState } from 'react';
import { useSportsStore } from '../store/useSportsStore';
import { useFavourites } from '../hooks/useFavourites';
import { CompetitionBlock } from '../components/CompetitionBlock';
import Competitions from './Competitions'; // reuse competition list

type Tab = 'all' | 'live' | 'favourites' | 'competitions';

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

  // Group matches by competition (using sport or custom field)
  const grouped = filtered.reduce((acc, match) => {
    const comp = match.competition || (match.sport === 'soccer' ? '⚽ Football' : '🏀 Basketball');
    if (!acc[comp]) acc[comp] = [];
    acc[comp].push(match);
    return acc;
  }, {} as Record<string, typeof filtered>);

  const liveCount = allMatches.filter(m => m.status === 'live').length;

  return (
    <div className="max-w-5xl mx-auto px-3">
      {/* SofaScore style tabs */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-white/10 pt-2 pb-0 mb-5">
        <div className="flex gap-6">
          {(['all', 'live', 'favourites', 'competitions'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-black transition-all relative ${
                activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-white'
              }`}
            >
              {tab.toUpperCase()}
              {tab === 'live' && liveCount > 0 && (
                <span className="ml-2 text-[11px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full shadow-md">
                  {liveCount}
                </span>
              )}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full shadow-glow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'competitions' ? (
        <Competitions />
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([competition, matches]) => (
            <CompetitionBlock key={competition} competitionName={competition} matches={matches} showVotePrompt={true} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm bg-white/5 rounded-2xl backdrop-blur-sm">
              No matches found
            </div>
          )}
        </div>
      )}
    </div>
  );
}