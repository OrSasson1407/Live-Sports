// server/src/services/LiveFeedEngine.ts
import { config } from '../config/index';
import { CacheService } from './CacheService';
import { WebSocketService } from '../socket/WebSocketService';
import { DatabaseSyncQueue } from './DatabaseSyncQueue';
import { GameTick } from '../types/ticker';

// --- TYPESCRIPT DEFINITIONS ---
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

type SofascoreIncident = {
  incidentType?: string;
  time?: number;
  player?: {
    name?: string;
  };
};

type SofascoreIncidentResponse = {
  incidents?: SofascoreIncident[];
};
// ------------------------------

export class LiveFeedEngine {
  private static pollTimer: NodeJS.Timeout;
  private static isHyperDrive = false; // Tracks if we are in fast-polling mode

  public static start() {
    console.log(`🚀 Live Feed Engine V3 Started.`);
    this.scheduleNextPoll(1000); // Start immediately
  }

  public static stop() {
    if (this.pollTimer) clearTimeout(this.pollTimer);
  }

  private static scheduleNextPoll(delayMs: number) {
    if (this.pollTimer) clearTimeout(this.pollTimer);
    this.pollTimer = setTimeout(() => this.fetchAndProcessData(), delayMs);
  }

  private static async fetchAndProcessData() {
    let totalLiveGamesActive = 0;

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

        if (!response.ok) continue;

        // FIX: Cast the response to our defined type
        const data = (await response.json()) as SofascoreResponse;
        
        if (!data.events || data.events.length === 0) continue;
        
        totalLiveGamesActive += data.events.length;

        for (const event of data.events) {
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

          const oldGame = CacheService.getGame(gameId);
          const isGoal = oldGame && (liveTick.homeScore > oldGame.homeScore || liveTick.awayScore > oldGame.awayScore);
          const hasChanged = CacheService.setAndDiff(liveTick);

          if (hasChanged) {
            // 1. Instantly update UI for snappy feel
            WebSocketService.broadcast(gameId, 'TICK', liveTick);
            
            // 2. Queue for Database saving (Non-Blocking)
            DatabaseSyncQueue.enqueue(liveTick);
            
            // 3. The "365Scores" Incident Feature
            if (isGoal) {
               this.handleDeepGoalIncident(event.id, liveTick);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Fetch Error for ${sport}:`, error);
      }
    }

    // 🔥 ADAPTIVE POLLING LOGIC 🔥
    if (totalLiveGamesActive > 0) {
      if (!this.isHyperDrive) {
        console.log(`🏎️ Live games detected! Shifting to Hyper-Drive (${config.pollInterval / 1000}s)`);
        this.isHyperDrive = true;
      }
      this.scheduleNextPoll(config.pollInterval); // Fast polling
    } else {
      if (this.isHyperDrive) {
        console.log(`💤 No live games. Shifting to Eco-Mode (5 minutes) to save API credits.`);
        this.isHyperDrive = false;
      }
      this.scheduleNextPoll(300000); // 5 Minutes (300,000ms)
    }
  }

  /**
   * Makes a micro-request to get the EXACT player who scored
   */
  private static async handleDeepGoalIncident(eventId: number, game: GameTick) {
    try {
      const response = await fetch(
        `https://${config.rapidApiHost}/events/get-incidents?eventId=${eventId}`,
        {
          headers: {
            'x-rapidapi-key': config.rapidApiKey,
            'x-rapidapi-host': config.rapidApiHost,
          },
        }
      );
      
      // FIX: Cast the response to our defined incident type
      const incidentData = (await response.json()) as SofascoreIncidentResponse;
      
      // Find the most recent goal incident
      const latestGoal = incidentData?.incidents?.find((inc) => inc.incidentType === 'goal');

      if (latestGoal && latestGoal.player?.name) {
        const playerName = latestGoal.player.name;
        const time = latestGoal.time;
        
        WebSocketService.broadcast('ALL', 'ALERT', { 
          message: `🚨 GOAL! ${playerName} (${time}') | ${game.homeTeam} ${game.homeScore} - ${game.awayScore} ${game.awayTeam}` 
        });
      } else {
        // Fallback if player name isn't available yet
        WebSocketService.broadcast('ALL', 'ALERT', { 
          message: `🚨 GOAL in ${game.homeTeam} vs ${game.awayTeam}! (${game.homeScore} - ${game.awayScore})` 
        });
      }

    } catch (e) {
      console.error("Could not fetch deep incident data");
    }
  }
}