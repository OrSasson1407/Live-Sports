// server/src/routes/ticker.routes.ts
import { Router, Request, Response } from 'express';
import { CacheService } from '../services/CacheService';

const router = Router();

/**
 * GET /api/tickers
 * Returns all currently cached live games
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const activeGames = CacheService.getAllGames(); // Pulls straight from memory cache
    
    res.json({ 
      success: true, 
      count: activeGames.length,
      data: activeGames 
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve live tickers' });
  }
});

/**
 * GET /api/tickers/:gameId
 * Returns a specific live game by its ID (e.g., SOFA-12345)
 */
router.get('/:gameId', (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const game = CacheService.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({ 
        success: false, 
        error: 'Game not found or is no longer live' 
      });
    }
    
    res.json({ success: true, data: game });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve game data' });
  }
});

export default router;