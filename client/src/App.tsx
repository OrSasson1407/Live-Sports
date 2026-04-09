import React, { useEffect, useRef, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { useSportsStore } from './store/useSportsStore';
import { useWebSocket } from './hooks/useWebSocket';

// ------------------------------------------------------------------
// 1. SHARED COMPONENTS
// ------------------------------------------------------------------

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

// Updated: Made the row clickable to navigate to the detailed MatchView
function MatchRow({ gameId }: { gameId: string }) {
  const navigate = useNavigate();
  const game = useSportsStore((state) => state.games[gameId]);
  if (!game) return null;

  const isFinished = game.status === 'finished';
  const isHalftime = game.status === 'halftime';
  const isLive = !isFinished && !isHalftime && game.status === 'live';
  
  const statusLabel = isFinished ? 'FT' : isHalftime ? 'HT' : game.clock;

  return (
    <div 
      className="match-row" 
      onClick={() => navigate(`/match/${gameId}`)}
      style={{ cursor: 'pointer' }}
    >
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
        <button 
          className="star-btn" 
          aria-label="Favorite match"
          onClick={(e) => {
            e.stopPropagation(); // Prevents navigating when clicking the star
            // Handle favorite logic here
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 2. LAYOUT WRAPPER (Header & Footer)
// ------------------------------------------------------------------

function Layout({ children }: { children: React.ReactNode }) {
  const isConnected = useSportsStore((state) => state.isConnected);
  const [, setTick] = useState(0);

  // Maintain the global websocket connection at the top level
  const globalSub = useMemo(() => ['ALL'], []);
  useWebSocket(globalSub);
  
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="root">
      <div className="bg-noise" />
      
      <header className="topnav">
        <div className="topnav-inner">
          <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">LiveScore<span className="brand-pro"> PRO</span></div>
              <div className="brand-sub">Real-Time Data Feed</div>
            </div>
          </Link>

          <div className="nav-clock">{now}</div>

          <div className={`conn-badge ${isConnected ? 'conn-live' : 'conn-off'}`}>
            <span className={`conn-dot ${isConnected ? 'cdot-live' : 'cdot-off'}`} />
            {isConnected ? 'LIVE FEED' : 'RECONNECTING'}
          </div>
        </div>
      </header>

      <main className="content">
        {children}
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

// ------------------------------------------------------------------
// 3. PAGES
// ------------------------------------------------------------------

function Home() {
  const games = useSportsStore((state) => state.games);
  const liveGameIds = Object.keys(games);
  
  const [activeTab, setActiveTab] = useState<'all' | 'soccer' | 'basketball'>('all');

  const bballMatches = liveGameIds.filter(id => games[id]?.sport === 'basketball');
  const soccerMatches = liveGameIds.filter(id => games[id]?.sport === 'soccer');

  const groups = [];
  if (activeTab === 'all' || activeTab === 'soccer') {
    if (soccerMatches.length > 0) groups.push({ title: 'Football', id: 'soccer', icon: 'soccer', matches: soccerMatches });
  }
  if (activeTab === 'all' || activeTab === 'basketball') {
    if (bballMatches.length > 0) groups.push({ title: 'Basketball', id: 'basketball', icon: 'basketball', matches: bballMatches });
  }

  return (
    <>
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
        <div className="empty">
          <div className="empty-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="40" height="40">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <h3 className="empty-h">Awaiting Live Matches</h3>
          <p className="empty-p">Our servers are polling the database. Active matches will appear here shortly.</p>
          <div className="empty-progress"><div className="progress-fill" /></div>
        </div>
      )}
    </>
  );
}

function MatchView() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const game = useSportsStore((state) => matchId ? state.games[matchId] : null);
  const [activeTab, setActiveTab] = useState<'live' | 'lineups' | 'stats'>('live');

  if (!game) {
    return (
      <div className="empty" style={{ marginTop: '4rem' }}>
        <h3 className="empty-h">Match not found</h3>
        <button onClick={() => navigate('/')} className="tab active" style={{ marginTop: '1rem' }}>Return Home</button>
      </div>
    );
  }

  // Basic inline styles used here to seamlessly integrate into your current raw CSS theme
  // without relying on Tailwind classes you might not have installed yet.
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
           <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Matches
      </button>

      {/* Main Scoreboard Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', textAlign: 'center', position: 'relative' }}>
        
        <div style={{ color: game.status === 'live' ? '#ef4444' : '#888', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '2rem' }}>
          {game.status === 'live' ? `LIVE • ${game.clock}` : game.status.toUpperCase()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>{game.homeTeam}</h2>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '3.5rem', fontWeight: '800', lineHeight: 1 }}>
            <ScoreDisplay score={game.homeScore} isLive={game.status === 'live'} />
            <span style={{ color: '#555', fontSize: '2rem' }}>-</span>
            <ScoreDisplay score={game.awayScore} isLive={game.status === 'live'} />
          </div>

          <div style={{ flex: 1, textAlign: 'left' }}>
             <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>{game.awayTeam}</h2>
          </div>
        </div>
      </div>

      {/* Deep Dive Tabs */}
      <div className="tabs" style={{ marginTop: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
        <button className={`tab ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>Live Feed</button>
        <button className={`tab ${activeTab === 'lineups' ? 'active' : ''}`} onClick={() => setActiveTab('lineups')}>Lineups</button>
        <button className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
      </div>

      {/* Tab Content Areas */}
      <div style={{ marginTop: '1.5rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', minHeight: '300px' }}>
        {activeTab === 'live' && (
           <div>
             <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.1rem' }}>Match Events</h3>
             <p style={{ color: '#888', fontSize: '0.9rem' }}>Event stream (goals, cards, substitutions) will appear here...</p>
           </div>
        )}
        
        {activeTab === 'lineups' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
             <SportIcon sport="soccer" />
             <p style={{ color: '#888', fontSize: '0.9rem' }}>Pitch & Squad graphics are currently being drawn...</p>
           </div>
        )}

        {activeTab === 'stats' && (
           <div>
             <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center' }}>Advanced player and team statistics are loading...</p>
           </div>
        )}
      </div>

    </div>
  );
}

// ------------------------------------------------------------------
// 4. MAIN APP ROUTER
// ------------------------------------------------------------------

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/:matchId" element={<MatchView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}