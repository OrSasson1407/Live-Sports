import { useEffect, useRef, useState, useMemo } from 'react';
import { useSportsStore } from './store/useSportsStore';
import { useWebSocket } from './hooks/useWebSocket';

function ScoreDisplay({ score, isLive }: { score: number; isLive: boolean }) {
  const [flash, setFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 800);
      prevScore.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <div className={`match-score ${flash ? 'score-flash' : ''} ${isLive ? 'score-live' : ''}`}>
      {score}
    </div>
  );
}

function SportIcon({ sport }: { sport: string }) {
  if (sport === 'basketball') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
        <circle cx="12" cy="12" r="10"/><path d="M4.9 4.9C7 7 8 9.5 8 12s-1 5-3.1 7.1M19.1 4.9C17 7 16 9.5 16 12s1 5 3.1 7.1M2 12h20M12 2v20"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
      <circle cx="12" cy="12" r="10"/><path d="M12 2C6.5 11 6.5 13 12 22M12 2c5.5 9 5.5 11 0 20M2.5 9h19M2.5 15h19"/>
    </svg>
  );
}

function MatchRow({ gameId }: { gameId: string }) {
  const game = useSportsStore((state) => state.games[gameId]);
  if (!game) return null;

  const isFinished = game.status === 'finished';
  const isHalftime = game.status === 'halftime';
  const isLive = !isFinished && !isHalftime && game.status === 'live';
  
  const statusLabel = isFinished ? 'FT' : isHalftime ? 'HT' : game.clock;

  return (
    <div className="match-row">
      <div className="match-time-col">
        <span className={`match-time ${isLive ? 'text-live' : ''}`}>
          {statusLabel}
          {isLive && <span className="live-pulsing-dot" />}
        </span>
      </div>
      
      <div className="match-teams-col">
        <div className="match-team">
          <span className="team-name">{game.homeTeam}</span>
          <ScoreDisplay score={game.homeScore} isLive={isLive} />
        </div>
        <div className="match-team">
          <span className="team-name">{game.awayTeam}</span>
          <ScoreDisplay score={game.awayScore} isLive={isLive} />
        </div>
      </div>
      
      <div className="match-action-col">
        <button className="star-btn" aria-label="Favorite match">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function App() {
  const isConnected = useSportsStore((state) => state.isConnected);
  const games = useSportsStore((state) => state.games);
  const liveGameIds = Object.keys(games);
  
  // Tab state for filtering sports
  const [activeTab, setActiveTab] = useState<'all' | 'soccer' | 'basketball'>('all');
  const [, setTick] = useState(0);

  const globalSub = useMemo(() => ['ALL'], []);
  useWebSocket(globalSub);
  
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Compute stats
  const bballMatches = liveGameIds.filter(id => games[id]?.sport === 'basketball');
  const soccerMatches = liveGameIds.filter(id => games[id]?.sport === 'soccer');
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Grouping logic for the list view
  const groups = [];
  if (activeTab === 'all' || activeTab === 'soccer') {
    if (soccerMatches.length > 0) groups.push({ title: 'Football', id: 'soccer', icon: 'soccer', matches: soccerMatches });
  }
  if (activeTab === 'all' || activeTab === 'basketball') {
    if (bballMatches.length > 0) groups.push({ title: 'Basketball', id: 'basketball', icon: 'basketball', matches: bballMatches });
  }

  return (
    <div className="root">
      {/* Kept original background noise */}
      <div className="bg-noise" />

      {/* Kept original Header */}
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
        {/* Kept original Top Page Stats */}
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
              <span className="counter-num counter-green">{soccerMatches.length}</span>
              <span className="counter-lbl">⚽ Football</span>
            </div>
            <div className="counter-divider" />
            <div className="counter-item">
              <span className="counter-num counter-orange">{bballMatches.length}</span>
              <span className="counter-lbl">🏀 Basketball</span>
            </div>
          </div>
        </div>

        <div className="section-line" />

        {/* New Filter Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Sports
          </button>
          <button 
            className={`tab ${activeTab === 'soccer' ? 'active' : ''}`}
            onClick={() => setActiveTab('soccer')}
          >
            ⚽ Football ({soccerMatches.length})
          </button>
          <button 
            className={`tab ${activeTab === 'basketball' ? 'active' : ''}`}
            onClick={() => setActiveTab('basketball')}
          >
            🏀 Basketball ({bballMatches.length})
          </button>
        </div>

        {/* New List Layout */}
        {liveGameIds.length > 0 ? (
          <div className="matches-container">
            {groups.map(group => (
              <div key={group.id} className="sport-group">
                <div className="group-header">
                  <SportIcon sport={group.icon} />
                  <h3 className="group-title">{group.title}</h3>
                </div>
                <div className="match-list">
                  {group.matches.map(id => (
                    <MatchRow key={id} gameId={id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Kept original Empty State */
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

      {/* Kept original Footer */}
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