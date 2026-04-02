import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import SummaryCards from '../components/dashboard/SummaryCards';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import IncomeExpenseBarChart from '../components/dashboard/IncomeExpenseBarChart';
import { getDashboardStats } from '../services/dashboard.service';
import { DashboardStats } from '../types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {loading && (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {stats && (
          <div className="space-y-6">
            <SummaryCards
              totalIncome={stats.totalIncome}
              totalExpense={stats.totalExpense}
              netProfit={stats.netProfit}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpensePieChart data={stats.pieData} />
              <IncomeExpenseBarChart data={stats.barData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
