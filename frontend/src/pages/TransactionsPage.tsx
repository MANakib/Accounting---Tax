import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import TransactionList from '../components/transactions/TransactionList';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { deleteTransaction } from '../services/transaction.service';
import { downloadTransactionsCSV } from '../services/export.service';
import { Transaction, TransactionFilters as Filters } from '../types';

export default function TransactionsPage() {
  const { transactions, pagination, loading, error, load } = useTransactions();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<Filters>({});
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);

  const reload = useCallback(() => load(filters), [load, filters]);

  useEffect(() => { reload(); }, [reload]);

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    load(newFilters);
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    reload();
  };

  const handleEdit = (t: Transaction) => {
    setEditTx(t);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditTx(null);
    reload();
  };

  const handleExport = async () => {
    setCsvLoading(true);
    try {
      await downloadTransactionsCSV();
    } finally {
      setCsvLoading(false);
    }
  };

  const changePage = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    load(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" loading={csvLoading} onClick={handleExport}>
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => { setEditTx(null); setShowForm(true); }}
            >
              + Add Transaction
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <TransactionFilters categories={categories} onFilter={handleFilter} />

          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
              <TransactionList
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={pagination.page <= 1}
                  onClick={() => changePage(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => changePage(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditTx(null); }}
        title={editTx ? 'Edit Transaction' : 'Add Transaction'}
        maxWidth="max-w-lg"
      >
        <TransactionForm
          categories={categories}
          editTransaction={editTx}
          onSuccess={handleSuccess}
          onCancel={() => { setShowForm(false); setEditTx(null); }}
        />
      </Modal>
    </div>
  );
}
