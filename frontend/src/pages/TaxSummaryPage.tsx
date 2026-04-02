import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { getTaxSummary } from '../services/tax.service';
import { downloadYearlySummaryCSV } from '../services/export.service';
import { TaxSummary } from '../types';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/ui/Button';

export default function TaxSummaryPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async (y: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await getTaxSummary(y);
      setSummary(data);
    } catch {
      setError('Failed to load tax summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(year); }, [year]);

  const handleExport = async () => {
    setCsvLoading(true);
    try {
      await downloadYearlySummaryCSV(year);
    } finally {
      setCsvLoading(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tax Summary</h1>
          <div className="flex items-center gap-3">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <Button size="sm" variant="secondary" loading={csvLoading} onClick={handleExport}>
              Export CSV
            </Button>
          </div>
        </div>

        {loading && <div className="text-center py-16 text-gray-400">Loading...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>}

        {summary && (
          <div className="space-y-4">
            {/* Schedule C Overview */}
            <div className="card">
              <h2 className="text-base font-semibold text-gray-700 mb-4">
                Schedule C Style Overview — {summary.year}
              </h2>
              <div className="divide-y divide-gray-100">
                <div className="flex justify-between py-3">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(summary.totalIncome)}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm text-gray-600">Total Expenses</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(summary.totalExpense)}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm font-medium text-gray-800">Net Profit / (Loss)</span>
                  <span
                    className={`text-sm font-bold ${
                      summary.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(summary.netProfit)}
                  </span>
                </div>
              </div>
            </div>

            {/* SE Tax Estimate */}
            <div className="card border-amber-200 bg-amber-50">
              <h2 className="text-base font-semibold text-gray-700 mb-3">
                Self-Employment Tax Estimate
              </h2>
              <div className="divide-y divide-amber-100">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Net Profit</span>
                  <span className="text-sm text-gray-800">{formatCurrency(summary.netProfit)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">
                    SE Taxable Net (× 92.35%)
                  </span>
                  <span className="text-sm text-gray-800">{formatCurrency(summary.taxableNet)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-800">
                      Estimated SE Tax (15.3%)
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Covers Social Security (12.4%) + Medicare (2.9%)
                    </p>
                  </div>
                  <span className="text-lg font-bold text-amber-700">
                    {formatCurrency(summary.estimatedSETax)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 border-t border-amber-100 pt-3">
                * This is a simplified estimate. Consult a tax professional for accurate filing.
                Federal income tax brackets and deductions are not included in this calculation.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
