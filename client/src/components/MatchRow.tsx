import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../types';
import { useMemo, useState, useEffect, useRef } from 'react';

interface MatchRowProps {
  match: Match;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
}

/* Flashes orange briefly when a score changes */
function ScoreDisplay({ score, previousScore }: { score: number; previousScore: number }) {
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(previousScore);

  useEffect(() => {
    if (score !== prevRef.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 350);
      prevRef.current = score;
      return () => clearTimeout(t);
    }
  }, [score]);

  return (
    <span
      className={`font-mono font-bold text-sm tabular-nums transition-colors ${
        flash ? 'score-flash' : ''
      }`}
      style={{ color: flash ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
    >
      {score}
    </span>
  );
}

export function MatchRow({ match, isFavourite, onToggleFavourite }: MatchRowProps) {
  const navigate = useNavigate();
  const [prevScores] = useState({ home: match.homeScore, away: match.awayScore });

  const statusDisplay = useMemo(() => {
    if (match.status === 'live') {
      return (
        <div className="badge-live">
          <span className="live-dot" />
          {match.clock || 'LIVE'}
        </div>
      );
    }
    if (match.status === 'finished') {
      return <span className="badge-ft">FT</span>;
    }
    return (
      <div className="flex items-center gap-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
        <Clock size={11} />
        <span style={{ fontSize: '12px', fontWeight: 500 }}>{match.startTime || '19:00'}</span>
      </div>
    );
  }, [match.status, match.clock, match.startTime]);

  return (
    <div
      className="match-row flex items-center px-3 py-0 cursor-pointer"
      style={{
        minHeight: '52px',
        borderBottom: '1px solid hsl(var(--border))',
      }}
      onClick={() => navigate(`/match/${match.gameId}`)}
    >
      {/* ── Status column ────────────────────────────── */}
      <div className="flex flex-col items-center justify-center shrink-0" style={{ width: '52px' }}>
        {statusDisplay}
      </div>

      {/* ── Vertical divider ─────────────────────────── */}
      <div className="self-stretch w-px shrink-0 mx-2" style={{ background: 'hsl(var(--border))' }} />

      {/* ── Teams + scores ───────────────────────────── */}
      <div className="flex-1 flex flex-col gap-0.5 py-2 min-w-0">
        {/* Home team */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Team crest placeholder */}
            <div
              className="w-4 h-4 rounded-sm shrink-0"
              style={{ background: 'hsl(var(--surface-3))' }}
            />
            <span
              className="text-sm truncate"
              style={{
                fontWeight: match.homeScore > match.awayScore ? 700 : 400,
                color: match.status === 'finished' && match.awayScore > match.homeScore
                  ? 'hsl(var(--muted-foreground))'
                  : 'hsl(var(--foreground))',
              }}
            >
              {match.homeTeam}
            </span>
          </div>
          <ScoreDisplay score={match.homeScore} previousScore={prevScores.home} />
        </div>

        {/* Away team */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-4 h-4 rounded-sm shrink-0"
              style={{ background: 'hsl(var(--surface-3))' }}
            />
            <span
              className="text-sm truncate"
              style={{
                fontWeight: match.awayScore > match.homeScore ? 700 : 400,
                color: match.status === 'finished' && match.homeScore > match.awayScore
                  ? 'hsl(var(--muted-foreground))'
                  : 'hsl(var(--foreground))',
              }}
            >
              {match.awayTeam}
            </span>
          </div>
          <ScoreDisplay score={match.awayScore} previousScore={prevScores.away} />
        </div>
      </div>

      {/* ── Favourite star ───────────────────────────── */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavourite(match.gameId); }}
        className="shrink-0 p-2 rounded transition-colors ml-1"
        style={{ color: isFavourite ? '#fcca22' : 'hsl(var(--surface-3))' }}
        onMouseEnter={(e) => {
          if (!isFavourite) (e.currentTarget as HTMLElement).style.color = 'hsl(var(--muted-foreground))';
        }}
        onMouseLeave={(e) => {
          if (!isFavourite) (e.currentTarget as HTMLElement).style.color = 'hsl(var(--surface-3))';
        }}
      >
        <Star
          size={15}
          fill={isFavourite ? '#fcca22' : 'none'}
          strokeWidth={isFavourite ? 0 : 1.5}
        />
      </button>
    </div>
  );
}
