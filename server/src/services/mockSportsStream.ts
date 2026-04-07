// server/src/services/mockSportsStream.ts
import { EventEmitter } from 'events';
import { GameTick } from '../types/ticker';

export const streamEvents = new EventEmitter();

// Initial state of our live games
let liveGames: GameTick[] = [
  { gameId: 'NBA-LAL-BOS', sport: 'basketball', homeTeam: 'LAL', awayTeam: 'BOS', homeScore: 102, awayScore: 98, clock: '05:00 Q4', status: 'live' },
  { gameId: 'NBA-MIA-CHI', sport: 'basketball', homeTeam: 'MIA', awayTeam: 'CHI', homeScore: 88, awayScore: 90, clock: '02:15 Q3', status: 'live' },
  { gameId: 'NBA-GSW-PHX', sport: 'basketball', homeTeam: 'GSW', awayTeam: 'PHX', homeScore: 45, awayScore: 50, clock: '11:00 Q2', status: 'live' },
];

let interval: NodeJS.Timeout;

export function startExternalStream() {
  console.log(`🏟️ Mock Sports Engine Started`);

  // Run the simulation every 1.5 seconds
  interval = setInterval(() => {
    liveGames = liveGames.map(game => {
      if (game.status !== 'live') return game;

      // 1. Simulate the clock ticking down (simplified)
      let [minutes, secondsAndQuarter] = game.clock.split(':');
      let [seconds, quarter] = secondsAndQuarter.split(' ');
      
      let secs = parseInt(seconds) - 1;
      let mins = parseInt(minutes);
      
      if (secs < 0) {
        secs = 59;
        mins -= 1;
      }
      
      // If time runs out, game over
      if (mins < 0) {
        return { ...game, clock: '00:00 Final', status: 'finished' };
      }

      const formattedClock = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ${quarter}`;

      // 2. Randomly simulate scoring
      // 15% chance home team scores, 15% chance away team scores
      let newHomeScore = game.homeScore;
      let newAwayScore = game.awayScore;
      
      if (Math.random() > 0.85) newHomeScore += Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 points
      if (Math.random() > 0.85) newAwayScore += Math.floor(Math.random() * 3) + 1;

      const updatedGame: GameTick = {
        ...game,
        homeScore: newHomeScore,
        awayScore: newAwayScore,
        clock: formattedClock
      };

      // 3. Broadcast the update!
      streamEvents.emit('tick', updatedGame);

      return updatedGame;
    });
  }, 1500); // Send updates every 1.5s
}

// Graceful shutdown for the interval
export function stopExternalStream() {
  if (interval) clearInterval(interval);
}