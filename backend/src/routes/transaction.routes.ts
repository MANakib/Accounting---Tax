import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as TransactionController from '../controllers/transaction.controller';

const router = Router();

router.use(authenticate);

router.get('/', TransactionController.listTransactions);
router.post('/', TransactionController.createTransaction);
router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

export default router;
