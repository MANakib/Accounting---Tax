import api from './api';
import { Transaction, TransactionFilters, Pagination } from '../types';

interface TransactionListResponse {
  data: Transaction[];
  pagination: Pagination;
}

export const listTransactions = async (
  filters: TransactionFilters = {}
): Promise<TransactionListResponse> => {
  const params: Record<string, string | number> = {};
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  if (filters.type) params.type = filters.type;
  if (filters.category_id) params.category_id = filters.category_id;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const { data } = await api.get<TransactionListResponse>('/transactions', { params });
  return data;
};

interface CreateTransactionPayload {
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category_id: string;
  description: string;
  reference_number?: string;
  force?: boolean;
}

export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  const { data } = await api.post<Transaction>('/transactions', payload);
  return data;
};

export const updateTransaction = async (
  id: string,
  payload: Partial<CreateTransactionPayload>
): Promise<Transaction> => {
  const { data } = await api.put<Transaction>(`/transactions/${id}`, payload);
  return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};
