import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
  match: any;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
}

export function MatchCard({ match, isFavourite, onToggleFavourite }: MatchCardProps) {
  const navigate = useNavigate();
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const statusText = isFinished ? 'FT' : isLive ? match.clock : '';

  return (
    <div
      onClick={() => navigate(`/match/${match.gameId}`)}
      className="flex items-center px-4 py-3 hover:bg-secondary/30 cursor-pointer transition-colors group"
    >
      {/* Time/Status */}
      <div className="w-16 text-xs font-mono">
        {isLive ? (
          <span className="text-destructive font-bold flex items-center gap-1">
            <span className="live-pulse" /> LIVE
          </span>
        ) : (
          <span className="text-muted-foreground">{statusText || '-'}</span>
        )}
      </div>

      {/* Teams and scores */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{match.homeTeam}</span>
          </div>
          <span className={`text-sm font-bold tabular-nums ${isLive ? 'text-foreground' : 'text-muted-foreground'}`}>
            {match.homeScore}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{match.awayTeam}</span>
          </div>
          <span className={`text-sm font-bold tabular-nums ${isLive ? 'text-foreground' : 'text-muted-foreground'}`}>
            {match.awayScore}
          </span>
        </div>
      </div>

      {/* Favourite star */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(match.gameId);
        }}
        className="ml-2 p-1 text-muted-foreground hover:text-yellow-500 transition-all hover:scale-110"
      >
        <Star size={16} fill={isFavourite ? 'currentColor' : 'none'} className={isFavourite ? 'text-yellow-500' : ''} />
      </button>
    </div>
  );
}