"use client";

import React from "react";
import {useAuth} from "@/context/AuthContext";

// NOTE: The following are placeholders for your actual types and hooks.
// Ensure the paths are correct in your project structure.
type Product = {
  id: string | number;
  name: string;
  subtitle?: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number;
  productSize?: string;
  stockNumber: number;
  productType?: string; // Added for addItem
};

const useHybridCart = () => ({
  addItem: (product: Product) => {
    console.log("Added to cart:", product.name);
  },
});


export default function ProductDetailsClient({product}: {
  product: Product;
}) {
  const { addItem } = useHybridCart();
  const isAdmin = useAuth();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ALL",
    })
        .format(amount)
        .replace("ALL", "ALL ");
  };

  return (
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-10">
        {/* Image gallery */}
        <div className="w-full lg:w-5/6 mx-auto">
          <img
              src={product.imageUrl || "https://placehold.co/600x600"}
              alt={product.name}
              className="w-full h-full object-cover object-center rounded-lg shadow-md"
          />
        </div>

        {/* Product info */}
        <div className="mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>
          <p className="text-xl mt-2 text-gray-700">{product.subtitle}</p>

          {/* Price */}
          <div className="mt-4">
            {product.discountPrice ? (
                <div className="flex items-baseline gap-x-2">
                  <p className="text-3xl tracking-tight text-red-600">
                    {formatPrice(product.discountPrice)}
                  </p>
                  <p className="text-xl tracking-tight text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </p>
                </div>
            ) : (
                <p className="text-3xl tracking-tight text-gray-900">
                  {formatPrice(product.price)}
                </p>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="text-base text-gray-700 space-y-2">
              {product.productSize && (
                  <p>
                    <span className="font-medium text-gray-900">Size:</span>{" "}
                    {product.productSize}
                  </p>
              )}
              <p>
                <span className="font-medium text-gray-900">Availability:</span>
                <span
                    className={
                      product.stockNumber > 0
                          ? "text-green-600 ml-2"
                          : "text-red-600 ml-2"
                    }
                >
                {product.stockNumber > 0
                    ? `In Stock (${product.stockNumber})`
                    : "Out of Stock"}
              </span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <button
              onClick={() => addItem(product)}
              disabled={product.stockNumber === 0 || isAdmin}
              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-[#e60000] px-8 py-3 text-base font-medium text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            Add to Cart
          </button>
        </div>
      </div>
  );
}

