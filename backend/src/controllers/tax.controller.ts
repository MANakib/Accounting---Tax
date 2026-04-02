import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { pool } from '../config/db';

const SE_TAX_RATE = 0.153;
const SE_DEDUCTION_FACTOR = 0.9235;

export const getTaxSummary = async (
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

    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    const { rows } = await pool.query(
      `SELECT
         COALESCE(SUM(amount) FILTER (WHERE type = 'income'),  0) AS total_income,
         COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS total_expense
       FROM transactions
       WHERE user_id = $1 AND date BETWEEN $2 AND $3 AND deleted_at IS NULL`,
      [req.userId, start, end]
    );

    const totalIncome = parseFloat(rows[0].total_income);
    const totalExpense = parseFloat(rows[0].total_expense);
    const netProfit = totalIncome - totalExpense;

    const taxableNet = netProfit > 0 ? netProfit * SE_DEDUCTION_FACTOR : 0;
    const estimatedSETax = taxableNet * SE_TAX_RATE;

    res.json({
      year,
      totalIncome,
      totalExpense,
      netProfit,
      taxableNet,
      estimatedSETax,
    });
  } catch (err) {
    next(err);
  }
};
