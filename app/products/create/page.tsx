'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/lib/productApi';
import Link from 'next/link';

export default function CreateProductPage() {
  const router = useRouter();
  const [productType, setProductType] = useState<'PACKET' | 'ELECTRONICS'>('PACKET');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Common fields
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  
  // Packet specific fields
  const [duration, setDuration] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [features, setFeatures] = useState('');
  
  // Electronics specific fields
  const [productSize, setProductSize] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stockNumber, setStockNumber] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !subtitle || !price) {
      setError('Please fill in all required fields.');
      return;
    }

    if (productType === 'PACKET' && (!duration || !features)) {
      setError('Please fill in all required packet fields.');
      return;
    }

    if (productType === 'ELECTRONICS' && (!productSize || !stockNumber || !imageFile)) {
      setError('Please fill in all required electronics fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const productData = {
        name,
        subtitle,
        price: parseFloat(price),
        productType,
        ...(productType === 'PACKET' ? {
          duration: parseInt(duration, 10),
          isPopular,
          features: features.split('\n').filter(f => f.trim() !== '')
        } : {
          productSize,
          ...(discountPrice ? { discountPrice: parseFloat(discountPrice) } : {}),
          stockNumber: parseInt(stockNumber, 10)
        })
      };

      if (!imageFile && productType === 'ELECTRONICS') {
        throw new Error('Image file is required for electronics products');
      }

      await createProduct(productData, imageFile!);
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <Link
          href="/products"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Products
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Type
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="productType"
                  value="PACKET"
                  checked={productType === 'PACKET'}
                  onChange={() => setProductType('PACKET')}
                />
                <span className="ml-2">Packet</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="productType"
                  value="ELECTRONICS"
                  checked={productType === 'ELECTRONICS'}
                  onChange={() => setProductType('ELECTRONICS')}
                />
                <span className="ml-2">Electronics</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Fields */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subtitle">
                  Subtitle *
                </label>
                <input
                  id="subtitle"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Type-specific Fields */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {productType === 'PACKET' ? 'Packet Details' : 'Electronics Details'}
              </h2>
              
              {productType === 'PACKET' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                      Duration (days) *
                    </label>
                    <input
                      id="duration"
                      type="number"
                      min="1"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={isPopular}
                        onChange={(e) => setIsPopular(e.target.checked)}
                      />
                      <span className="ml-2">Is Popular</span>
                    </label>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="features">
                      Features * (one per line)
                    </label>
                    <textarea
                      id="features"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows={5}
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      required
                      placeholder="Enter features, one per line"
                    />
                  </div>
                </>
              )}
              
              {productType === 'ELECTRONICS' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productSize">
                      Product Size *
                    </label>
                    <input
                      id="productSize"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={productSize}
                      onChange={(e) => setProductSize(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountPrice">
                      Discount Price (optional)
                    </label>
                    <input
                      id="discountPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stockNumber">
                      Stock Number *
                    </label>
                    <input
                      id="stockNumber"
                      type="number"
                      min="0"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={stockNumber}
                      onChange={(e) => setStockNumber(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">
                      Product Image *
                    </label>
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}