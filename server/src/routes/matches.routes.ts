import { Router, Request, Response } from 'express';

const router = Router();

const placeholderHandler = (req: Request, res: Response) => {
  res.json({ message: `Matches domain: ${req.path}` });
};

router.get('/detail', placeholderHandler);
router.get('/get-ai-insights', placeholderHandler);
router.get('/get-lineups', placeholderHandler);
router.get('/get-comments', placeholderHandler);
router.get('/get-incidents', placeholderHandler);
router.get('/get-managers', placeholderHandler);
router.get('/get-votes', placeholderHandler);
router.get('/get-graph', placeholderHandler);
router.get('/get-statistics', placeholderHandler);
router.get('/get-team-streaks', placeholderHandler);
router.get('/get-best-players', placeholderHandler);
router.get('/get-media', placeholderHandler);
router.get('/get-tweets', placeholderHandler);
router.get('/get-esport-games', placeholderHandler);
router.get('/get-player-statistics', placeholderHandler);
router.get('/get-player-heatmap', placeholderHandler);
router.get('/get-all-odds', placeholderHandler);
router.get('/get-featured-odds', placeholderHandler);
router.get('/get-h2h-events', placeholderHandler);
router.get('/get-h2h', placeholderHandler);
router.get('/get-head2head', placeholderHandler); // Deprecated

export default router;