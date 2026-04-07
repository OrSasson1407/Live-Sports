import { Router } from 'express';
import * as managersController from '../controllers/managers.controller';

const router = Router();

router.get('/get-career-history', managersController.getCareerHistory);
router.get('/detail', managersController.getDetail);
router.get('/get-image', managersController.getImage);
router.get('/get-last-matches', managersController.getLastMatches);
router.get('/get-next-matches', managersController.getNextMatches);

// Deprecated Endpoints
router.get('/get-matches', managersController.getMatches); 
router.get('/search', managersController.searchManagers); 

export default router;