"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductById, deleteProduct } from "@/lib/productApi";
import Product from "@/domain/Product";
import Link from "next/link";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useToast } from "@/context/ToastContext";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const productId = parseInt(params.id, 10);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError("Failed to load product details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(productId)) {
      fetchProduct();
    } else {
      setError("Invalid product ID");
      setLoading(false);
    }
  }, [productId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      showSuccess("Product Deleted", "Product has been deleted successfully.");
      router.push("/products");
    } catch (err) {
      showError(
        "Delete Failed",
        "Failed to delete product. Please try again later."
      );
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
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

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/products/edit/${product.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
          <button onClick={() => showError("Error!", "Something went wrong.")}>click me</button>
          <Link
            href="/products"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Products
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Common product details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">ID:</span>
                  <span className="ml-2">{product.id}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="ml-2">{product.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Subtitle:</span>
                  <span className="ml-2">{product.subtitle}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Price:</span>
                  <span className="ml-2">${product.price}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Type:</span>
                  <span className="ml-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.productType === "PACKET"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.productType}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right column - Type-specific details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {product.productType === "PACKET"
                  ? "Packet Details"
                  : "Electronics Details"}
              </h2>

              {product.productType === "PACKET" && (
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <span className="ml-2">{product.duration} days</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Popular:</span>
                    <span className="ml-2">
                      {product.isPopular ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Features:</span>
                    <ul className="list-disc ml-6 mt-2">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {product.productType === "ELECTRONICS" && (
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 font-medium">
                      Product Size:
                    </span>
                    <span className="ml-2">{product.productSize}</span>
                  </div>
                  {product.discountPrice !== undefined && (
                    <div>
                      <span className="text-gray-600 font-medium">
                        Discount Price:
                      </span>
                      <span className="ml-2">${product.discountPrice}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 font-medium">
                      Stock Number:
                    </span>
                    <span className="ml-2">{product.stockNumber}</span>
                  </div>
                  {product.imageUrl && (
                    <div className="mt-4">
                      <span className="text-gray-600 font-medium block mb-2">
                        Product Image:
                      </span>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
