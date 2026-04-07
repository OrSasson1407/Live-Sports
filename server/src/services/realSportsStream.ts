import { EventEmitter } from 'events';
import { GameTick } from '../types/ticker';
import { config } from '../config/index';

export const streamEvents = new EventEmitter();
export const currentGames: Map<string, GameTick> = new Map();

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

export function startExternalStream() {
  console.log(`📡 Sofascore Engine: Online & Polling Live Events...`);
  console.log(`   Sports: ${config.sportsToPoll.join(', ')}`);
  console.log(`   Interval: ${config.pollInterval / 1000}s`);

  const fetchLiveGames = async () => {
    for (const sport of config.sportsToPoll) {
      try {
        const response = await fetch(
          `https://${config.rapidApiHost}/tournaments/get-live-events?sport=${sport}`,
          {
            headers: {
              'x-rapidapi-key': config.rapidApiKey,
              'x-rapidapi-host': config.rapidApiHost,
            },
          }
        );

        if (!response.ok) {
          console.error(`❌ Sofascore API error for ${sport}: ${response.status}`);
          continue;
        }

        const data = (await response.json()) as SofascoreResponse;

        if (!data.events || data.events.length === 0) {
          if (config.nodeEnv === 'development') {
            console.log(`💤 No live ${sport} matches right now.`);
          }
          continue;
        }

        console.log(`✅ Found ${data.events.length} live ${sport} events!`);

        data.events.forEach((event) => {
          const gameId = `SOFA-${event.id}`;
          const sportType = sport === 'football' ? 'soccer' : 'basketball';

          const liveTick: GameTick = {
            gameId,
            sport: sportType,
            homeTeam: event.homeTeam?.shortName || event.homeTeam?.name || 'Home',
            awayTeam: event.awayTeam?.shortName || event.awayTeam?.name || 'Away',
            homeScore: event.homeScore?.current ?? 0,
            awayScore: event.awayScore?.current ?? 0,
            clock: event.status?.description || 'LIVE',
            status: event.status?.type === 'finished' ? 'finished' : 'live',
          };

          currentGames.set(gameId, liveTick);
          streamEvents.emit('tick', liveTick);
        });
      } catch (error) {
        console.error(`❌ Sofascore Fetch Error for ${sport}:`, error);
      }
    }
  };

  setInterval(fetchLiveGames, config.pollInterval);
  fetchLiveGames();
}