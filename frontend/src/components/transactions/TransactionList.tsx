import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No transactions found</p>
        <p className="text-sm mt-1">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Date', 'Type', 'Category', 'Description', 'Amount', 'Ref #', ''].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                {formatDate(t.date)}
              </td>
              <td className="px-4 py-3">
                <Badge label={t.type} variant={t.type} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{t.category_name}</td>
              <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                {t.description}
              </td>
              <td
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {t.reference_number || '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(t)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Delete this transaction?')) onDelete(t.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
