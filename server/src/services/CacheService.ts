// server/src/services/CacheService.ts
import { GameTick } from '../types/ticker';

export class CacheService {
  private static games = new Map<string, GameTick>();

  /**
   * Updates the cache and returns TRUE if the data actually changed.
   * This prevents spamming the client with identical data.
   */
  public static setAndDiff(game: GameTick): boolean {
    const existing = this.games.get(game.gameId);
    
    // If it doesn't exist, it's new!
    if (!existing) {
      this.games.set(game.gameId, game);
      return true;
    }

    // Check if anything important changed (score, clock, status)
    const hasChanged = 
      existing.homeScore !== game.homeScore ||
      existing.awayScore !== game.awayScore ||
      existing.clock !== game.clock ||
      existing.status !== game.status;

    if (hasChanged) {
      this.games.set(game.gameId, game);
    }

    return hasChanged;
  }

  public static getGame(id: string): GameTick | undefined {
    return this.games.get(id);
  }

  public static getAllGames(): GameTick[] {
    return Array.from(this.games.values());
  }
}