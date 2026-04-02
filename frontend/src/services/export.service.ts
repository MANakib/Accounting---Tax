import api from './api';

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadTransactionsCSV = async (): Promise<void> => {
  const response = await api.get('/export/transactions', { responseType: 'blob' });
  downloadBlob(new Blob([response.data]), 'transactions.csv');
};

export const downloadYearlySummaryCSV = async (year: number): Promise<void> => {
  const response = await api.get('/export/summary', {
    params: { year },
    responseType: 'blob',
  });
  downloadBlob(new Blob([response.data]), `summary-${year}.csv`);
};
