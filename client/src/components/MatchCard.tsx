import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';
import { Activity } from 'lucide-react';

// Upgraded Helper component for the flashing score effect
function ScoreDisplay({ score, isLive }: { score: number; isLive: boolean }) {
  const [flash, setFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 1000);
      prevScore.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <div className={`text-2xl font-black tabular-nums transition-all duration-300 ${flash ? 'text-blue-500 scale-125 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'text-white'}`}>
      {score}
    </div>
  );
}

// Visual indicator showing which team has attacking momentum
function MomentumIndicator({ homeAdvantage }: { homeAdvantage: boolean }) {
  return (
    <div className="flex items-center gap-1 h-1 w-full mt-2 bg-gray-800/50 rounded-full overflow-hidden">
      <div className={`h-full bg-blue-500 transition-all duration-1000 ${homeAdvantage ? 'w-3/4' : 'w-1/4'}`} />
      <div className={`h-full bg-red-500 transition-all duration-1000 ${homeAdvantage ? 'w-1/4' : 'w-3/4'}`} />
    </div>
  );
}

export default function MatchCard({ gameId }: { gameId: string }) {
  const navigate = useNavigate();
  const game = useSportsStore((state) => state.games[gameId]);
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!game) return null;

  const isFinished = game.status === 'finished';
  const isHalftime = game.status === 'halftime';
  const isLive = !isFinished && !isHalftime && game.status === 'live';
  
  const statusLabel = isFinished ? 'FT' : isHalftime ? 'HT' : game.clock;

  // Derive sport icon based on your store's sport property
  const sportIcon = game.sport === 'basketball' ? '🏀' : '⚽';

  return (
    <div 
      onClick={() => navigate(`/match/${gameId}`)}
      className="group relative bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden"
    >
      {/* Subtle Background Gradient Highlight on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 text-xs font-semibold text-gray-400">
        <div className="flex items-center gap-2">
          <span>{sportIcon}</span>
          <span className={`px-2 py-0.5 rounded-md ${isLive ? 'bg-red-500/10 text-red-500' : 'bg-gray-800'}`}>
            {statusLabel}
            {isLive && <span className="inline-block ml-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
          </span>
        </div>
        
        <button 
          aria-label="Favorite match"
          onClick={(e) => { 
            e.stopPropagation(); 
            setIsFavorite(!isFavorite); 
          }}
          className={`transition-colors z-10 ${isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
      
      {/* Teams & Scores */}
      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-xs font-bold text-gray-400">
               {game.homeTeam.charAt(0)}
             </div>
            <span className={`text-base truncate max-w-[120px] sm:max-w-none ${game.homeScore >= game.awayScore ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
              {game.homeTeam}
            </span>
          </div>
          <ScoreDisplay score={game.homeScore} isLive={isLive} />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-xs font-bold text-gray-400">
               {game.awayTeam.charAt(0)}
             </div>
            <span className={`text-base truncate max-w-[120px] sm:max-w-none ${game.awayScore >= game.homeScore ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
              {game.awayTeam}
            </span>
          </div>
          <ScoreDisplay score={game.awayScore} isLive={isLive} />
        </div>
      </div>

      {/* Live Momentum Bar (Only shows if the game is live) */}
      {isLive && (
        <div className="mt-4 pt-3 border-t border-gray-800/50">
          <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest mb-1">
            <span>Attacking Momentum</span>
            <Activity size={12} className="text-blue-400" />
          </div>
          <MomentumIndicator homeAdvantage={game.homeScore >= game.awayScore} />
        </div>
      )}
    </div>
  );
}