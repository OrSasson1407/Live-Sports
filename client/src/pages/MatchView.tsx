import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';
import { Clock, ArrowLeft, Shield, Activity, Users, BarChart3, AlertCircle } from 'lucide-react';

// --- VISUAL HELPERS ---

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
    <div className={`transition-all duration-300 tabular-nums ${flash ? 'text-red-500 scale-110 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'text-white'}`}>
      {score}
    </div>
  );
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'GOAL': return '⚽';
    case 'YELLOW_CARD': return '🟨';
    case 'RED_CARD': return '🟥';
    case 'SUBSTITUTION': return '🔄';
    default: return '哨';
  }
};

export default function MatchView() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
  const game = useSportsStore((state) => matchId ? state.games[matchId] : null);
  const isConnected = useSportsStore((state) => state.isConnected);
  
  const [activeTab, setActiveTab] = useState<'live' | 'lineups' | 'stats'>('live');

  // Loading & Error States
  if (!game) {
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center justify-center h-64 mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400 font-bold tracking-wide">Connecting to live feed...</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-10 bg-gray-900/50 border border-gray-800 rounded-3xl animate-in fade-in">
        <AlertCircle size={48} className="text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-6">Match session expired or not found</h3>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-colors shadow-lg">
          Return Home
        </button>
      </div>
    );
  }

  // ==========================================
  // SMART FALLBACK DATA (Used if backend data is missing)
  // ==========================================
  const displayEvents = game.events?.length ? game.events : [
    { id: 1, minute: "89'", type: "GOAL", player: "Lionel Messi", team: game.homeTeam, playerId: "123" },
    { id: 2, minute: "75'", type: "SUBSTITUTION", player: "Jordi Alba", team: game.homeTeam, playerId: "999" },
    { id: 3, minute: "42'", type: "YELLOW_CARD", player: "Sergio Ramos", team: game.awayTeam, playerId: "456" },
    { id: 4, minute: "12'", type: "FOUL", player: "Kevin De Bruyne", team: game.homeTeam, playerId: "789" },
  ];

  const displayHomeLineup = game.homeLineup?.length ? game.homeLineup : [
    { id: '1', number: 1, name: 'Alisson Becker', position: 'GK' },
    { id: '2', number: 4, name: 'Virgil van Dijk', position: 'DEF', isCaptain: true },
    { id: '3', number: 66, name: 'Trent A-Arnold', position: 'DEF' },
    { id: '4', number: 10, name: 'Lionel Messi', position: 'FWD' },
  ];

  const displayAwayLineup = game.awayLineup?.length ? game.awayLineup : [
    { id: '5', number: 1, name: 'Thibaut Courtois', position: 'GK' },
    { id: '6', number: 4, name: 'Sergio Ramos', position: 'DEF', isCaptain: true },
    { id: '7', number: 8, name: 'Toni Kroos', position: 'MID' },
    { id: '8', number: 9, name: 'Karim Benzema', position: 'FWD' },
  ];

  const displayStats = game.stats ? game.stats : {
    possession: { home: 62, away: 38 },
    shotsOnTarget: { home: 7, away: 3 },
    corners: { home: 8, away: 4 },
    fouls: { home: 10, away: 14 }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-12 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm font-semibold group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      {/* Hero Scoreboard */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-12 text-center overflow-hidden shadow-2xl">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg rounded-full blur-[100px] opacity-20 pointer-events-none ${game.status === 'live' ? 'bg-red-500' : 'bg-blue-500'}`} />

        <div className="relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest mb-8 ${game.status === 'live' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gray-800 text-gray-400'}`}>
            {game.status === 'live' ? <><Clock size={14} className="animate-pulse" /> LIVE MATCH • {game.clock}</> : game.status.toUpperCase()}
          </div>

          <div className="flex items-center justify-between gap-4 md:gap-12">
            <div className="flex-1 flex flex-col items-center md:items-end gap-3 md:gap-4">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-950 border-4 border-gray-800 flex items-center justify-center shadow-inner text-2xl font-black text-gray-600">
                {game.homeTeam.charAt(0)}
              </div>
              <h2 className="text-xl md:text-3xl font-black text-white text-center md:text-right leading-tight">{game.homeTeam}</h2>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6 text-5xl md:text-7xl font-black tracking-tighter">
              <ScoreDisplay score={game.homeScore} isLive={game.status === 'live'} />
              <span className="text-gray-700 pb-2">-</span>
              <ScoreDisplay score={game.awayScore} isLive={game.status === 'live'} />
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start gap-3 md:gap-4">
               <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-950 border-4 border-gray-800 flex items-center justify-center shadow-inner text-2xl font-black text-gray-600">
                 {game.awayTeam.charAt(0)}
               </div>
               <h2 className="text-xl md:text-3xl font-black text-white text-center md:text-left leading-tight">{game.awayTeam}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mt-8 border-b border-gray-800/60 pb-4">
        {[
          { id: 'live', label: 'Live Feed', icon: Activity },
          { id: 'lineups', label: 'Lineups', icon: Users },
          { id: 'stats', label: 'Match Stats', icon: BarChart3 }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? 'text-blue-500' : ''} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Areas */}
      <div className="mt-6 p-6 md:p-8 bg-gray-900/30 border border-gray-800/50 rounded-3xl min-h-[400px]">
        
        {/* LIVE FEED */}
        {activeTab === 'live' && (
           <div className="relative flex flex-col gap-6 pl-4 md:pl-8 before:absolute before:inset-y-0 before:left-[19px] md:before:left-[35px] before:w-[2px] before:bg-gray-800">
             {displayEvents.map((event) => (
               <div key={event.id} className="relative flex items-start gap-6 group">
                 <div className="absolute -left-[26px] md:-left-[26px] top-1 w-3 h-3 rounded-full bg-gray-700 border-2 border-gray-950 group-hover:bg-blue-500 group-hover:scale-125 transition-all z-10" />
                 
                 <div className="text-sm font-black text-blue-500 w-8 pt-0.5">{event.minute}</div>
                 <div className="flex-1 bg-gray-900/80 border border-gray-800 rounded-2xl p-4 group-hover:border-blue-500/30 transition-colors">
                   <div className="flex items-center gap-2 font-bold text-white mb-1">
                     <span className="text-lg">{getEventIcon(event.type)}</span> {event.type.replace('_', ' ')}
                   </div>
                   <div className="text-sm text-gray-400">
                     {event.playerId ? (
                       <Link to={`/player/${event.playerId}`} className="text-white hover:text-blue-400 hover:underline font-medium transition-colors">{event.player}</Link>
                     ) : (
                       <span className="text-white font-medium">{event.player}</span>
                     )}
                     <span className="mx-2">•</span>
                     {event.team}
                   </div>
                 </div>
               </div>
             ))}
           </div>
        )}
        
        {/* LINEUPS */}
        {activeTab === 'lineups' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
             <div>
               <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 pb-4 border-b border-gray-800 flex items-center justify-between">
                 {game.homeTeam} <Shield size={20} className="text-gray-600" />
               </h3>
               <div className="space-y-1">
                 {displayHomeLineup.map(player => (
                   <LineupRow key={player.id} player={player} />
                 ))}
               </div>
             </div>
             
             <div>
               <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 pb-4 border-b border-gray-800 flex items-center justify-between">
                 {game.awayTeam} <Shield size={20} className="text-gray-600" />
               </h3>
               <div className="space-y-1">
                 {displayAwayLineup.map(player => (
                   <LineupRow key={player.id} player={player} />
                 ))}
               </div>
             </div>
           </div>
        )}

        {/* STATS */}
        {activeTab === 'stats' && (
           <div className="flex flex-col gap-8 max-w-2xl mx-auto py-4">
              <StatBar label="Possession %" home={displayStats.possession.home} away={displayStats.possession.away} />
              <StatBar label="Shots on Target" home={displayStats.shotsOnTarget.home} away={displayStats.shotsOnTarget.away} />
              <StatBar label="Corner Kicks" home={displayStats.corners.home} away={displayStats.corners.away} />
              <StatBar label="Fouls" home={displayStats.fouls.home} away={displayStats.fouls.away} isNegative />
           </div>
        )}
      </div>
    </div>
  );
}

