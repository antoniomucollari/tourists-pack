// Centralizes all Product API fetching logic

import Product from "@/domain/Product";

const BACKEND_URL = process.env.NEXT_PUBLIC_APP_URL;

// Generic fetcher function for product endpoints
async function fetcher<T>(endpoint: string, method: string = "GET", body?: any): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const options: RequestInit = {
        method,
        headers,
        credentials: "include", // only matters if same-origin cookies exist
    };

    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BACKEND_URL}/api/products${endpoint}`, options);

    const result = await response.json();
    if (!response.ok) {
        const errorMessage = result?.message || result || response.statusText;
        throw new Error(`Fetch failed (${response.status}): ${errorMessage}`);
    }

    return result.data as T;
}

// Function to handle file uploads for creating products (POST)
async function uploadWithFile<T>(endpoint: string, data: any, imageFile: File): Promise<T> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);

    // Ensure productType is at the top level of the JSON for proper type discrimination
    const productDTO = {
        ...data,
        productType: data.productType
    };

    // Add all other data as a JSON string in a field called 'productDTO'
    formData.append('productDTO', JSON.stringify(productDTO));

    const response = await fetch(`${BACKEND_URL}/api/products${endpoint}`, {
        method: 'POST',
        credentials: "include",
        body: formData
    });

    const result = await response.json();
    if (!response.ok) {
        const errorMessage = result?.message || result || response.statusText;
        throw new Error(`Fetch failed (${response.status}): ${errorMessage}`);
    }

    return result.data as T;
}

// Function to handle file uploads for updating products (PUT)
async function updateWithFile<T>(endpoint: string, data: any, imageFile: File): Promise<T> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);

    // Ensure productType is at the top level of the JSON for proper type discrimination
    const productDTO = {
        ...data,
        productType: data.productType
    };

    // Add all other data as a JSON string in a field called 'productDTO'
    formData.append('productDTO', JSON.stringify(productDTO));

    const response = await fetch(`${BACKEND_URL}/api/products${endpoint}`, {
        method: 'PUT',
        credentials: "include",
        body: formData
    });

    const result = await response.json();
    if (!response.ok) {
        const errorMessage = result?.message || result || response.statusText;
        throw new Error(`Fetch failed (${response.status}): ${errorMessage}`);
    }

    return result.data as T;
}

// --- Product API Functions ---
export const getAllProducts = (search?: string, type?: string) => {
    let queryParams = '';
    if (search || type) {
        queryParams = '?';
        if (search) queryParams += `search=${encodeURIComponent(search)}`;
        if (search && type) queryParams += '&';
        if (type) queryParams += `type=${encodeURIComponent(type)}`;
    }
    return fetcher<Product[]>(`/all${queryParams}`);
};

export const getProductById = (id: number) => fetcher<Product>(`/${id}`);

export const createProduct = (product: Partial<Product>, imageFile: File) => 
    uploadWithFile<Product>('', product, imageFile);

export const updateProduct = (product: Partial<Product>, imageFile: File) => 
    updateWithFile<Product>(`/${product.id}`, product, imageFile);

export const deleteProduct = (id: number) => 
    fetcher<void>(`/${id}`, "DELETE");
