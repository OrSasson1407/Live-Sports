import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export function MatchCard({ match, isFavourite, onToggleFavourite }: any) {
  const [expanded, setExpanded] = useState(false);
  const [flash, setFlash] = useState(false);
  const [prevScore, setPrevScore] = useState({
    home: match.homeScore,
    away: match.awayScore
  });

  useEffect(() => {
    if (
      match.homeScore !== prevScore.home ||
      match.awayScore !== prevScore.away
    ) {
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
      setPrevScore({
        home: match.homeScore,
        away: match.awayScore
      });
    }
  }, [match.homeScore, match.awayScore]);

  return (
    <>
      {/* ROW */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="match-row group relative flex items-center justify-between px-4 py-3 cursor-pointer overflow-hidden"
      >

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-500/5 to-transparent" />

        {/* Teams */}
        <div className="flex flex-col gap-1 flex-1 z-10">
          <span className="text-sm font-semibold">
            {match.homeTeam}
          </span>
          <span className="text-sm text-muted-foreground">
            {match.awayTeam}
          </span>
        </div>

        {/* Score */}
        <div className={`z-10 flex flex-col items-center mx-4 ${flash ? 'score-flash' : ''}`}>
          <div className="text-lg font-extrabold leading-none">
            {match.homeScore ?? '-'}
          </div>
          <div className="text-[10px] text-muted-foreground">—</div>
          <div className="text-lg font-extrabold leading-none">
            {match.awayScore ?? '-'}
          </div>
        </div>

        {/* Time */}
        <div className="z-10 flex flex-col items-end text-xs min-w-[50px]">
          {match.status === 'live' ? (
            <>
              <div className="flex items-center text-red-500 font-bold">
                <span className="live-pulse mr-1" />
                LIVE
              </div>
              <span className="text-primary font-bold text-sm">
                {match.minute || "0'"}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              {match.time || 'FT'}
            </span>
          )}
        </div>

        {/* Favourite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(match.gameId);
          }}
          className="ml-2 z-10"
        >
          <Star
            size={16}
            className={
              isFavourite
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-muted-foreground'
            }
          />
        </button>
      </div>

      {/* EXPANDED */}
      {expanded && (
        <div className="expand px-4 py-2 bg-secondary/40 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Possession</span>
            <span>54% - 46%</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Shots</span>
            <span>10 - 7</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Corners</span>
            <span>5 - 3</span>
          </div>
        </div>
      )}
    </>
  );
}