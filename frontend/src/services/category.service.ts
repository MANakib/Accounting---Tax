import api from './api';
import { Category } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categories');
  return data;
};

export const createCategory = async (
  name: string,
  type: 'income' | 'expense'
): Promise<Category> => {
  const { data } = await api.post<Category>('/categories', { name, type });
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
