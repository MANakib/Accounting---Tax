import { useState } from 'react';
import { Category, type TransactionFilters } from '../../types';
import Button from '../ui/Button';

interface Props {
  categories: Category[];
  onFilter: (filters: TransactionFilters) => void;
}

export default function TransactionFilters({ categories, onFilter }: Props) {
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [type, setType] = useState<'income' | 'expense' | ''>('');
  const [category_id, setCategoryId] = useState('');

  const apply = () => {
    const filters: TransactionFilters = {};
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;
    if (type) filters.type = type;
    if (category_id) filters.category_id = category_id;
    onFilter(filters);
  };

  const reset = () => {
    setStartDate('');
    setEndDate('');
    setType('');
    setCategoryId('');
    onFilter({});
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="form-label">Start Date</label>
          <input
            type="date"
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="form-label">End Date</label>
          <input
            type="date"
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="form-label">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense' | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="form-label">Category</label>
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button size="sm" onClick={apply}>Apply Filters</Button>
        <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}
