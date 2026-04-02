export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category_id: string;
  category_name?: string;
  description: string;
  reference_number?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  type?: 'income' | 'expense' | '';
  category_id?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}
