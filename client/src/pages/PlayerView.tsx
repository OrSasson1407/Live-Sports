import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trophy, Activity, MapPin } from 'lucide-react';

export default function PlayerView() {
  const { playerId } = useParams();
  const navigate = useNavigate();

  // MOCK DATA
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
    },
    // Mock recent form (W/D/L)
    recentForm: ['W', 'W', 'D', 'L', 'W']
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm font-semibold group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Lineup
      </button>

      {/* Premium Player Header Card */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 overflow-hidden shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start group">
        
        {/* Background Mesh Gradient & Watermark */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/20 transition-colors duration-700" />
        <div className="absolute -bottom-10 -right-4 text-[250px] font-black text-gray-800/30 leading-none select-none pointer-events-none font-mono">
          {player.jerseyNumber}
        </div>

        {/* Profile Picture Placeholder */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border-4 border-gray-950 flex items-center justify-center shrink-0 shadow-xl z-10 overflow-hidden">
          <User size={64} className="text-gray-500" />
          <div className="absolute inset-0 shadow-inner rounded-full" />
        </div>

        {/* Player Details */}
        <div className="flex-1 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-2">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{player.name}</h1>
            <span className="inline-flex items-center justify-center bg-blue-600 text-white px-3 py-1 md:py-1.5 rounded-lg font-black text-sm md:text-base shadow-[0_4px_15px_-3px_rgba(37,99,235,0.5)]">
              #{player.jerseyNumber}
            </span>
          </div>
          
          <p className="text-xl text-gray-300 font-medium mb-6">
            {player.position} <span className="text-gray-600 mx-2">|</span> {player.team}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-sm font-semibold text-gray-400">
            <span className="flex items-center gap-2 bg-gray-950/50 px-3 py-1.5 rounded-lg border border-gray-800"><Trophy size={16} className="text-yellow-500" /> {player.nationality}</span>
            <span className="flex items-center gap-2 bg-gray-950/50 px-3 py-1.5 rounded-lg border border-gray-800"><Activity size={16} className="text-emerald-500" /> Active Roster</span>
            <span className="flex items-center gap-2 bg-gray-950/50 px-3 py-1.5 rounded-lg border border-gray-800"><MapPin size={16} className="text-blue-500" /> First Team</span>
          </div>
        </div>
      </div>

      {/* Recent Form & Season Stats Grid */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Recent Form Column */}
        <div className="lg:col-span-1 bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Form (Last 5)</h3>
          <div className="flex items-center gap-2">
            {player.recentForm.map((result, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm
                  ${result === 'W' ? 'bg-emerald-500' : result === 'D' ? 'bg-gray-500' : 'bg-red-500'}
                `}
              >
                {result}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Player has been in excellent form, winning 3 of the last 5 starts.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard title="Matches" value={player.stats.matchesPlayed} />
          <StatCard title="Goals" value={player.stats.goals} color="text-emerald-400" glow="group-hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]" />
          <StatCard title="Assists" value={player.stats.assists} color="text-blue-400" glow="group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]" />
          <StatCard title="Avg Rating" value={player.stats.rating} color="text-amber-400" glow="group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]" />
        </div>

      </div>
    </div>
  );
}

// Upgraded helper for the statistics boxes
function StatCard({ title, value, color = 'text-white', glow = 'group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]' }: { title: string, value: string | number, color?: string, glow?: string }) {
  return (
    <div className={`group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 ${glow}`}>
      <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-gray-400 transition-colors">{title}</div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}