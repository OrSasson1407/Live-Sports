import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSportsStore } from '../store/useSportsStore';

// Helper component for the flashing score effect
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
    <div className={`match-score ${flash ? 'score-flash' : ''} ${isLive ? 'score-live' : ''}`}>
      {score}
    </div>
  );
}

export default function MatchCard({ gameId }: { gameId: string }) {
  const navigate = useNavigate();
  const game = useSportsStore((state) => state.games[gameId]);
  
  if (!game) return null;

  const isFinished = game.status === 'finished';
  const isHalftime = game.status === 'halftime';
  const isLive = !isFinished && !isHalftime && game.status === 'live';
  
  const statusLabel = isFinished ? 'FT' : isHalftime ? 'HT' : game.clock;

  return (
    <div 
      className="match-row" 
      onClick={() => navigate(`/match/${gameId}`)}
      style={{ cursor: 'pointer', transition: 'background-color 0.2s ease' }}
    >
      <div className="match-time-col">
        <span className={`match-time ${isLive ? 'text-live' : ''}`}>
          {statusLabel}
          {isLive && <span className="live-pulsing-dot" />}
        </span>
      </div>
      
      <div className="match-teams-col">
        <div className="match-team">
          <span className="team-name">{game.homeTeam}</span>
          <ScoreDisplay score={game.homeScore} isLive={isLive} />
        </div>
        <div className="match-team">
          <span className="team-name">{game.awayTeam}</span>
          <ScoreDisplay score={game.awayScore} isLive={isLive} />
        </div>
      </div>
      
      <div className="match-action-col">
        <button 
          className="star-btn" 
          aria-label="Favorite match"
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigating to MatchView when favoriting
            // Add favorite toggle logic here
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}