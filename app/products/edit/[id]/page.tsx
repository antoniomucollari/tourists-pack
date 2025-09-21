'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProductById, updateProduct } from '@/lib/productApi';
import Product from '@/domain/Product';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';

// Define form types
type FormValues = {
  name: string;
  subtitle: string;
  price: string;
  // Packet fields
  duration: string;
  isPopular: boolean;
  features: string;
  // Electronics fields
  productSize: string;
  discountPrice: string;
  stockNumber: string;
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = parseInt(params.id, 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [productType, setProductType] = useState<'PACKET' | 'ELECTRONICS'>('PACKET');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // Initialize react-hook-form
  const { control, handleSubmit: handleFormSubmit, setValue, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);

        // Set common fields
        setValue('name', data.name);
        setValue('subtitle', data.subtitle);
        setValue('price', data.price.toString());
        setProductType(data.productType as 'PACKET' | 'ELECTRONICS');

        // Set type-specific fields
        if (data.productType === 'PACKET') {
          setValue('duration', data.duration.toString());
          setValue('isPopular', data.isPopular);
          setValue('features', data.features.join('\n'));
        } else if (data.productType === 'ELECTRONICS') {
          setValue('productSize', data.productSize);
          if (data.discountPrice !== undefined) {
            setValue('discountPrice', data.discountPrice.toString());
          }
          setValue('stockNumber', data.stockNumber.toString());
          setCurrentImageUrl(data.imageUrl);
        }

        setError(null);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(productId)) {
      fetchProduct();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [productId, setValue]);

  const onSubmit = async (formData: FormValues) => {
    try {
      setSubmitting(true);
      setError(null);

      if (productType === 'ELECTRONICS' && !imageFile && !currentImageUrl) {
        setError('Please provide a product image.');
        setSubmitting(false);
        return;
      }

      const productData = {
        id: productId,
        name: formData.name,
        subtitle: formData.subtitle,
        price: parseFloat(formData.price),
        productType,
        ...(productType === 'PACKET' ? {
          duration: parseInt(formData.duration, 10),
          isPopular: formData.isPopular,
          features: formData.features.split('\n').filter(f => f.trim() !== '')
        } : {
          productSize: formData.productSize,
          ...(formData.discountPrice ? { discountPrice: parseFloat(formData.discountPrice) } : {}),
          stockNumber: parseInt(formData.stockNumber, 10),
          imageUrl: currentImageUrl || ''
        })
      };

      // If no new image is provided but there's an existing one, we need to handle this case
      // This is a simplified approach - in a real app, you might need to handle this differently
      const imageToUpload = imageFile || new File([], 'placeholder.jpg');

      await updateProduct(productData, imageToUpload);
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Failed to update product. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        <p className="mt-2 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
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
        <form onSubmit={handleFormSubmit(onSubmit)} className="p-6">
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
                  disabled // Disable changing product type on edit
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
                  disabled // Disable changing product type on edit
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
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <input
                      id="name"
                      type="text"
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                      {...field}
                    />
                  )}
                />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subtitle">
                  Subtitle *
                </label>
                <Controller
                  name="subtitle"
                  control={control}
                  rules={{ required: "Subtitle is required" }}
                  render={({ field }) => (
                    <input
                      id="subtitle"
                      type="text"
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.subtitle ? 'border-red-500' : ''}`}
                      {...field}
                    />
                  )}
                />
                {errors.subtitle && <p className="text-red-500 text-xs italic">{errors.subtitle.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price *
                </label>
                <Controller
                  name="price"
                  control={control}
                  rules={{ 
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" }
                  }}
                  render={({ field }) => (
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.price ? 'border-red-500' : ''}`}
                      {...field}
                    />
                  )}
                />
                {errors.price && <p className="text-red-500 text-xs italic">{errors.price.message}</p>}
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
                    <Controller
                      name="duration"
                      control={control}
                      rules={{ 
                        required: "Duration is required",
                        min: { value: 1, message: "Duration must be at least 1 day" }
                      }}
                      render={({ field }) => (
                        <input
                          id="duration"
                          type="number"
                          min="1"
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.duration ? 'border-red-500' : ''}`}
                          {...field}
                        />
                      )}
                    />
                    {errors.duration && <p className="text-red-500 text-xs italic">{errors.duration.message}</p>}
                  </div>

                  <div className="mb-4">
                    <Controller
                      name="isPopular"
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={value}
                            onChange={onChange}
                            ref={ref}
                          />
                          <span className="ml-2">Is Popular</span>
                        </label>
                      )}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="features">
                      Features * (one per line)
                    </label>
                    <Controller
                      name="features"
                      control={control}
                      rules={{ required: "Features are required" }}
                      render={({ field }) => (
                        <textarea
                          id="features"
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.features ? 'border-red-500' : ''}`}
                          rows={5}
                          placeholder="Enter features, one per line"
                          {...field}
                        />
                      )}
                    />
                    {errors.features && <p className="text-red-500 text-xs italic">{errors.features.message}</p>}
                  </div>
                </>
              )}

              {productType === 'ELECTRONICS' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productSize">
                      Product Size *
                    </label>
                    <Controller
                      name="productSize"
                      control={control}
                      rules={{ required: "Product size is required" }}
                      render={({ field }) => (
                        <input
                          id="productSize"
                          type="text"
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.productSize ? 'border-red-500' : ''}`}
                          {...field}
                        />
                      )}
                    />
                    {errors.productSize && <p className="text-red-500 text-xs italic">{errors.productSize.message}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountPrice">
                      Discount Price (optional)
                    </label>
                    <Controller
                      name="discountPrice"
                      control={control}
                      rules={{ 
                        min: { value: 0, message: "Discount price must be positive" }
                      }}
                      render={({ field }) => (
                        <input
                          id="discountPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.discountPrice ? 'border-red-500' : ''}`}
                          {...field}
                        />
                      )}
                    />
                    {errors.discountPrice && <p className="text-red-500 text-xs italic">{errors.discountPrice.message}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stockNumber">
                      Stock Number *
                    </label>
                    <Controller
                      name="stockNumber"
                      control={control}
                      rules={{ 
                        required: "Stock number is required",
                        min: { value: 0, message: "Stock number must be positive" }
                      }}
                      render={({ field }) => (
                        <input
                          id="stockNumber"
                          type="number"
                          min="0"
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.stockNumber ? 'border-red-500' : ''}`}
                          {...field}
                        />
                      )}
                    />
                    {errors.stockNumber && <p className="text-red-500 text-xs italic">{errors.stockNumber.message}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">
                      Product Image {!currentImageUrl && '*'}
                    </label>
                    {currentImageUrl && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 mb-2">Current image:</p>
                        <img 
                          src={currentImageUrl} 
                          alt={name} 
                          className="max-w-full h-auto rounded-lg border border-gray-200 mb-2"
                          style={{ maxHeight: '100px' }}
                        />
                      </div>
                    )}
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      onChange={handleImageChange}
                      required={!currentImageUrl}
                    />
                    {currentImageUrl && (
                      <p className="text-sm text-gray-600 mt-1">
                        Upload a new image to replace the current one, or leave empty to keep the current image.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
