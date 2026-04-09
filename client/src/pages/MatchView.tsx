import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';
import { ArrowLeft, Calendar, Users, BarChart3, Activity, AlertCircle, Sparkles } from 'lucide-react';
import { StatBar } from '../components/StatBar';
import { EventTimeline } from '../components/EventTimeline';
import { PlayerBadge } from '../components/PlayerBadge';

function ScoreDisplay({ score }: { score: number }) {
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
    <span className={`text-5xl md:text-7xl font-black tabular-nums transition-all ${flash ? 'text-primary scale-110 drop-shadow-glow' : 'text-white'}`}>
      {score}
    </span>
  );
}

export default function MatchView() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const game = useSportsStore((state) => (matchId ? state.games[matchId] : null));
  const isConnected = useSportsStore((state) => state.isConnected);
  const [activeTab, setActiveTab] = useState<'summary' | 'stats' | 'lineups'>('summary');

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white/5 rounded-2xl backdrop-blur-sm">
        {!isConnected ? (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-3" />
            <p className="text-muted-foreground">Connecting...</p>
          </>
        ) : (
          <>
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Match not found</p>
            <button onClick={() => navigate('/')} className="mt-4 text-primary text-sm hover:underline">
              Go back
            </button>
          </>
        )}
      </div>
    );
  }

  const isLive = game.status === 'live';
  const isFinished = game.status === 'finished';
  
  const events = game.events?.length ? game.events : [];
  const homeLineup = game.homeLineup || [];
  const awayLineup = game.awayLineup || [];
  const stats = game.stats || {
    possession: { home: 55, away: 45 },
    shotsOnTarget: { home: 6, away: 3 },
    corners: { home: 5, away: 2 },
    fouls: { home: 8, away: 12 },
  };

  return (
    <div className="max-w-3xl mx-auto px-3">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-5 transition">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-gradient-to-br from-card to-card/80 rounded-2xl border border-white/10 p-6 mb-6 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-between items-center gap-6">
          <div className="flex-1 text-center">
            <div className="text-xl font-black truncate">{game.homeTeam}</div>
            <div className="mt-2">
              <ScoreDisplay score={game.homeScore} />
            </div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-sm text-muted-foreground mb-1">
              {isLive ? (
                <span className="text-red-500 flex items-center gap-1 justify-center bg-red-500/20 px-2 py-0.5 rounded-full">
                  <span className="live-dot" /> {game.clock || "LIVE"}
                </span>
              ) : isFinished ? (
                <span className="bg-white/10 px-2 py-0.5 rounded-full">FT</span>
              ) : (
                <span className="bg-white/10 px-2 py-0.5 rounded-full">{game.startTime || "19:00"}</span>
              )}
            </div>
            <div className="text-2xl text-muted-foreground font-black">—</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xl font-black truncate">{game.awayTeam}</div>
            <div className="mt-2">
              <ScoreDisplay score={game.awayScore} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b border-white/10 mb-5">
        {(['summary', 'stats', 'lineups'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-black transition-colors relative ${
              activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-card/50 rounded-xl border border-white/10 p-5 backdrop-blur-sm shadow-lg">
        {activeTab === 'summary' && (
          events.length ? <EventTimeline events={events} /> : <p className="text-muted-foreground text-sm">No events yet</p>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-5">
            <StatBar label="Possession" home={stats.possession.home} away={stats.possession.away} />
            <StatBar label="Shots on Target" home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} />
            <StatBar label="Corners" home={stats.corners.home} away={stats.corners.away} />
            <StatBar label="Fouls" home={stats.fouls.home} away={stats.fouls.away} />
          </div>
        )}
        {activeTab === 'lineups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-black mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                {game.homeTeam}
              </h3>
              <div className="space-y-1">
                {homeLineup.map((player) => <PlayerBadge key={player.id} {...player} />)}
                {homeLineup.length === 0 && <p className="text-muted-foreground text-sm">No lineup data</p>}
              </div>
            </div>
            <div>
              <h3 className="font-black mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                {game.awayTeam}
              </h3>
              <div className="space-y-1">
                {awayLineup.map((player) => <PlayerBadge key={player.id} {...player} />)}
                {awayLineup.length === 0 && <p className="text-muted-foreground text-sm">No lineup data</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}