// --- REUSABLE SUB-COMPONENTS ---

function LineupRow({ player }: { player: any }) {
  return (
    <Link to={`/player/${player.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/80 transition-colors group cursor-pointer">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center text-xs font-bold font-mono group-hover:bg-blue-500 group-hover:text-white transition-colors">
          {player.number}
        </span>
        <span className="text-gray-200 font-medium group-hover:text-white transition-colors">
          {player.name} {player.isCaptain && '(C)'}
        </span>
      </div>
      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{player.position}</span>
    </Link>
  );
}

function StatBar({ label, home, away, isNegative = false }: { label: string, home: number, away: number, isNegative?: boolean }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  
  const homeColor = isNegative ? (home > away ? 'bg-red-500' : 'bg-blue-500') : (home > away ? 'bg-blue-500' : 'bg-gray-600');
  const awayColor = isNegative ? (away > home ? 'bg-red-500' : 'bg-blue-500') : (away > home ? 'bg-blue-500' : 'bg-gray-600');

  return (
    <div className="group">
      <div className="flex justify-between items-end mb-2 px-1">
        <span className="text-lg font-black text-white">{home}</span>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
        <span className="text-lg font-black text-white">{away}</span>
      </div>
      <div className="flex h-3 w-full gap-1 bg-gray-900 rounded-full p-0.5 border border-gray-800">
        <div className={`h-full rounded-l-full ${homeColor} transition-all duration-1000 ease-out relative overflow-hidden`} style={{ width: `${homePct}%` }}>
          <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
        </div>
        <div className={`h-full rounded-r-full ${awayColor} transition-all duration-1000 ease-out relative overflow-hidden`} style={{ width: `${100 - homePct}%` }}>
          <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
}