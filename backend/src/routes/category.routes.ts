import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as CategoryController from '../controllers/category.controller';

const router = Router();

router.use(authenticate);

router.get('/', CategoryController.listCategories);
router.post('/', CategoryController.createCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
