import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as ExportController from '../controllers/export.controller';

const router = Router();

router.use(authenticate);
router.get('/transactions', ExportController.exportTransactionsCSV);
router.get('/summary', ExportController.exportYearlySummaryCSV);

export default router;
