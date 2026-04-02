import { pool } from '../config/db';
import { Category } from '../types';

export async function findAllForUser(userId: string): Promise<Category[]> {
  const { rows } = await pool.query<Category>(
    `SELECT * FROM categories
     WHERE user_id IS NULL OR user_id = $1
     ORDER BY type, name`,
    [userId]
  );
  return rows;
}

export async function findById(id: string): Promise<Category | null> {
  const { rows } = await pool.query<Category>(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function belongsToUserOrSystem(
  categoryId: string,
  userId: string
): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT id FROM categories
     WHERE id = $1 AND (user_id IS NULL OR user_id = $2)`,
    [categoryId, userId]
  );
  return rows.length > 0;
}

export async function create(
  userId: string,
  name: string,
  type: 'income' | 'expense'
): Promise<Category> {
  const { rows } = await pool.query<Category>(
    `INSERT INTO categories (user_id, name, type)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, name, type]
  );
  return rows[0];
}

export async function remove(id: string, userId: string): Promise<number> {
  const { rowCount } = await pool.query(
    'DELETE FROM categories WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rowCount ?? 0;
}
