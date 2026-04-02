import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { pool } from '../config/db';

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId!;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const startOfMonth = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const endOfMonth = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    // Monthly income/expense totals
    const { rows: summary } = await pool.query(
      `SELECT
         COALESCE(SUM(amount) FILTER (WHERE type = 'income'),  0) AS total_income,
         COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS total_expense
       FROM transactions
       WHERE user_id = $1 AND date BETWEEN $2 AND $3 AND deleted_at IS NULL`,
      [userId, startOfMonth, endOfMonth]
    );

    // Expense breakdown by category for pie chart (current month)
    const { rows: pieData } = await pool.query(
      `SELECT c.name, COALESCE(SUM(t.amount), 0) AS total
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = $1 AND t.type = 'expense'
         AND t.date BETWEEN $2 AND $3 AND t.deleted_at IS NULL
       GROUP BY c.name
       ORDER BY total DESC`,
      [userId, startOfMonth, endOfMonth]
    );

    // Last 6 months income vs expense bar chart
    const { rows: barData } = await pool.query(
      `SELECT
         TO_CHAR(date_trunc('month', date), 'Mon YYYY') AS month,
         COALESCE(SUM(amount) FILTER (WHERE type = 'income'),  0) AS income,
         COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS expense
       FROM transactions
       WHERE user_id = $1
         AND date >= date_trunc('month', NOW()) - INTERVAL '5 months'
         AND deleted_at IS NULL
       GROUP BY date_trunc('month', date)
       ORDER BY date_trunc('month', date)`,
      [userId]
    );

    const totalIncome = parseFloat(summary[0].total_income);
    const totalExpense = parseFloat(summary[0].total_expense);

    res.json({
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      pieData: pieData.map((r) => ({ name: r.name, total: parseFloat(r.total) })),
      barData: barData.map((r) => ({
        month: r.month,
        income: parseFloat(r.income),
        expense: parseFloat(r.expense),
      })),
    });
  } catch (err) {
    next(err);
  }
};
