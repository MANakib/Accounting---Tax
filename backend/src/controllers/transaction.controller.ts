import { Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthRequest } from '../types';
import * as TransactionModel from '../models/transaction.model';
import * as CategoryModel from '../models/category.model';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionFilterSchema,
} from '../schemas/transaction.schema';

export const listTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = transactionFilterSchema.parse(req.query);
    const [transactions, total] = await Promise.all([
      TransactionModel.listTransactions(req.userId!, filters),
      TransactionModel.countTransactions(req.userId!, filters),
    ]);
    res.json({
      data: transactions,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Invalid query parameters', details: err.errors });
      return;
    }
    next(err);
  }
};

export const createTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = createTransactionSchema.parse(req.body);

    // Verify category belongs to system or this user
    const validCategory = await CategoryModel.belongsToUserOrSystem(
      data.category_id,
      req.userId!
    );
    if (!validCategory) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    // Duplicate detection — skip if force flag is set
    if (!data.force) {
      const dupes = await TransactionModel.findDuplicates(
        req.userId!,
        data.date,
        data.amount,
        data.description
      );
      if (dupes.length > 0) {
        res.status(409).json({
          code: 'DUPLICATE_DETECTED',
          message: 'A transaction with the same date, amount, and description already exists.',
          existingId: dupes[0].id,
        });
        return;
      }
    }

    const transaction = await TransactionModel.create({
      userId: req.userId!,
      date: data.date,
      type: data.type,
      amount: data.amount,
      categoryId: data.category_id,
      description: data.description,
      referenceNumber: data.reference_number,
    });

    res.status(201).json(transaction);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    next(err);
  }
};

export const updateTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = updateTransactionSchema.parse(req.body);

    // Verify category if provided
    if (data.category_id) {
      const validCategory = await CategoryModel.belongsToUserOrSystem(
        data.category_id,
        req.userId!
      );
      if (!validCategory) {
        res.status(400).json({ error: 'Invalid category' });
        return;
      }
    }

    const transaction = await TransactionModel.update(req.params.id, req.userId!, data);
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json(transaction);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    next(err);
  }
};

export const deleteTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const count = await TransactionModel.softDelete(req.params.id, req.userId!);
    if (count === 0) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
