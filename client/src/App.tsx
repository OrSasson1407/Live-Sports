import { useMemo, useEffect, useRef, useState } from 'react';
import { useSportsStore } from './store/useSportsStore';
import { useWebSocket } from './hooks/useWebSocket';

// --- Sub-Component 1: The Flashing Score Digit ---
function ScoreDisplay({ score, isHome }: { score: number, isHome: boolean }) {
  const [flash, setFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    // If the score changed, trigger the flash effect
    if (score !== prevScore.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 300); // 300ms flash
      prevScore.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);

  // Styling transitions for the visual flash
  const baseStyle = "text-4xl font-mono font-bold px-4 py-2 rounded-lg transition-colors duration-300";
  
  // Home team flashes solid emerald, Away team flashes solid white
  const homeStyle = flash 
    ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
    : "text-emerald-400 bg-emerald-400/10";
    
  const awayStyle = flash 
    ? "bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
    : "text-white bg-slate-800";

  return (
    <span className={`${baseStyle} ${isHome ? homeStyle : awayStyle}`}>
      {score}
    </span>
  );
}

// --- Sub-Component 2: The Isolated Game Card ---
// By passing the ID and pulling from the store HERE, we prevent the whole grid from re-rendering
function GameCard({ gameId }: { gameId: string }) {
  const game = useSportsStore((state) => state.games[gameId]);

  if (!game) return <div className="animate-pulse bg-slate-900 h-48 rounded-2xl" />;

  // Dynamic Theme based on Sport
  const theme = game.sport === 'basketball' 
    ? { border: 'border-orange-500/30', text: 'text-orange-500', bg: 'bg-orange-500/10' }
    : { border: 'border-emerald-500/30', text: 'text-emerald-500', bg: 'bg-emerald-500/10' };

  return (
    <div className={`bg-slate-900 border ${theme.border} rounded-2xl p-6 shadow-xl`}>
      <div className="flex justify-between items-center mb-4">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${theme.bg} ${theme.text}`}>
          {game.sport}
        </span>
        <span className="text-sm font-mono text-red-400 animate-pulse">{game.clock}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-lg font-bold">{game.homeTeam}</p>
          <ScoreDisplay score={game.homeScore} isHome={true} />
        </div>
        <div className="text-slate-700 font-black">VS</div>
        <div className="text-center">
          <p className="text-lg font-bold">{game.awayTeam}</p>
          <ScoreDisplay score={game.awayScore} isHome={false} />
        </div>
      </div>
    </div>
  );
}

// --- Main Application UI ---
function App() {
  const targetGames = useMemo(() => ['NBA-LAL-BOS', 'NBA-MIA-CHI', 'NBA-GSW-PHX'], []);
  
  useWebSocket(targetGames);

  const isConnected = useSportsStore((state) => state.isConnected);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <header className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Live Sports Odds</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time simulation engine</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Live Feed Active' : 'Disconnected'}
        </div>
      </header>

      {/* Scoreboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {targetGames.map((gameId) => (
          <GameCard key={gameId} gameId={gameId} />
        ))}
      </div>
    </div>
  );
}

export default App;