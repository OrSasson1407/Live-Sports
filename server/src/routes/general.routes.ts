import { Router } from 'express';
import * as generalController from '../controllers/general.controller';

const router = Router();

router.get('/search', generalController.search);
router.get('/categories/list', generalController.getCategoriesList);
router.get('/categories/list-live', generalController.getCategoriesListLive);
router.get('/sports/list', generalController.getSportsList);

// Deprecated
router.get('/auto-complete', generalController.getAutoComplete);

export default router;