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
  const liveCount = matches.filter(m => m.status === 'live').length;

  return (
    <div className="sf-card animate-slide-in" style={{ marginBottom: '10px' }}>
      {/* Header */}
      <div
        className="comp-header flex items-center justify-between"
        style={{ height: '38px', paddingLeft: '14px', paddingRight: '10px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {/* Flag/icon placeholder */}
          <div style={{
            width: '18px', height: '18px',
            borderRadius: '3px',
            background: 'hsl(var(--surface-3))',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'hsl(var(--foreground))',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {competitionName}
          </span>
          {liveCount > 0 && (
            <span className="live-pill">{liveCount} live</span>
          )}
        </div>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            color: 'hsl(var(--muted))',
            fontSize: '11px',
            fontWeight: 600,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'color 0.12s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(var(--primary))')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(var(--muted))')}
        >
          More <ChevronRight size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Rows */}
      <div>
        {matches.map((match, i) => (
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
