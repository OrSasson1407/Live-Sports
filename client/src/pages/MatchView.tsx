import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { StatBar } from '../components/StatBar';
import { EventTimeline } from '../components/EventTimeline';
import { PlayerBadge } from '../components/PlayerBadge';

/* Score cell — flashes orange on change */
function ScoreCell({ score }: { score: number }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(score);

  useEffect(() => {
    if (score !== prev.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 400);
      prev.current = score;
      return () => clearTimeout(t);
    }
  }, [score]);

  return (
    <span
      className={flash ? 'score-flash' : ''}
      style={{
        fontSize: '48px',
        fontWeight: 900,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
        color: flash ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
        fontFamily: "'Roboto Condensed', 'Roboto', sans-serif",
      }}
    >
      {score}
    </span>
  );
}

type Tab = 'summary' | 'stats' | 'lineups';

export default function MatchView() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const game = useSportsStore((state) => (matchId ? state.games[matchId] : null));
  const isConnected = useSportsStore((state) => state.isConnected);
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  if (!game) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: '240px', color: 'hsl(var(--muted-foreground))' }}
      >
        {!isConnected ? (
          <>
            <div
              className="rounded-full border-2 mb-3"
              style={{
                width: '28px', height: '28px',
                borderColor: 'hsl(var(--primary))',
                borderTopColor: 'transparent',
                animation: 'spin 0.7s linear infinite',
              }}
            />
            <p style={{ fontSize: '13px' }}>Connecting…</p>
          </>
        ) : (
          <>
            <AlertCircle size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
            <p style={{ fontSize: '13px' }}>Match not found</p>
            <button
              onClick={() => navigate('/')}
              style={{ marginTop: '12px', fontSize: '13px', color: 'hsl(var(--primary))' }}
            >
              Go back
            </button>
          </>
        )}
      </div>
    );
  }

  const isLive = game.status === 'live';
  const isFinished = game.status === 'finished';

  const stats = game.stats || {
    possession:    { home: 55, away: 45 },
    shotsOnTarget: { home: 6,  away: 3  },
    corners:       { home: 5,  away: 2  },
    fouls:         { home: 8,  away: 12 },
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'summary', label: 'Summary' },
    { key: 'stats',   label: 'Statistics' },
    { key: 'lineups', label: 'Lineups' },
  ];

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>

      {/* ── Back link ────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 mb-4 transition-colors"
        style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(var(--foreground))')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(var(--muted-foreground))')}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* ── Score hero card ──────────────────────────────── */}
      <div
        className="sf-card mb-1 overflow-hidden"
      >
        {/* Competition breadcrumb */}
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{
            borderBottom: '1px solid hsl(var(--border))',
            background: 'hsl(var(--surface-2))',
          }}
        >
          <div className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ background: 'hsl(var(--surface-3))' }} />
          <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
            {game.competition || (game.sport === 'soccer' ? 'Football' : 'Basketball')}
          </span>
        </div>

        {/* Score row */}
        <div className="flex items-center px-4 py-6 gap-2">
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
            {/* Crest placeholder */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'hsl(var(--surface-3))' }}
            >
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'hsl(var(--muted-foreground))' }}>
                {game.homeTeam.charAt(0)}
              </span>
            </div>
            <span
              className="text-sm font-semibold text-center leading-tight"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {game.homeTeam}
            </span>
          </div>

          {/* Score + status */}
          <div className="flex flex-col items-center shrink-0 px-2" style={{ minWidth: '120px' }}>
            {/* Status */}
            <div className="mb-2">
              {isLive ? (
                <div className="badge-live">
                  <span className="live-dot" />
                  {game.clock || 'LIVE'}
                </div>
              ) : isFinished ? (
                <span className="badge-ft">Full Time</span>
              ) : (
                <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                  {game.startTime || '19:00'}
                </span>
              )}
            </div>

            {/* Score */}
            <div className="flex items-center gap-3">
              <ScoreCell score={game.homeScore} />
              <span style={{ fontSize: '32px', fontWeight: 300, color: 'hsl(var(--border))', lineHeight: 1 }}>:</span>
              <ScoreCell score={game.awayScore} />
            </div>
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'hsl(var(--surface-3))' }}
            >
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'hsl(var(--muted-foreground))' }}>
                {game.awayTeam.charAt(0)}
              </span>
            </div>
            <span
              className="text-sm font-semibold text-center leading-tight"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              {game.awayTeam}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────── */}
      <div
        className="sf-card mb-3 flex"
        style={{ borderRadius: '0 0 8px 8px', borderTop: 'none' }}
      >
        {tabs.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="relative flex-1 py-3 text-sm font-medium transition-colors"
              style={{
                color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '16px',
                    right: '16px',
                    height: '2px',
                    background: 'hsl(var(--primary))',
                    borderRadius: '1px 1px 0 0',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ──────────────────────────────────── */}
      <div className="sf-card p-4">

        {/* Summary — event timeline */}
        {activeTab === 'summary' && (
          <EventTimeline events={game.events?.length ? game.events : []} />
        )}

        {/* Stats */}
        {activeTab === 'stats' && (
          <div>
            {/* Team name header row */}
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
              <span className="text-xs font-semibold truncate" style={{ color: 'hsl(var(--foreground))', maxWidth: '40%' }}>
                {game.homeTeam}
              </span>
              <span className="text-xs font-semibold truncate text-right" style={{ color: 'hsl(var(--foreground))', maxWidth: '40%' }}>
                {game.awayTeam}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <StatBar label="Possession %"     home={stats.possession.home}    away={stats.possession.away} />
              <StatBar label="Shots on Target"  home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} />
              <StatBar label="Corners"          home={stats.corners.home}       away={stats.corners.away} />
              <StatBar label="Fouls"            home={stats.fouls.home}         away={stats.fouls.away} />
            </div>
          </div>
        )}

        {/* Lineups */}
        {activeTab === 'lineups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Home */}
            <div>
              <div
                className="flex items-center gap-2 mb-2 pb-2"
                style={{ borderBottom: '1px solid hsl(var(--border))' }}
              >
                <div className="w-3.5 h-3.5 rounded-sm" style={{ background: 'hsl(var(--primary))' }} />
                <span className="text-xs font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                  {game.homeTeam}
                </span>
              </div>
              {(game.homeLineup || []).length > 0
                ? (game.homeLineup || []).map((p) => <PlayerBadge key={p.id} {...p} />)
                : <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>No lineup data</p>
              }
            </div>

            {/* Away */}
            <div>
              <div
                className="flex items-center gap-2 mb-2 pb-2"
                style={{ borderBottom: '1px solid hsl(var(--border))' }}
              >
                <div className="w-3.5 h-3.5 rounded-sm" style={{ background: 'hsl(var(--muted-foreground))' }} />
                <span className="text-xs font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                  {game.awayTeam}
                </span>
              </div>
              {(game.awayLineup || []).length > 0
                ? (game.awayLineup || []).map((p) => <PlayerBadge key={p.id} {...p} />)
                : <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>No lineup data</p>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
