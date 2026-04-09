import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';
import { Clock, ArrowLeft, Shield } from 'lucide-react';

// Reusing ScoreDisplay for the big scoreboard
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
    <div style={{ 
      color: flash ? '#ef4444' : '#fff', 
      transition: 'color 0.3s ease',
      textShadow: isLive ? '0 0 10px rgba(239,68,68,0.3)' : 'none'
    }}>
      {score}
    </div>
  );
}

export default function MatchView() {
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

  // Mock events - eventually pull this from your WebSocket/Prisma backend
  const mockEvents = [
    { id: 1, minute: "75'", type: "GOAL", player: "Lionel Messi", team: game.homeTeam, playerId: "123" },
    { id: 2, minute: "42'", type: "YELLOW_CARD", player: "Sergio Ramos", team: game.awayTeam, playerId: "456" },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back to Matches
      </button>

      {/* Main Scoreboard Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: game.status === 'live' ? '#ef4444' : '#888', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          {game.status === 'live' ? <><Clock size={14} /> LIVE • {game.clock}</> : game.status.toUpperCase()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <Shield size={48} color="#555" />
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>{game.homeTeam}</h2>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '3.5rem', fontWeight: '800', lineHeight: 1 }}>
            <ScoreDisplay score={game.homeScore} isLive={game.status === 'live'} />
            <span style={{ color: '#555', fontSize: '2rem' }}>-</span>
            <ScoreDisplay score={game.awayScore} isLive={game.status === 'live'} />
          </div>

          <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
             <Shield size={48} color="#555" />
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
      <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', minHeight: '300px' }}>
        
        {activeTab === 'live' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {mockEvents.map(event => (
               <div key={event.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderLeft: '3px solid #3b82f6', background: 'rgba(255,255,255,0.02)' }}>
                 <div style={{ fontWeight: 'bold', color: '#3b82f6', minWidth: '40px' }}>{event.minute}</div>
                 <div>
                   <div style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     {event.type === 'GOAL' ? '⚽' : '🟨'} {event.type}
                   </div>
                   <div style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                     <Link to={`/player/${event.playerId}`} style={{ color: '#fff', textDecoration: 'underline' }}>{event.player}</Link> ({event.team})
                   </div>
                 </div>
               </div>
             ))}
           </div>
        )}
        
        {activeTab === 'lineups' && (
           <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
             {/* Home Team Lineup */}
             <div style={{ flex: 1 }}>
               <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{game.homeTeam}</h3>
               {/* Mock player row */}
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#ccc' }}>
                 <Link to="/player/123" style={{ color: 'inherit', textDecoration: 'none' }}>10. Lionel Messi (C)</Link>
                 <span style={{ fontSize: '0.8rem', color: '#666' }}>Forward</span>
               </div>
             </div>
             
             {/* Away Team Lineup */}
             <div style={{ flex: 1 }}>
               <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{game.awayTeam}</h3>
               {/* Mock player row */}
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#ccc' }}>
                 <Link to="/player/456" style={{ color: 'inherit', textDecoration: 'none' }}>4. Sergio Ramos</Link>
                 <span style={{ fontSize: '0.8rem', color: '#666' }}>Defender</span>
               </div>
             </div>
           </div>
        )}

        {activeTab === 'stats' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>
              <StatBar label="Possession %" home={60} away={40} />
              <StatBar label="Shots on Target" home={5} away={2} />
              <StatBar label="Corner Kicks" home={8} away={4} />
           </div>
        )}
      </div>
    </div>
  );
}

// Visual Helper for the Stats tab
function StatBar({ label, home, away }: { label: string, home: number, away: number }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 'bold' }}>{home}</span>
        <span style={{ color: '#888' }}>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{away}</span>
      </div>
      <div style={{ display: 'flex', height: '8px', width: '100%', gap: '4px' }}>
        <div style={{ background: '#3b82f6', borderRadius: '4px 0 0 4px', width: `${homePct}%` }} />
        <div style={{ background: '#ef4444', borderRadius: '0 4px 4px 0', width: `${100 - homePct}%` }} />
      </div>
    </div>
  );
}