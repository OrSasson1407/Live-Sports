// components/MatchCard.tsx - Premium Redesign
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';
import { Star, Activity, Clock } from 'lucide-react';

function ScoreDisplay({ score, isLive }: { score: number; isLive: boolean }) {
  const [flash, setFlash] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 400);
      prevScore.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <div className={`text-xl font-black tabular-nums transition-all duration-300 ${
      flash ? 'text-blue-400 scale-110' : 'text-white'
    }`}>
      {score}
    </div>
  );
}

function MomentumBar({ homeAdvantage }: { homeAdvantage: boolean }) {
  return (
    <div className="flex gap-0.5 h-1 w-full mt-3 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full bg-blue-500 transition-all duration-700 ${homeAdvantage ? 'w-2/3' : 'w-1/3'}`} />
      <div className={`h-full bg-red-500 transition-all duration-700 ${homeAdvantage ? 'w-1/3' : 'w-2/3'}`} />
    </div>
  );
}

export default function MatchCard({ gameId }: { gameId: string }) {
  const navigate = useNavigate();
  const game = useSportsStore((state) => state.games[gameId]);
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!game) return null;

  const isLive = game.status === 'live';
  const isFinished = game.status === 'finished';
  const isHalftime = game.status === 'halftime';
  
  const statusText = isFinished ? 'FT' : isHalftime ? 'HT' : game.clock;
  const sportIcon = game.sport === 'basketball' ? '🏀' : '⚽';
  const sportColor = game.sport === 'basketball' ? 'from-orange-500/20 to-transparent' : 'from-green-500/20 to-transparent';

  return (
    <div 
      onClick={() => navigate(`/match/${gameId}`)}
      className="group relative bg-[#1a1c23] border border-white/5 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 overflow-hidden"
    >
      {/* Hover Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sportColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{sportIcon}</span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isLive ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-400'
            }`}>
              {isLive && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />}
              <span>{statusText}</span>
            </div>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
            className={`p-1 rounded-lg transition-colors ${isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
          >
            <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Teams & Scores */}
        <div className="space-y-2.5">
          {/* Home Team */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                {game.homeTeam.charAt(0)}
              </div>
              <span className="text-sm font-medium truncate flex-1">{game.homeTeam}</span>
            </div>
            <ScoreDisplay score={game.homeScore} isLive={isLive} />
          </div>

          {/* Away Team */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                {game.awayTeam.charAt(0)}
              </div>
              <span className="text-sm font-medium truncate flex-1">{game.awayTeam}</span>
            </div>
            <ScoreDisplay score={game.awayScore} isLive={isLive} />
          </div>
        </div>

        {/* Live Momentum */}
        {isLive && (
          <div className="mt-3 pt-2 border-t border-white/5">
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>Attack Momentum</span>
              <Activity size={10} className="text-blue-400" />
            </div>
            <MomentumBar homeAdvantage={game.homeScore >= game.awayScore} />
          </div>
        )}
      </div>
    </div>
  );
}