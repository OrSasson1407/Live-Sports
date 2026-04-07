import { Router, Request, Response } from 'express';
import { currentGames } from '../services/realSportsStream';

const router = Router();

// Returns all currently live games
router.get('/live', (req: Request, res: Response) => {
  const games = Array.from(currentGames.values());
  res.json({ games, count: games.length });
});

// Legacy endpoint
router.get('/available', (req: Request, res: Response) => {
  const gameIds = Array.from(currentGames.keys());
  res.json({ gameIds, count: gameIds.length });
});

export default router;
