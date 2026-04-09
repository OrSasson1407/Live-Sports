import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { GameTick } from '../store/useSportsStore';

export default function CompetitionBlock({
  competitionName,
  matches,
}: {
  competitionName: string;
  matches: GameTick[];
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      {/* Competition header */}
      <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {competitionName}
        </h3>
        <button className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1">
          More <ChevronRight size={12} />
        </button>
      </div>

      {/* Match rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
        {matches.map((match) => (
          <div
            key={match.gameId}
            onClick={() => navigate(`/match/${match.gameId}`)}
            className="group grid grid-cols-12 items-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            {/* Time / status column */}
            <div className="col-span-2 text-xs font-medium">
              {match.status === 'live' ? (
                <span className="inline-flex items-center gap-1.5 text-red-500">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  {match.clock}
                </span>
              ) : (
                <span className="text-gray-400">{match.clock || '—'}</span>
              )}
            </div>

            {/* Home team + score */}
            <div className="col-span-4 flex items-center justify-between pr-4">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {match.homeTeam}
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {match.homeScore}
              </span>
            </div>

            {/* Away team + score */}
            <div className="col-span-4 flex items-center justify-between pr-4">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {match.awayTeam}
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {match.awayScore}
              </span>
            </div>

            {/* Vote button */}
            <div className="col-span-2 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Vote for ${match.homeTeam} vs ${match.awayTeam}`);
                }}
                className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
              >
                Who will win? <span className="ml-1">🎯</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}