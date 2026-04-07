import { EventEmitter } from 'events';
import { GameTick } from '../types/ticker';
import { config } from '../config';

export const streamEvents = new EventEmitter();

// In-memory store of current game states so we can serve them via REST
export const currentGames: Map<string, GameTick> = new Map();

/* =========================
   ✅ TYPES (FIX FOR TS ERROR)
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
  sport?: { name?: string };
};

type SofascoreResponse = {
  events?: SofascoreEvent[];
};

/* =========================
   🚀 MAIN STREAM
========================= */

export function startExternalStream() {
  console.log(`📡 Sofascore Engine: Online & Polling...`);

  const fetchLiveGames = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const response = await fetch(
        `https://sofascore.p.rapidapi.com/matches/list-by-date?date=${today}&timezone=UTC`,
        {
          headers: {
            'x-rapidapi-key': config.rapidApiKey,
            'x-rapidapi-host': 'sofascore.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) {
        console.error(`❌ Sofascore API error: ${response.status} ${response.statusText}`);
        return;
      }

      // ✅ FIX: Proper typing
      const data: SofascoreResponse = await response.json();

      if (!data.events || data.events.length === 0) {
        console.log('💤 No matches found for today.');
        return;
      }

      // ✅ Only LIVE matches
      const liveEvents = data.events.filter(
        (e) => e.status?.type === 'inprogress'
      );

      if (liveEvents.length === 0) {
        console.log('💤 No live matches right now.');
        return;
      }

      console.log(`✅ Found ${liveEvents.length} live events`);

      // Clear stale games
      currentGames.clear();

      liveEvents.forEach((event) => {
        const sportName = (
          event.tournament?.sport?.name ||
          event.sport?.name ||
          ''
        ).toLowerCase();

        // Only football + basketball
        if (sportName !== 'football' && sportName !== 'basketball') return;

        const gameId = `SOFA-${event.id}`;

        const liveTick: GameTick = {
          gameId,
          sport: sportName === 'football' ? 'soccer' : 'basketball',
          homeTeam:
            event.homeTeam?.shortName ||
            event.homeTeam?.name ||
            'Home',
          awayTeam:
            event.awayTeam?.shortName ||
            event.awayTeam?.name ||
            'Away',
          homeScore: event.homeScore?.current ?? 0,
          awayScore: event.awayScore?.current ?? 0,
          clock: event.status?.description || 'LIVE',
          status:
            event.status?.type === 'finished'
              ? 'finished'
              : 'live',
        };

        currentGames.set(gameId, liveTick);

        // Broadcast update
        streamEvents.emit('tick', liveTick);
      });

    } catch (error) {
      console.error('❌ Sofascore Fetch Error:', error);
    }
  };

  // ⏱ Polling
  setInterval(fetchLiveGames, 60000);

  // First run
  fetchLiveGames();
}