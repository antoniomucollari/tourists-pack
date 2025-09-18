"use client"
import React from 'react';
import ProductCard from './ProductCard';
import Product from "@/domain/Product";
import {useQuery} from "@tanstack/react-query";

// The fetching function remains the same, but it's important that it throws an error on failure.
async function getProducts() {
    const response = await fetch(`api/products/all?type=ELECTRONICS`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data || [];
}

export default function ProductList() {
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products'], // A unique key for this query
        queryFn: getProducts,    // The function that fetches the data
    });

    // Handle the loading state, provided by useQuery
    if (isLoading) {
        return <p className="text-center text-gray-500 mt-10">Loading products...</p>;
    }

    // Handle the error state, also from useQuery
    if (isError) {
        return <p className="text-center text-red-500 mt-10">Error fetching products.</p>;
    }

    // If data is available and not empty
    if (!products || products.length === 0) {
        return <p className="text-center text-gray-500 mt-10">No products found.</p>;
    }

    // Render the product list with the fetched data
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}