import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trophy, Activity } from 'lucide-react';

export default function PlayerView() {
  const { playerId } = useParams();
  const navigate = useNavigate();

  // MOCK DATA: Replace with an API call to your backend (e.g., /api/players/:id)
  const player = {
    id: playerId,
    name: "Lionel Messi",
    team: "Inter Miami CF",
    position: "Forward",
    jerseyNumber: 10,
    nationality: "Argentina",
    stats: {
      goals: 12,
      assists: 8,
      matchesPlayed: 15,
      rating: 8.9
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Player Header Card */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        
        {/* Profile Picture Placeholder */}
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={64} color="#555" />
        </div>

        {/* Player Details */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#fff' }}>{player.name}</h1>
            <span style={{ background: '#3b82f6', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 'bold' }}>
              #{player.jerseyNumber}
            </span>
          </div>
          <p style={{ color: '#aaa', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
            {player.position} • {player.team}
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#888' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Trophy size={14} /> {player.nationality}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Activity size={14} /> Active</span>
          </div>
        </div>
      </div>

      {/* Season Stats Grid */}
      <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Season Statistics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        
        <StatCard title="Matches Played" value={player.stats.matchesPlayed} />
        <StatCard title="Goals" value={player.stats.goals} color="#10b981" />
        <StatCard title="Assists" value={player.stats.assists} color="#3b82f6" />
        <StatCard title="Avg Rating" value={player.stats.rating} color="#f59e0b" />

      </div>
    </div>
  );
}

// Small helper for the statistics boxes
function StatCard({ title, value, color = '#fff' }: { title: string, value: string | number, color?: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ color: color, fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}