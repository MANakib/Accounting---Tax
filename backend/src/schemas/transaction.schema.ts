import { z } from 'zod';

export const createTransactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  category_id: z.string().uuid('Invalid category ID'),
  description: z.string().min(1).max(500),
  reference_number: z.string().max(100).optional(),
  force: z.boolean().optional(),
});

export const updateTransactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  type: z.enum(['income', 'expense']).optional(),
  amount: z.number().positive().optional(),
  category_id: z.string().uuid().optional(),
  description: z.string().min(1).max(500).optional(),
  reference_number: z.string().max(100).optional(),
});

export const transactionFilterSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  type: z.enum(['income', 'expense']).optional(),
  category_id: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(25),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['income', 'expense']),
});
