import { Star, Clock, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../types';
import { useMemo, useState, useEffect, useRef } from 'react';

interface MatchRowProps {
  match: Match;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
}

function ScoreDisplay({ score, previousScore }: { score: number; previousScore: number }) {
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(previousScore);
  useEffect(() => {
    if (score !== prevRef.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 300);
      prevRef.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);
  return (
    <span className={`font-mono font-black text-lg tabular-nums transition-all ${flash ? 'score-flash text-primary' : 'text-white'}`}>
      {score}
    </span>
  );
}

export function MatchRow({ match, isFavourite, onToggleFavourite }: MatchRowProps) {
  const navigate = useNavigate();
  const [prevScores] = useState({ home: match.homeScore, away: match.awayScore });

  const statusDisplay = useMemo(() => {
    if (match.status === 'live') {
      return (
        <div className="flex items-center gap-1.5 bg-red-500/20 px-2 py-0.5 rounded-full">
          <span className="live-dot" />
          <span className="text-xs font-bold text-red-500 uppercase">{match.clock || "LIVE"}</span>
        </div>
      );
    }
    if (match.status === 'finished') return <span className="text-xs font-bold text-muted-foreground bg-white/10 px-2 py-0.5 rounded-full">FT</span>;
    // scheduled – show "2nd half", "1st half" or time
    if (match.clock && (match.clock.includes('half') || match.clock.includes('Half'))) {
      return <span className="text-xs font-bold text-muted-foreground bg-white/10 px-2 py-0.5 rounded-full">{match.clock}</span>;
    }
    return (
      <div className="flex items-center gap-1 text-muted-foreground bg-white/10 px-2 py-0.5 rounded-full">
        <Clock size={12} />
        <span className="text-xs font-medium">{match.startTime || "19:00"}</span>
      </div>
    );
  }, [match.status, match.clock, match.startTime]);

  const handleClick = () => navigate(`/match/${match.gameId}`);

  return (
    <div
      className="match-row grid grid-cols-12 items-center px-4 py-3 cursor-pointer border-b border-white/5 transition-all"
      onClick={handleClick}
    >
      {/* Teams & scores */}
      <div className="col-span-6 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold truncate">{match.homeTeam}</span>
          <ScoreDisplay score={match.homeScore} previousScore={prevScores.home} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate text-muted-foreground">{match.awayTeam}</span>
          <ScoreDisplay score={match.awayScore} previousScore={prevScores.away} />
        </div>
      </div>

      {/* Status & odds */}
      <div className="col-span-3 flex flex-col items-center gap-1">
        {statusDisplay}
        {/* Odds pill like SofaScore */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          <span className="text-muted-foreground">1</span>
          <span className="font-mono text-primary font-bold">2.10</span>
          <span className="text-muted-foreground">X</span>
          <span className="font-mono text-primary font-bold">3.40</span>
          <TrendingUp size={10} className="text-green-500 ml-0.5" />
        </div>
      </div>

      {/* Favourite and vote button */}
      <div className="col-span-3 flex items-center justify-end gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavourite(match.gameId); }}
          className="p-1.5 rounded-full hover:bg-primary/20 transition hover:scale-110"
        >
          <Star size={14} className={isFavourite ? "fill-yellow-500 text-yellow-500 drop-shadow-glow" : "text-muted-foreground"} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); alert(`Vote for ${match.homeTeam} vs ${match.awayTeam}`); }}
          className="text-[11px] font-bold bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 text-primary px-3 py-1.5 rounded-full transition shadow-md whitespace-nowrap"
        >
          Who will win? <span className="ml-1">🎯</span>
        </button>
      </div>
    </div>
  );
}