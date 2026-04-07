import { useEffect, useRef, useState, useMemo } from 'react';
import { useSportsStore } from './store/useSportsStore';
import { useWebSocket } from './hooks/useWebSocket';

function ScoreDisplay({ score }: { score: number }) {
  const [flash, setFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 600);
      prevScore.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <div className={`score-box${flash ? ' score-flash' : ''}`}>
      {score}
    </div>
  );
}

function SportIcon({ sport }: { sport: string }) {
  if (sport === 'basketball') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
        <circle cx="12" cy="12" r="10"/><path d="M4.9 4.9C7 7 8 9.5 8 12s-1 5-3.1 7.1M19.1 4.9C17 7 16 9.5 16 12s1 5 3.1 7.1M2 12h20M12 2v20"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
      <circle cx="12" cy="12" r="10"/><path d="M12 2C6.5 11 6.5 13 12 22M12 2c5.5 9 5.5 11 0 20M2.5 9h19M2.5 15h19"/>
    </svg>
  );
}

function GameCard({ gameId }: { gameId: string }) {
  const game = useSportsStore((state) => state.games[gameId]);
  if (!game) return null;

  const isBball = game.sport === 'basketball';
  const isFinished = game.status === 'finished';
  const isHalftime = game.status === 'halftime';
  const statusLabel = isFinished ? 'Full Time' : isHalftime ? 'Half Time' : game.clock;

  return (
    <div className={`game-card ${isBball ? 'card-orange' : 'card-green'}`}>
      <div className={`card-accent-bar ${isBball ? 'bar-orange' : 'bar-green'}`} />
      
      <div className="card-header">
        <div className={`sport-badge ${isBball ? 'sbadge-orange' : 'sbadge-green'}`}>
          <SportIcon sport={game.sport} />
          <span>{isBball ? 'Basketball' : 'Football'}</span>
        </div>
        <div className={`status-chip ${isFinished ? 'chip-done' : isHalftime ? 'chip-ht' : 'chip-live'}`}>
          {!isFinished && !isHalftime && <span className="live-dot" />}
          {statusLabel}
        </div>
      </div>

      <div className="matchup">
        <div className="team">
          <ScoreDisplay score={game.homeScore} />
          <span className="team-name">{game.homeTeam}</span>
          <span className="team-side">HOME</span>
        </div>
        <div className="vs-col">
          <span className="vs-label">VS</span>
        </div>
        <div className="team">
          <ScoreDisplay score={game.awayScore} />
          <span className="team-name">{game.awayTeam}</span>
          <span className="team-side">AWAY</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const isConnected = useSportsStore((state) => state.isConnected);
  const games = useSportsStore((state) => state.games);
  const liveGameIds = Object.keys(games);
  const [, setTick] = useState(0);

  const globalSub = useMemo(() => ['ALL'], []);
  useWebSocket(globalSub);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const bball = liveGameIds.filter(id => games[id]?.sport === 'basketball').length;
  const soccer = liveGameIds.filter(id => games[id]?.sport === 'soccer').length;
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="root">
      <div className="bg-noise" />

      <header className="topnav">
        <div className="topnav-inner">
          <div className="brand">
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">LiveScore<span className="brand-pro"> PRO</span></div>
              <div className="brand-sub">Real-Time Data Feed</div>
            </div>
          </div>

          <div className="nav-clock">{now}</div>

          <div className={`conn-badge ${isConnected ? 'conn-live' : 'conn-off'}`}>
            <span className={`conn-dot ${isConnected ? 'cdot-live' : 'cdot-off'}`} />
            {isConnected ? 'LIVE FEED' : 'RECONNECTING'}
          </div>
        </div>
      </header>

      <main className="content">
        <div className="page-head">
          <div>
            <h2 className="page-title">Active Matches</h2>
            <p className="page-sub">Live scores updating in real-time</p>
          </div>
          <div className="counters">
            <div className="counter-item">
              <span className="counter-num">{liveGameIds.length}</span>
              <span className="counter-lbl">Total</span>
            </div>
            <div className="counter-divider" />
            <div className="counter-item">
              <span className="counter-num counter-green">{soccer}</span>
              <span className="counter-lbl">⚽ Football</span>
            </div>
            <div className="counter-divider" />
            <div className="counter-item">
              <span className="counter-num counter-orange">{bball}</span>
              <span className="counter-lbl">🏀 Basketball</span>
            </div>
          </div>
        </div>

        <div className="section-line" />

        {liveGameIds.length > 0 ? (
          <div className="grid">
            {liveGameIds.map(id => <GameCard key={id} gameId={id} />)}
          </div>
        ) : (
          <div className="empty">
            <div className="empty-ring">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="40" height="40">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <h3 className="empty-h">Awaiting Live Matches</h3>
            <p className="empty-p">Our servers are polling Sofascore. Active matches will appear here shortly.</p>
            <div className="empty-progress"><div className="progress-fill" /></div>
          </div>
        )}
      </main>

      <footer className="foot">
        <span>LiveScore Pro</span>
        <span className="foot-sep">·</span>
        <span>Powered by Sofascore API</span>
        <span className="foot-sep">·</span>
        <span>Refreshes every 60s</span>
      </footer>
    </div>
  );
}

export default App;
