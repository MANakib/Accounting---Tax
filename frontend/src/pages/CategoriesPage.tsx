import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import CategoryForm from '../components/categories/CategoryForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useCategories } from '../hooks/useCategories';
import { deleteCategory } from '../services/category.service';
import axios from 'axios';

export default function CategoriesPage() {
  const { categories, loading, reload } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    setDeleteError('');
    try {
      await deleteCategory(id);
      reload();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setDeleteError(err.response?.data?.error || 'Failed to delete');
      }
    }
  };

  const systemCategories = categories.filter((c) => c.user_id === null);
  const userCategories = categories.filter((c) => c.user_id !== null);

  const CategoryTable = ({
    items,
    showDelete,
  }: {
    items: typeof categories;
    showDelete: boolean;
  }) => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
          {showDelete && <th className="px-4 py-3" />}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {items.map((c) => (
          <tr key={c.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm text-gray-800">{c.name}</td>
            <td className="px-4 py-3">
              <Badge label={c.type} variant={c.type} />
            </td>
            {showDelete && (
              <td className="px-4 py-3 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <Button size="sm" onClick={() => setShowForm(true)}>
            + Add Category
          </Button>
        </div>

        {deleteError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {deleteError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-6">
            {userCategories.length > 0 && (
              <div className="card p-0 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-700">My Custom Categories</h2>
                </div>
                <CategoryTable items={userCategories} showDelete={true} />
              </div>
            )}

            <div className="card p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">Default System Categories</h2>
                <p className="text-xs text-gray-400 mt-0.5">Available to all users — cannot be deleted</p>
              </div>
              <CategoryTable items={systemCategories} showDelete={false} />
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add Custom Category"
      >
        <CategoryForm
          onSuccess={() => { setShowForm(false); reload(); }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}
