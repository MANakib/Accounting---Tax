import { pool } from '../config/db';
import { Transaction, TransactionFilters } from '../types';

export async function findDuplicates(
  userId: string,
  date: string,
  amount: number,
  description: string
): Promise<Array<{ id: string }>> {
  const { rows } = await pool.query(
    `SELECT id FROM transactions
     WHERE user_id = $1
       AND date = $2
       AND amount = $3
       AND description ILIKE $4
       AND deleted_at IS NULL
     LIMIT 1`,
    [userId, date, amount, description]
  );
  return rows;
}

export async function create(data: {
  userId: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  description: string;
  referenceNumber?: string;
}): Promise<Transaction> {
  const { rows } = await pool.query<Transaction>(
    `INSERT INTO transactions
       (user_id, date, type, amount, category_id, description, reference_number)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.userId,
      data.date,
      data.type,
      data.amount,
      data.categoryId,
      data.description,
      data.referenceNumber || null,
    ]
  );
  return rows[0];
}

export async function listTransactions(
  userId: string,
  filters: TransactionFilters
): Promise<Transaction[]> {
  const conditions = ['t.user_id = $1', 't.deleted_at IS NULL'];
  const params: (string | number)[] = [userId];
  let idx = 2;

  if (filters.start_date) {
    conditions.push(`t.date >= $${idx++}`);
    params.push(filters.start_date);
  }
  if (filters.end_date) {
    conditions.push(`t.date <= $${idx++}`);
    params.push(filters.end_date);
  }
  if (filters.type) {
    conditions.push(`t.type = $${idx++}`);
    params.push(filters.type);
  }
  if (filters.category_id) {
    conditions.push(`t.category_id = $${idx++}`);
    params.push(filters.category_id);
  }

  const offset = (filters.page - 1) * filters.limit;
  params.push(filters.limit, offset);

  const { rows } = await pool.query(
    `SELECT t.*, c.name AS category_name
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY t.date DESC, t.created_at DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    params
  );
  return rows;
}

export async function countTransactions(
  userId: string,
  filters: TransactionFilters
): Promise<number> {
  const conditions = ['user_id = $1', 'deleted_at IS NULL'];
  const params: (string | number)[] = [userId];
  let idx = 2;

  if (filters.start_date) { conditions.push(`date >= $${idx++}`); params.push(filters.start_date); }
  if (filters.end_date)   { conditions.push(`date <= $${idx++}`); params.push(filters.end_date); }
  if (filters.type)       { conditions.push(`type = $${idx++}`);  params.push(filters.type); }
  if (filters.category_id){ conditions.push(`category_id = $${idx++}`); params.push(filters.category_id); }

  const { rows } = await pool.query(
    `SELECT COUNT(*) AS total FROM transactions WHERE ${conditions.join(' AND ')}`,
    params
  );
  return parseInt(rows[0].total, 10);
}

export async function findById(id: string, userId: string): Promise<Transaction | null> {
  const { rows } = await pool.query<Transaction>(
    `SELECT t.*, c.name AS category_name
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.id = $1 AND t.user_id = $2 AND t.deleted_at IS NULL`,
    [id, userId]
  );
  return rows[0] || null;
}

export async function update(
  id: string,
  userId: string,
  data: Partial<{
    date: string;
    type: 'income' | 'expense';
    amount: number;
    category_id: string;
    description: string;
    reference_number: string;
  }>
): Promise<Transaction | null> {
  const fields: string[] = [];
  const params: (string | number | null)[] = [];
  let idx = 1;

  if (data.date !== undefined)             { fields.push(`date = $${idx++}`);             params.push(data.date); }
  if (data.type !== undefined)             { fields.push(`type = $${idx++}`);             params.push(data.type); }
  if (data.amount !== undefined)           { fields.push(`amount = $${idx++}`);           params.push(data.amount); }
  if (data.category_id !== undefined)      { fields.push(`category_id = $${idx++}`);      params.push(data.category_id); }
  if (data.description !== undefined)      { fields.push(`description = $${idx++}`);      params.push(data.description); }
  if (data.reference_number !== undefined) { fields.push(`reference_number = $${idx++}`); params.push(data.reference_number); }

  if (fields.length === 0) return findById(id, userId);

  fields.push(`updated_at = NOW()`);
  params.push(id, userId);

  const { rows } = await pool.query<Transaction>(
    `UPDATE transactions
     SET ${fields.join(', ')}
     WHERE id = $${idx} AND user_id = $${idx + 1} AND deleted_at IS NULL
     RETURNING *`,
    params
  );
  return rows[0] || null;
}

export async function softDelete(id: string, userId: string): Promise<number> {
  const { rowCount } = await pool.query(
    `UPDATE transactions SET deleted_at = NOW()
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [id, userId]
  );
  return rowCount ?? 0;
}

export async function getAllForExport(userId: string) {
  const { rows } = await pool.query(
    `SELECT t.date, t.type, t.amount, c.name AS category, t.description,
            t.reference_number, t.created_at
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = $1 AND t.deleted_at IS NULL
     ORDER BY t.date DESC`,
    [userId]
  );
  return rows;
}

export async function getYearlySummary(userId: string, year: number) {
  const { rows } = await pool.query(
    `SELECT
       TO_CHAR(date_trunc('month', date), 'YYYY-MM') AS month,
       COALESCE(SUM(amount) FILTER (WHERE type = 'income'),  0) AS income,
       COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS expense
     FROM transactions
     WHERE user_id = $1
       AND EXTRACT(YEAR FROM date) = $2
       AND deleted_at IS NULL
     GROUP BY date_trunc('month', date)
     ORDER BY 1`,
    [userId, year]
  );
  return rows;
}
