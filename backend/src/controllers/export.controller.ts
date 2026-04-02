import { Response, NextFunction } from 'express';
import { stringify } from 'csv-stringify/sync';
import { AuthRequest } from '../types';
import * as TransactionModel from '../models/transaction.model';

export const exportTransactionsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rows = await TransactionModel.getAllForExport(req.userId!);

    const csv = stringify(rows, {
      header: true,
      columns: {
        date: 'Date',
        type: 'Type',
        amount: 'Amount',
        category: 'Category',
        description: 'Description',
        reference_number: 'Reference #',
        created_at: 'Created At',
      },
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

export const exportYearlySummaryCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    if (isNaN(year) || year < 2000 || year > 2100) {
      res.status(400).json({ error: 'Invalid year' });
      return;
    }

    const rows = await TransactionModel.getYearlySummary(req.userId!, year);

    const csv = stringify(rows, {
      header: true,
      columns: {
        month: 'Month',
        income: 'Total Income',
        expense: 'Total Expense',
      },
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="summary-${year}.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
