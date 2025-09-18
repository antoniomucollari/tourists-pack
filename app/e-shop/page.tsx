import React from 'react';
import ProductList from "@/components/ProductList";

export default function EShop() {
    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">Our Products</h1>
                <p className="text-center text-gray-500 mb-8">Explore our latest plans and electronics.</p>
                <ProductList />
            </div>
        </main>
    );
}
