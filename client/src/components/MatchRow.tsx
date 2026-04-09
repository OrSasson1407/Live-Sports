import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../types';
import { useMemo, useState, useEffect, useRef } from 'react';

interface MatchRowProps {
  match: Match;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
}

function ScoreDisplay({ score, previousScore }: { score: number; previousScore: number }) {
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(previousScore);

  useEffect(() => {
    if (score !== prevRef.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 400);
      prevRef.current = score;
      return () => clearTimeout(t);
    }
  }, [score]);

  return (
    <span
      className={flash ? 'score-flash' : ''}
      style={{
        fontFamily: "'SF Mono', 'Fira Code', monospace",
        fontVariantNumeric: 'tabular-nums',
        fontSize: '13px',
        fontWeight: 700,
        lineHeight: 1,
        color: flash ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
        minWidth: '14px',
        textAlign: 'center',
        display: 'block',
      }}
    >
      {score}
    </span>
  );
}

function TeamAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  return (
    <div className="team-avatar">{initials}</div>
  );
}

export function MatchRow({ match, isFavourite, onToggleFavourite }: MatchRowProps) {
  const navigate = useNavigate();
  const [prevScores] = useState({ home: match.homeScore, away: match.awayScore });
  const isLive = match.status === 'live';

  const statusDisplay = useMemo(() => {
    if (isLive) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'hsl(var(--muted))' }}>
        <Clock size={10} strokeWidth={2} />
        <span style={{ fontSize: '11.5px', fontWeight: 500 }}>{match.startTime || '—'}</span>
      </div>
    );
  }, [match.status, match.clock, match.startTime, isLive]);

  const homeWin = match.homeScore > match.awayScore;
  const awayWin = match.awayScore > match.homeScore;
  const isDone = match.status === 'finished';

  return (
    <div
      className={`match-row flex items-center cursor-pointer ${isLive ? 'is-live' : ''}`}
      style={{
        minHeight: '54px',
        borderBottom: '1px solid hsl(var(--border-subtle))',
        paddingLeft: '14px',
        paddingRight: '8px',
        paddingTop: '8px',
        paddingBottom: '8px',
        gap: '12px',
      }}
      onClick={() => navigate(`/match/${match.gameId}`)}
    >
      {/* Status */}
      <div style={{ width: '58px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        {statusDisplay}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', alignSelf: 'stretch', background: 'hsl(var(--border-subtle))', flexShrink: 0 }} />

      {/* Teams */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}>
        {/* Home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TeamAvatar name={match.homeTeam} />
          <span style={{
            fontSize: '13px',
            fontWeight: isDone ? (homeWin ? 700 : 400) : (isLive && homeWin ? 700 : 500),
            color: isDone && awayWin ? 'hsl(var(--muted))' : 'hsl(var(--foreground))',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
          }}>
            {match.homeTeam}
          </span>
          <ScoreDisplay score={match.homeScore} previousScore={prevScores.home} />
        </div>

        {/* Away */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TeamAvatar name={match.awayTeam} />
          <span style={{
            fontSize: '13px',
            fontWeight: isDone ? (awayWin ? 700 : 400) : (isLive && awayWin ? 700 : 500),
            color: isDone && homeWin ? 'hsl(var(--muted))' : 'hsl(var(--foreground))',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
          }}>
            {match.awayTeam}
          </span>
          <ScoreDisplay score={match.awayScore} previousScore={prevScores.away} />
        </div>
      </div>

      {/* Fav star */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavourite(match.gameId); }}
        style={{
          flexShrink: 0,
          padding: '6px',
          borderRadius: '6px',
          color: isFavourite ? 'hsl(var(--warning))' : 'hsl(var(--surface-3))',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.12s, background 0.12s',
        }}
        onMouseEnter={(e) => {
          if (!isFavourite) (e.currentTarget as HTMLElement).style.color = 'hsl(var(--muted))';
          (e.currentTarget as HTMLElement).style.background = 'hsl(var(--surface-1))';
        }}
        onMouseLeave={(e) => {
          if (!isFavourite) (e.currentTarget as HTMLElement).style.color = 'hsl(var(--surface-3))';
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        <Star
          size={14}
          fill={isFavourite ? 'hsl(var(--warning))' : 'none'}
          strokeWidth={isFavourite ? 0 : 1.8}
        />
      </button>
    </div>
  );
}
