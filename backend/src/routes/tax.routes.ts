import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getTaxSummary } from '../controllers/tax.controller';

const router = Router();

router.use(authenticate);
router.get('/', getTaxSummary);

export default router;
