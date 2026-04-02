import { Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthRequest } from '../types';
import * as CategoryModel from '../models/category.model';
import { createCategorySchema } from '../schemas/transaction.schema';

export const listCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await CategoryModel.findAllForUser(req.userId!);
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, type } = createCategorySchema.parse(req.body);
    const category = await CategoryModel.create(req.userId!, name, type);
    res.status(201).json(category);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    // Unique constraint violation
    if ((err as any).code === '23505') {
      res.status(409).json({ error: 'Category with this name and type already exists' });
      return;
    }
    next(err);
  }
};

export const deleteCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await CategoryModel.remove(req.params.id, req.userId!);
    if (count === 0) {
      res.status(404).json({ error: 'Category not found or is a system category' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    // Foreign key constraint — category in use
    if ((err as any).code === '23503') {
      res.status(409).json({ error: 'Cannot delete category that is in use by transactions' });
      return;
    }
    next(err);
  }
};
