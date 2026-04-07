import { useEffect, useRef, useState } from 'react';
import { useSportsStore } from './store/useSportsStore';
import { useWebSocket } from './hooks/useWebSocket';
import { Radio, Trophy, Clock, Activity } from 'lucide-react';

// --- Sub-Component 1: The Flashing Score Digit ---
function ScoreDisplay({ score, isHome }: { score: number; isHome: boolean }) {
  const [flash, setFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 500); 
      prevScore.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);

  // Flash styling for that "live betting" feel
  const flashStyle = flash 
    ? "bg-emerald-500 text-white scale-110 shadow-[0_0_20px_rgba(16,185,129,0.6)]" 
    : "bg-slate-800/80 text-white scale-100";

  return (
    <div className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl transition-all duration-300 font-mono text-3xl md:text-4xl font-black ${flashStyle}`}>
      {score}
    </div>
  );
}

// --- Sub-Component 2: The Premium Game Card ---
function GameCard({ gameId }: { gameId: string }) {
  const game = useSportsStore((state) => state.games[gameId]);

  if (!game) return null;

  const isBasketball = game.sport === 'basketball';
  const theme = isBasketball 
    ? { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
    : { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };

  return (
    <div className="group relative bg-[#0f172a] border border-slate-800 hover:border-slate-600 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10 overflow-hidden">
      
      {/* Background glow effect on hover */}
      <div className={`absolute top-0 left-0 w-full h-1 ${isBasketball ? 'bg-orange-500' : 'bg-emerald-500'} opacity-50`} />

      {/* Header: Sport & Clock */}
      <div className="flex justify-between items-center mb-6">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${theme.border} ${theme.bg}`}>
          <Trophy className={`w-4 h-4 ${theme.color}`} />
          <span className={`text-xs font-bold uppercase tracking-widest ${theme.color}`}>
            {game.sport}
          </span>
        </div>
        
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-bold text-rose-400 tracking-wider">
            {game.clock}
          </span>
        </div>
      </div>

      {/* Main Score Area */}
      <div className="flex items-center justify-between mb-2">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 gap-3">
          <ScoreDisplay score={game.homeScore} isHome={true} />
          <span className="text-lg font-black tracking-tight text-center leading-tight max-w-[120px] truncate">
            {game.homeTeam}
          </span>
          <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Home</span>
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center justify-center px-4">
          <div className="w-px h-8 bg-slate-800 mb-2" />
          <span className="text-sm font-black text-slate-600 italic">VS</span>
          <div className="w-px h-8 bg-slate-800 mt-2" />
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 gap-3">
          <ScoreDisplay score={game.awayScore} isHome={false} />
          <span className="text-lg font-black tracking-tight text-center leading-tight max-w-[120px] truncate">
            {game.awayTeam}
          </span>
          <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Away</span>
        </div>
      </div>
    </div>
  );
}

// --- Main Application UI ---
function App() {
  const isConnected = useSportsStore((state) => state.isConnected);
  const games = useSportsStore((state) => state.games);
  const liveGameIds = Object.keys(games);

  // Global subscription to catch all live games from the server
  useWebSocket(['ALL']); 

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30 font-sans pb-20">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800 mb-8">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                LiveScore Pro
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
                Real-Time Data Feed
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isConnected ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
            <Radio className={`w-4 h-4 ${isConnected ? 'text-emerald-500 animate-pulse' : 'text-rose-500'}`} />
            <span className={`text-xs font-bold tracking-widest ${isConnected ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isConnected ? 'LIVE FEED ACTIVE' : 'RECONNECTING...'}
            </span>
          </div>

        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6">
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-xl font-bold tracking-tight">Active Matches</h2>
          <span className="ml-2 text-sm font-semibold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            {liveGameIds.length}
          </span>
        </div>

        {/* Dynamic Grid */}
        {liveGameIds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveGameIds.map((id) => (
              <GameCard key={id} gameId={id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <Clock className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-slate-400 mb-2">Awaiting Live Matches</h3>
            <p className="text-slate-600 text-center max-w-md">
              Our servers are currently polling the Sofascore API. If games are active right now, they will appear here shortly.
            </p>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;