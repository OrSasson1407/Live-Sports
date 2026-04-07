import { EventEmitter } from 'events';
import { GameTick } from '../types/ticker';
import { config } from '../config';

export const streamEvents = new EventEmitter();

export function startExternalStream() {
  console.log(`📡 Sofascore Engine: Online & Polling...`);

  const fetchLiveGames = async () => {
    try {
      // Endpoint for all live matches currently happening
      const response = await fetch('https://sofascore.p.rapidapi.com/matches/list-live', {
        headers: {
          'x-rapidapi-key': config.rapidApiKey,
          'x-rapidapi-host': 'sofascore.p.rapidapi.com'
        }
      });
      
      const data = await response.json();

      // Sofascore returns games in an 'events' array
      if (!data.events || data.events.length === 0) {
        console.log('💤 No live matches found on Sofascore right now.');
        return;
      }

      data.events.forEach((event: any) => {
        // We only want major sports to keep the dashboard clean
        const sportName = event.sport.name.toLowerCase();
        if (sportName === 'football' || sportName === 'basketball') {
          
          const liveTick: GameTick = {
            gameId: `SOFA-${event.id}`,
            sport: sportName === 'football' ? 'soccer' : 'basketball',
            homeTeam: event.homeTeam.shortName || event.homeTeam.name,
            awayTeam: event.awayTeam.shortName || event.awayTeam.name,
            homeScore: event.homeScore.current || 0,
            awayScore: event.awayScore.current || 0,
            clock: event.status.description || 'LIVE',
            status: event.status.type === 'finished' ? 'finished' : 'live'
          };

          // Push to our WebSocket subscribers
          streamEvents.emit('tick', liveTick);
        }
      });

    } catch (error) {
      console.error('❌ Sofascore Fetch Error:', error);
    }
  };

  // Poll every 2 minutes (120,000ms) 
  // This uses 30 requests per hour. You get 100 per day on free tier.
  // Pro Tip: Run this only when testing to save your daily quota!
  setInterval(fetchLiveGames, 120000);
  fetchLiveGames(); 
}