import { config } from '../config/index';
import { CacheService } from './CacheService';
import { WebSocketService } from '../socket/WebSocketService';
import { DatabaseSyncQueue } from './DatabaseSyncQueue';
import { GameTick } from '../types/ticker';

// --- Types (same as before) ---
type SofascoreEvent = {
  id: number;
  status?: { type?: string; description?: string };
  homeTeam?: { name?: string; shortName?: string };
  awayTeam?: { name?: string; shortName?: string };
  homeScore?: { current?: number };
  awayScore?: { current?: number };
  tournament?: { name?: string; sport?: { name?: string } };
};
type SofascoreResponse = { events?: SofascoreEvent[] };
type SofascoreIncident = { incidentType?: string; time?: number; player?: { name?: string } };
type SofascoreIncidentResponse = { incidents?: SofascoreIncident[] };
// -----------------------------

export class LiveFeedEngine {
  private static pollTimer: NodeJS.Timeout;
  private static isHyperDrive = false;
  private static isRunning = false;
  private static lastIncidentFetch = new Map<string, number>();
  private static consecutiveFailures = 0; // track API failures

  public static start() {
    console.log(`🚀 Live Feed Engine V6 (Free Tier Optimized + Mock Fallback)`);
    this.scheduleNextPoll(1000);
  }

  public static stop() {
    if (this.pollTimer) clearTimeout(this.pollTimer);
  }

  private static scheduleNextPoll(delayMs: number) {
    if (this.pollTimer) clearTimeout(this.pollTimer);
    this.pollTimer = setTimeout(() => this.fetchAndProcessData(), delayMs);
  }

