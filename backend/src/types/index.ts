import { Request } from 'express';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category_id: string;
  description: string;
  reference_number?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  type: 'income' | 'expense';
}

export interface AuthRequest extends Request {
  userId?: string;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  type?: 'income' | 'expense';
  category_id?: string;
  page: number;
  limit: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  pieData: Array<{ name: string; total: number }>;
  barData: Array<{ month: string; income: number; expense: number }>;
}

export interface TaxSummary {
  year: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  taxableNet: number;
  estimatedSETax: number;
}
