import { useState } from 'react';
import MatchCard from '../components/MatchCard';
import { useSportsStore } from '../store/useSportsStore';

// Helper for SVG icons
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

export default function Home() {
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
                  <MatchCard key={id} gameId={id} />
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