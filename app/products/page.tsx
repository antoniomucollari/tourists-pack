'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllProducts, deleteProduct } from '@/lib/productApi';
import Product from '@/domain/Product';
import Link from 'next/link';
import { Trash2, Edit, Eye, AlertTriangle } from 'lucide-react';

// --- Reusable Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="text-red-600 h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
  );
};


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(searchTerm || undefined, selectedType || undefined);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedType]);

  const handleDeleteRequest = (id: number) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete !== null) {
      try {
        await deleteProduct(productToDelete);
        setProducts(products.filter(product => product.id !== productToDelete));
      } catch (err) {
        setError('Failed to delete product. Please try again later.');
        console.error(err);
      } finally {
        setIsModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type);
  };

  return (
      <div className="container mx-auto p-4 md:p-6">
        <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Are you sure?"
            message="This action cannot be undone. This will permanently delete the product."
        />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link
              href="/products/create"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Add New Product
          </Link>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
                className={`px-4 py-2 rounded-lg ${
                    selectedType === null
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleTypeFilter(null)}
            >
              All
            </button>
            <button
                className={`px-4 py-2 rounded-lg ${
                    selectedType === 'PACKET'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleTypeFilter('PACKET')}
            >
              Packet
            </button>
            <button
                className={`px-4 py-2 rounded-lg ${
                    selectedType === 'ELECTRONICS'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleTypeFilter('ELECTRONICS')}
            >
              Electronics
            </button>
          </div>
        </div>

        {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
        ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
        ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No products found. Try adjusting your search or filters.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{product.id}</td>
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.productType === 'PACKET'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                    }`}>
                      {product.productType}
                    </span>
                      </td>
                      <td className="py-3 px-4">ALL {product.price}</td>
                      <td className="py-3 px-4 flex items-center gap-4">
                        <Link
                            href={`/products/${product.id}`}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                            href={`/products/edit/${product.id}`}
                            className="text-gray-500 hover:text-green-600 transition-colors"
                            title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                            onClick={() => handleDeleteRequest(product.id)}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
}
