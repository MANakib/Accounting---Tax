import { useState, FormEvent } from 'react';
import axios from 'axios';
import { createCategory } from '../../services/category.service';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createCategory(name.trim(), type);
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to create category');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        type="text"
        placeholder="e.g. Consulting"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div>
        <label className="form-label">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Add Category</Button>
      </div>
    </form>
  );
}
