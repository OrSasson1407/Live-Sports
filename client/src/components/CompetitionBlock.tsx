import { ChevronRight } from 'lucide-react';
import { MatchRow } from './MatchRow';
import { useFavourites } from '../hooks/useFavourites';
import { GameTick } from '../store/useSportsStore';

interface CompetitionBlockProps {
  competitionName: string;
  matches: GameTick[];
  showVotePrompt?: boolean;
}

export function CompetitionBlock({ competitionName, matches }: CompetitionBlockProps) {
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <div
      className="sf-card overflow-hidden"
      style={{ marginBottom: '8px' }}
    >
      {/* ── Competition header ──────────────────────────── */}
      <div
        className="comp-header flex items-center justify-between px-3"
        style={{ height: '36px' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Country flag placeholder */}
          <div
            className="w-4 h-4 rounded-sm shrink-0"
            style={{ background: 'hsl(var(--surface-3))' }}
          />
          <span
            className="text-xs font-semibold truncate"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {competitionName}
          </span>
        </div>

        <button
          className="flex items-center gap-0.5 shrink-0 transition-colors"
          style={{ color: 'hsl(var(--muted-foreground))', fontSize: '11px', fontWeight: 500 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(var(--primary))')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(var(--muted-foreground))')}
        >
          More <ChevronRight size={11} />
        </button>
      </div>

      {/* ── Match rows ──────────────────────────────────── */}
      <div>
        {matches.map((match) => (
          <MatchRow
            key={match.gameId}
            match={match}
            isFavourite={isFavourite(match.gameId)}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </div>
    </div>
  );
}
