// server/src/services/DatabaseSyncQueue.ts
import { GameTick } from '../types/ticker';
// import prisma from '../config/prisma'; // Make sure to import your Prisma client

export class DatabaseSyncQueue {
  private static queue: GameTick[] = [];
  private static isProcessing = false;

  /**
   * Push a game update to be saved in the background
   */
  public static enqueue(game: GameTick) {
    this.queue.push(game);
    this.processQueue();
  }

  private static async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const game = this.queue.shift();
      if (!game) continue;

      try {
        // 🔥 This is where you sync to Prisma in the background
        // await prisma.match.upsert({
        //   where: { gameId: game.gameId },
        //   update: { homeScore: game.homeScore, awayScore: game.awayScore, status: game.status },
        //   create: { ...game }
        // });
        
        // Uncomment the Prisma code once your schema matches!
      } catch (error) {
        console.error(`🚨 Failed to save game ${game.gameId} to DB:`, error);
      }
    }

    this.isProcessing = false;
  }
}