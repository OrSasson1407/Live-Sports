import { MatchRow } from './MatchRow';
import { useFavourites } from '../hooks/useFavourites';
import { GameTick } from '../store/useSportsStore';
import { ChevronRight } from 'lucide-react';

interface CompetitionBlockProps {
  competitionName: string;
  matches: GameTick[];
  showVotePrompt?: boolean;
}

export function CompetitionBlock({ competitionName, matches, showVotePrompt = true }: CompetitionBlockProps) {
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-2xl">
      {/* Header with "More >" */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-primary/20 to-transparent border-b border-white/10">
        <h3 className="text-xs font-black uppercase tracking-wider text-primary drop-shadow-sm">
          {competitionName}
        </h3>
        <button className="text-[11px] font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition">
          More <ChevronRight size={12} />
        </button>
      </div>

      {/* Match rows */}
      <div className="divide-y divide-white/5">
        {matches.map((match) => (
          <MatchRow
            key={match.gameId}
            match={match}
            isFavourite={isFavourite(match.gameId)}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </div>

      {/* "Who will win? Cast your vote!" prompt at bottom of block (like SofaScore) */}
      {showVotePrompt && matches.length > 0 && (
        <div className="px-4 py-2 border-t border-white/10 bg-white/5 text-center">
          <button
            onClick={() => alert("Vote for your favourite match!")}
            className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            Who will win? Cast your vote! 🗳️
          </button>
        </div>
      )}
    </div>
  );
}