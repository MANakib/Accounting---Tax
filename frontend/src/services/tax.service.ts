import api from './api';
import { TaxSummary } from '../types';

export const getTaxSummary = async (year?: number): Promise<TaxSummary> => {
  const { data } = await api.get<TaxSummary>('/tax', {
    params: year ? { year } : {},
  });
  return data;
};
