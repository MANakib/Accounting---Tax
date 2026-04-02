import { useState, FormEvent } from 'react';
import axios from 'axios';
import { Category } from '../../types';
import { createTransaction, updateTransaction } from '../../services/transaction.service';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DuplicateWarningModal from './DuplicateWarningModal';
import { today } from '../../utils/formatters';

interface Props {
  categories: Category[];
  editTransaction?: {
    id: string;
    date: string;
    type: 'income' | 'expense';
    amount: number;
    category_id: string;
    description: string;
    reference_number?: string;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({
  categories,
  editTransaction,
  onSuccess,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    date: editTransaction?.date ?? today(),
    type: (editTransaction?.type ?? 'expense') as 'income' | 'expense',
    amount: editTransaction?.amount?.toString() ?? '',
    category_id: editTransaction?.category_id ?? '',
    description: editTransaction?.description ?? '',
    reference_number: editTransaction?.reference_number ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (force = false) => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        date: form.date,
        type: form.type,
        amount: parseFloat(form.amount),
        category_id: form.category_id,
        description: form.description.trim(),
        reference_number: form.reference_number || undefined,
        force,
      };

      if (editTransaction) {
        await updateTransaction(editTransaction.id, payload);
      } else {
        await createTransaction(payload);
      }
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409 && err.response?.data?.code === 'DUPLICATE_DETECTED') {
          setShowDuplicateModal(true);
          return;
        }
        setError(err.response?.data?.error || 'Failed to save transaction');
      } else {
        setError('Unexpected error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.category_id) { setError('Please select a category'); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { setError('Amount must be positive'); return; }
    submit(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            required
          />
          <div>
            <label className="form-label">Type</label>
            <select
              value={form.type}
              onChange={(e) => { set('type', e.target.value); set('category_id', ''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <Input
          label="Amount ($)"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
          required
        />

        <div>
          <label className="form-label">Category</label>
          <select
            value={form.category_id}
            onChange={(e) => set('category_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select category...</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Description"
          type="text"
          placeholder="Brief description"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          required
        />

        <Input
          label="Reference # (optional)"
          type="text"
          placeholder="Invoice, check number, etc."
          value={form.reference_number}
          onChange={(e) => set('reference_number', e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {editTransaction ? 'Update' : 'Add Transaction'}
          </Button>
        </div>
      </form>

      <DuplicateWarningModal
        isOpen={showDuplicateModal}
        onConfirm={() => { setShowDuplicateModal(false); submit(true); }}
        onCancel={() => setShowDuplicateModal(false)}
      />
    </>
  );
}
