import { EventEmitter } from 'events';
import { GameTick } from '../types/ticker';
import { config } from '../config';

export const streamEvents = new EventEmitter();

// In-memory store of current game states so we can serve them via REST
export const currentGames: Map<string, GameTick> = new Map();

/* =========================
   ✅ TYPES
========================= */
type SofascoreEvent = {
  id: number;
  status?: {
    type?: string;
    description?: string;
  };
  homeTeam?: {
    name?: string;
    shortName?: string;
  };
  awayTeam?: {
    name?: string;
    shortName?: string;
  };
  homeScore?: { current?: number };
  awayScore?: { current?: number };
  tournament?: {
    sport?: { name?: string };
  };
};

type SofascoreResponse = {
  events?: SofascoreEvent[];
};

/* =========================
   🚀 MAIN STREAM
========================= */

export function startExternalStream() {
  console.log(`📡 Sofascore Engine: Online & Polling Live Events...`);

  // We want to fetch both sports
  const sportsToFetch = ['football', 'basketball'];

  const fetchLiveGames = async () => {
    try {
      // We will loop through the array of sports and hit the endpoint for each one
      for (const sport of sportsToFetch) {
        
        const response = await fetch(
          `https://sofascore.p.rapidapi.com/tournaments/get-live-events?sport=${sport}`,
          {
            headers: {
              'x-rapidapi-key': config.rapidApiKey,
              'x-rapidapi-host': 'sofascore.p.rapidapi.com',
            },
          }
        );

        if (!response.ok) {
          console.error(`❌ Sofascore API error for ${sport}: ${response.status}`);
          continue; // Skip to the next sport if this one fails
        }

        const data = (await response.json()) as SofascoreResponse;

        if (!data.events || data.events.length === 0) {
          console.log(`💤 No live ${sport} matches right now.`);
          continue;
        }

        console.log(`✅ Found ${data.events.length} live ${sport} events!`);

        data.events.forEach((event) => {
          const gameId = `SOFA-${event.id}`;

          // Map Sofascore's format to our GameTick format
          const liveTick: GameTick = {
            gameId,
            sport: sport === 'football' ? 'soccer' : 'basketball',
            homeTeam: event.homeTeam?.shortName || event.homeTeam?.name || 'Home',
            awayTeam: event.awayTeam?.shortName || event.awayTeam?.name || 'Away',
            homeScore: event.homeScore?.current ?? 0,
            awayScore: event.awayScore?.current ?? 0,
            clock: event.status?.description || 'LIVE',
            status: event.status?.type === 'finished' ? 'finished' : 'live',
          };

          // Save to our memory map
          currentGames.set(gameId, liveTick);

          // Broadcast to all React clients viewing the dashboard
          streamEvents.emit('tick', liveTick);
        });
      }

    } catch (error) {
      console.error('❌ Sofascore Fetch Error:', error);
    }
  };

  // ⏱ Polling every 60 seconds (1 minute)
  // 2 sports * 1 fetch every minute = 120 requests/hour while testing.
  setInterval(fetchLiveGames, 60000);

  // Run the first fetch immediately when the server boots
  fetchLiveGames();
}