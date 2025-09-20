// app/product/[id]/page.tsx

import React from 'react';
import Product from "@/domain/Product";
import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient'; // We will create this next

// This function fetches a single product by its ID from your Spring Boot API
async function getProductById(id: string): Promise<Product | null> {
    try {
        // Use an absolute URL for server-side fetching
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${id}`, {
            cache: 'no-store', // Use 'no-store' for dynamic data
        });

        if (!response.ok) {
            return null; // Handle cases where the product is not found (404)
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

// This is the main Server Component for the page
export default async function ProductPage({ params }: { params: { id: string } }) {
    // 1. Fetch the data on the server using the ID from the URL
    const product = await getProductById(params.id);

    // 2. If no product is found, show the 404 page
    if (!product) {
        notFound();
    }

    // 3. Render the Client Component and pass the fetched product data as a prop
    return (
        <main className="bg-white">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <ProductDetailsClient product={product} />

            </div>
        </main>
    );
}