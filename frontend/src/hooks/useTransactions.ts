import { useState, useCallback } from 'react';
import { Transaction, TransactionFilters, Pagination } from '../types';
import { listTransactions } from '../services/transaction.service';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (filters: TransactionFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await listTransactions(filters);
      setTransactions(result.data);
      setPagination(result.pagination);
    } catch {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  return { transactions, pagination, loading, error, load };
}