  /**
   * Robust fetch with exponential backoff (long waits for free tier)
   */
  private static async fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 2,
    baseDelay = 15000 // 15 seconds initial wait for 429
  ): Promise<Response | null> {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const res = await fetch(url, options);
        if (res.status === 429) {
          const retryAfter = res.headers.get('retry-after');
          let waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : baseDelay * Math.pow(2, attempt);
          waitTime = Math.min(waitTime, 60000); // cap at 60 seconds
          console.warn(`⛔ Rate limited (attempt ${attempt + 1}/${maxRetries + 1}). Waiting ${waitTime / 1000}s`);
          await new Promise(r => setTimeout(r, waitTime));
          attempt++;
          continue;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        this.consecutiveFailures = 0; // success, reset failure counter
        return res;
      } catch (err: any) {
        if (attempt >= maxRetries) {
          console.error(`❌ API failed after ${maxRetries + 1} attempts: ${err.message}`);
          return null;
        }
        const waitTime = Math.min(baseDelay * Math.pow(2, attempt), 60000);
        console.warn(`⚠️ Fetch error: ${err.message}. Retrying in ${waitTime / 1000}s`);
        await new Promise(r => setTimeout(r, waitTime));
        attempt++;
      }
    }
    return null;
  }

  /**
   * Mock live data when real API is unavailable
   */
  private static generateMockData(sport: string): GameTick[] {
    console.log(`🎭 Using MOCK data for ${sport} (API rate-limited or failed)`);
    const mockGames: GameTick[] = [
      {
        gameId: `MOCK-1`,
        sport: sport === 'football' ? 'soccer' : sport,
        homeTeam: 'Demo FC',
        awayTeam: 'Test United',
        homeScore: 1,
        awayScore: 0,
        clock: 'LIVE 32\'',
        status: 'live',
      },
      {
        gameId: `MOCK-2`,
        sport: sport === 'football' ? 'soccer' : sport,
        homeTeam: 'City Stars',
        awayTeam: 'North End',
        homeScore: 2,
        awayScore: 2,
        clock: 'LIVE 68\'',
        status: 'live',
      },
    ];
    return mockGames;
  }

  private static async fetchAndProcessData() {
    if (this.isRunning) return;
    this.isRunning = true;

    let totalLiveGamesActive = 0;
    const results: any[] = [];

    for (let idx = 0; idx < config.sportsToPoll.length; idx++) {
      const sport = config.sportsToPoll[idx];
      let data: SofascoreResponse | null = null;

      // Delay between sports to avoid burst rate limiting
      if (idx > 0 && config.requestDelayMs > 0) {
        await new Promise(r => setTimeout(r, config.requestDelayMs));
      }

      // Try real API
      const url = `https://${config.rapidApiHost}/tournaments/get-live-events?sport=${sport}`;
      const response = await this.fetchWithRetry(url, {
        headers: {
          'x-rapidapi-key': config.rapidApiKey,
          'x-rapidapi-host': config.rapidApiHost,
        },
      }, 2, 15000);

      if (response) {
        data = await response.json() as SofascoreResponse;
        this.consecutiveFailures = 0;
      } else {
        this.consecutiveFailures++;
        // After 3 consecutive failures, use mock data
        if (config.enableMockFallback && this.consecutiveFailures >= 3) {
          console.warn(`⚠️ ${this.consecutiveFailures} consecutive API failures – switching to MOCK data`);
          const mockGames = this.generateMockData(sport);
          // Process mock games directly
          for (const mockTick of mockGames) {
            const hasChanged = CacheService.setAndDiff(mockTick);
            if (hasChanged) {
              WebSocketService.broadcast(mockTick.gameId, 'TICK', mockTick);
              DatabaseSyncQueue.enqueue(mockTick);
            }
          }
          totalLiveGamesActive = mockGames.length;
        }
        continue;
      }

      if (!data?.events || data.events.length === 0) continue;

      totalLiveGamesActive += data.events.length;

      for (const event of data.events) {
        const gameId = `SOFA-${event.id}`;
        const sportTypeMap: Record<string, string> = {
          'football': 'soccer',
          'basketball': 'basketball',
          'tennis': 'tennis',
          'hockey': 'hockey',
          'baseball': 'baseball',
          'american-football': 'american-football',
          'rugby': 'rugby',
          'volleyball': 'volleyball',
          'handball': 'handball'
        };
        const sportType = sportTypeMap[sport] ?? sport;
        const competition = event.tournament?.name || event.tournament?.sport?.name || sport;

        const liveTick: GameTick = {
          gameId,
          sport: sportType,
          competition,
          homeTeam: event.homeTeam?.shortName || event.homeTeam?.name || 'Home',
          awayTeam: event.awayTeam?.shortName || event.awayTeam?.name || 'Away',
          homeScore: event.homeScore?.current ?? 0,
          awayScore: event.awayScore?.current ?? 0,
          clock: event.status?.description || 'LIVE',
          status: event.status?.type === 'finished' ? 'finished' : 'live',
        };

        const oldGame = CacheService.getGame(gameId);
        const isGoal = oldGame &&
          (liveTick.homeScore > oldGame.homeScore || liveTick.awayScore > oldGame.awayScore);

        const hasChanged = CacheService.setAndDiff(liveTick);

        if (hasChanged) {
          WebSocketService.broadcast(gameId, 'TICK', liveTick);
          DatabaseSyncQueue.enqueue(liveTick);
          if (isGoal) {
            setTimeout(() => this.handleDeepGoalIncident(event.id, liveTick), 1500);
          }
        }
      }
    }

    // Adaptive polling
    if (totalLiveGamesActive > 0) {
      console.log(`📡 [POLL COMPLETE] Tracking ${totalLiveGamesActive} live games.`);
      if (!this.isHyperDrive) {
        console.log(`🏎️ Live games detected! Hyper-Drive (${config.pollInterval / 1000}s)`);
        this.isHyperDrive = true;
      }
      this.scheduleNextPoll(Math.max(config.pollInterval, 180000)); // min 3 min
    } else {
      if (this.isHyperDrive) {
        console.log(`💤 No live games. Eco-Mode (5 min)`);
        this.isHyperDrive = false;
      }
      this.scheduleNextPoll(300000); // 5 minutes
    }

    this.isRunning = false;
  }

  private static async handleDeepGoalIncident(eventId: number, game: GameTick) {
    const now = Date.now();
    const lastFetch = this.lastIncidentFetch.get(game.gameId) || 0;
    if (now - lastFetch < 10000) return;
    this.lastIncidentFetch.set(game.gameId, now);

    try {
      const response = await this.fetchWithRetry(
        `https://${config.rapidApiHost}/matches/get-incidents?eventId=${eventId}`,
        {
          headers: {
            'x-rapidapi-key': config.rapidApiKey,
            'x-rapidapi-host': config.rapidApiHost,
          },
        },
        1,
        5000
      );
      if (!response) return;
      const incidentData = (await response.json()) as SofascoreIncidentResponse;
      const latestGoal = incidentData?.incidents?.find(inc => inc.incidentType === 'goal');
      if (latestGoal?.player?.name) {
        WebSocketService.broadcast('ALL', 'ALERT', {
          message: `🚨 GOAL! ${latestGoal.player.name} (${latestGoal.time}') | ${game.homeTeam} ${game.homeScore} - ${game.awayScore} ${game.awayTeam}`,
        });
      } else {
        WebSocketService.broadcast('ALL', 'ALERT', {
          message: `🚨 GOAL in ${game.homeTeam} vs ${game.awayTeam}! (${game.homeScore} - ${game.awayScore})`,
        });
      }
    } catch (e) {
      console.error('⚠️ Incident fetch failed');
    }
  }
}