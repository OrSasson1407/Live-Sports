// components/MatchRow.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';
import { Star } from 'lucide-react';

function AnimatedScore({ score }: { score: number }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(score);
  useEffect(() => {
    if (score !== prev.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 300);
      prev.current = score;
      return () => clearTimeout(t);
    }
  }, [score]);
  return (
    <span className={`font-mono font-bold tabular-nums transition-all duration-200 ${flash ? 'text-blue-400 scale-105' : 'text-white'}`}>
      {score}
    </span>
  );
}

export default function MatchRow({ gameId }: { gameId: string }) {
  const game = useSportsStore((state) => state.games[gameId]);
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  if (!game) return null;

  const isLive = game.status === 'live';
  const statusLabel = isLive ? game.clock : game.status === 'halftime' ? 'HT' : game.status === 'finished' ? 'FT' : '';

  return (
    <div
      onClick={() => navigate(`/match/${gameId}`)}
      className="group grid grid-cols-12 items-center gap-2 px-4 py-2.5 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
    >
      {/* Time / Status */}
      <div className="col-span-2 text-xs font-medium">
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 text-red-400">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            {statusLabel}
          </span>
        ) : (
          <span className="text-gray-500">{statusLabel || '—'}</span>
        )}
      </div>

      {/* Home team */}
      <div className="col-span-4 flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate">{game.homeTeam}</span>
        <AnimatedScore score={game.homeScore} />
      </div>

      {/* Away team */}
      <div className="col-span-4 flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate">{game.awayTeam}</span>
        <AnimatedScore score={game.awayScore} />
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); setFav(!fav); }}
          className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Star size={14} className={fav ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'} />
        </button>
      </div>
    </div>
  );
}