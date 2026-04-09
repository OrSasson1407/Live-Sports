import { useState } from 'react';
import { useSportsStore } from '../store/useSportsStore';
import CompetitionBlock from '../components/CompetitionBlock';

type Tab = 'all' | 'live' | 'favourites' | 'competitions' | 'today' | 'odds';

export default function Home() {
  const games = useSportsStore((state) => state.games);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  // Convert games object to array and filter by tab
  const allMatches = Object.values(games);

  const filterMatches = () => {
    if (activeTab === 'live') {
      return allMatches.filter((g) => g.status === 'live');
    }
    // For demo, 'all', 'today', etc. show everything
    // In real app, 'today' would filter by date
    return allMatches;
  };

  const filtered = filterMatches();

  // Group by competition
  const grouped = filtered.reduce((acc, match) => {
    const comp = match.competition || 'Other';
    if (!acc[comp]) acc[comp] = [];
    acc[comp].push(match);
    return acc;
  }, {} as Record<string, typeof filtered>);

  const liveCount = allMatches.filter((g) => g.status === 'live').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Tabs row */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
        {(['all', 'live', 'favourites', 'competitions', 'today', 'odds'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab}
            {tab === 'live' && liveCount > 0 && (
              <span className="ml-1.5 text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                {liveCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Competition blocks */}
      {Object.entries(grouped).map(([compName, matches]) => (
        <CompetitionBlock key={compName} competitionName={compName} matches={matches} />
      ))}

      {/* Empty state */}
      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-12 text-gray-500">No matches for this filter.</div>
      )}
    </div>
  );
}