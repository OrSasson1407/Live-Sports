import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';
import { ArrowLeft, Clock, Users, BarChart3, AlertCircle } from 'lucide-react';
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
    <span className={`text-4xl md:text-5xl font-black tabular-nums transition-all ${flash ? 'text-primary scale-110 animate-score-flash' : 'text-foreground'}`}>
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
      <div className="flex flex-col items-center justify-center h-64">
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

  const events = game.events?.length ? game.events : [
    { id: 1, minute: "12'", type: 'GOAL', player: 'Lionel Messi', playerId: '123', team: game.homeTeam },
    { id: 2, minute: "34'", type: 'YELLOW_CARD', player: 'Sergio Ramos', playerId: '456', team: game.awayTeam },
  ];

  const homeLineup = game.homeLineup?.length ? game.homeLineup : [
    { id: '1', number: 1, name: 'Alisson Becker', position: 'GK' },
    { id: '2', number: 4, name: 'Virgil van Dijk', position: 'DEF', isCaptain: true },
    { id: '3', number: 10, name: 'Lionel Messi', position: 'FWD' },
  ];

  const awayLineup = game.awayLineup?.length ? game.awayLineup : [
    { id: '4', number: 1, name: 'Thibaut Courtois', position: 'GK' },
    { id: '5', number: 4, name: 'Sergio Ramos', position: 'DEF', isCaptain: true },
    { id: '6', number: 9, name: 'Karim Benzema', position: 'FWD' },
  ];

  const stats = game.stats || {
    possession: { home: 55, away: 45 },
    shotsOnTarget: { home: 6, away: 3 },
    corners: { home: 5, away: 2 },
    fouls: { home: 8, away: 12 },
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Scoreboard */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 text-center">
            <div className="text-xl font-bold truncate">{game.homeTeam}</div>
            <div className="mt-2">
              <ScoreDisplay score={game.homeScore} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              {isLive ? (
                <span className="text-destructive flex items-center gap-1 justify-center">
                  <span className="live-pulse" /> {game.clock}
                </span>
              ) : isFinished ? 'FT' : ''}
            </div>
            <div className="text-2xl text-muted-foreground font-bold">-</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-xl font-bold truncate">{game.awayTeam}</div>
            <div className="mt-2">
              <ScoreDisplay score={game.awayScore} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-5">
        {(['summary', 'stats', 'lineups'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        {activeTab === 'summary' && <EventTimeline events={events} />}
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
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {game.homeTeam}
              </h3>
              <div className="space-y-1">
                {homeLineup.map((player) => (
                  <PlayerBadge key={player.id} {...player} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {game.awayTeam}
              </h3>
              <div className="space-y-1">
                {awayLineup.map((player) => (
                  <PlayerBadge key={player.id} {...player} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}