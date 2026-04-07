import { Router } from 'express';
import * as tvChannelsController from '../controllers/tvchannels.controller';

const router = Router();

router.get('/get-available-countries', tvChannelsController.getAvailableCountries);
router.get('/list', tvChannelsController.getList);
router.get('/get-votes', tvChannelsController.getVotes);
router.get('/get-schedules', tvChannelsController.getSchedules);

export default router;