import { formatCurrency } from '../../utils/formatters';

interface Props {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export default function SummaryCards({ totalIncome, totalExpense, netProfit }: Props) {
  const cards = [
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: '↑',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpense),
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '↓',
    },
    {
      label: 'Net Profit',
      value: formatCurrency(netProfit),
      color: netProfit >= 0 ? 'text-blue-600' : 'text-red-600',
      bg: netProfit >= 0 ? 'bg-blue-50' : 'bg-red-50',
      border: netProfit >= 0 ? 'border-blue-200' : 'border-red-200',
      icon: '=',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, color, bg, border, icon }) => (
        <div key={label} className={`card ${bg} border ${border}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{label}</p>
            <span className={`text-xl font-bold ${color}`}>{icon}</span>
          </div>
          <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-400 mt-1">Current month</p>
        </div>
      ))}
    </div>
  );
}
