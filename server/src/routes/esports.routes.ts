import { Router } from 'express';
import * as esportsController from '../controllers/esports.controller';

const router = Router();

router.get('/get-lineups', esportsController.getLineups);
router.get('/get-statistics', esportsController.getStatistics);
router.get('/get-rounds', esportsController.getRounds);
router.get('/get-bans', esportsController.getBans);

export default router;