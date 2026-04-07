import { Router } from 'express';
import * as s from '../controllers/stages.controller';

const router = Router();
router.get('/get-scheduled-events', s.getScheduledEvents);
router.get('/detail', s.getDetail);
router.get('/get-substages', s.getSubstages);
router.get('/get-driver-performance', s.getDriverPerformance);
router.get('/get-standings', s.getStandings);
router.get('/get-highlights', s.getHighlights);
router.get('/get-races', s.getRaces);
router.get('/get-odds', s.getOdds);
export default router;