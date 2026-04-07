import { Router } from 'express';
import * as matchController from '../controllers/match.controller';

const router = Router();

// Basic Detail
router.get('/:id/detail', matchController.getDetail);

// Insights & Social
router.get('/:id/ai-insights', matchController.getAiInsights);
router.get('/:id/comments', matchController.getComments);
router.get('/:id/tweets', matchController.getTweets);
router.get('/:id/media', matchController.getMedia);

// Match Data
router.get('/:id/lineups', matchController.getLineups);
router.get('/:id/incidents', matchController.getIncidents);
router.get('/:id/statistics', matchController.getStatistics);
router.get('/:id/graph', matchController.getGraph);
router.get('/:id/votes', matchController.getVotes);
router.get('/:id/managers', matchController.getManagers);
router.get('/:id/team-streaks', matchController.getTeamStreaks);
router.get('/:id/best-players', matchController.getBestPlayers);

// Player Specific (Needs Player ID)
router.get('/:id/player/:playerId/statistics', matchController.getPlayerStatistics);
router.get('/:id/player/:playerId/heatmap', matchController.getPlayerHeatmap);

// Odds
router.get('/:id/odds/all', matchController.getAllOdds);
router.get('/:id/odds/featured', matchController.getFeaturedOdds);

// H2H
router.get('/:id/h2h-events', matchController.getH2HEvents);
router.get('/:id/h2h', matchController.getH2H);

// Esport
router.get('/:id/esport-games', matchController.getEsportGames);

export default router;