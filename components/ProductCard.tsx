"use client"
import React from 'react';
import Product from "@/domain/Product";
import {useHybridCart} from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
    // If the product is not an electronics item, render nothing.
    if (product.productType !== 'ELECTRONICS') {
        return null;
    }
    const { addItem } = useHybridCart();

    // Helper function to format currency
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ALL' }).format(amount).replace('ALL', 'ALL ');
    };

    return (
        <div className="border rounded-xl shadow-sm flex flex-col transition-all hover:shadow-lg hover:border-red-300 bg-white h-full">
            {/* --- IMAGE --- */}
            <div className="w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                <img
                    src={product.imageUrl || 'https://placehold.co/400x300/e2e8f0/adb5bd?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* --- CARD BODY --- */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 flex-grow">{product.subtitle}</p>

                <div className="mb-4 text-sm text-gray-600 space-y-2">
                    {product.productSize && <p><span className="font-semibold">Size:</span> {product.productSize}</p>}
                    <p className={`${product.stockNumber > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stockNumber > 0 ? `In Stock (${product.stockNumber})` : 'Out of Stock'}
                    </p>
                </div>

                {/* --- PRICE & ACTION --- */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                        {product.discountPrice ? (
                            <div>
                                <p className="text-red-600 font-bold text-xl">{formatPrice(product.discountPrice)}</p>
                                <p className="text-gray-500 line-through text-sm">{formatPrice(product.price)}</p>
                            </div>
                        ) : (
                            <p className="text-gray-800 font-bold text-xl">{formatPrice(product.price)}</p>
                        )}
                    </div>
                    <button onClick={()=> addItem(product)} className="text-white bg-[#e60000] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400" disabled={product.stockNumber === 0}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}