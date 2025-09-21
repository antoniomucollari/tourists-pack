// productApi.ts
import Product from "@/domain/Product";
import toast from "react-hot-toast";

const BACKEND_URL = "http://localhost:8080";

// --- Generic fetcher for JSON endpoints ---
async function fetcher<T>(endpoint: string, method: string = "GET", body?: any): Promise<T> {
    // 1. Get the token from local storage (or wherever you store it)
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbnRvbmlvLm11Y29sbGFyaUBjaXQuZWR1LmFsIiwiaWF0IjoxNzU4NDU3NzUwLCJleHAiOjE3NjEwNDk3NTB9.YoFtfh50GZYEj2UulgJZNQSAvHaQ8RKZ4dv0PEHquz4";

    const headers: Record<string, string> = {
        "Accept": "application/json",
    };

    // 2. If a token exists, add it to the Authorization header
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers,
        credentials: "include", // Keep if you also use cookies, otherwise can be removed
    };

    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
    }

    // Note: The base URL includes '/api' here
    const response = await fetch(`${BACKEND_URL}/api/products${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(`Fetch failed (${response.status}): ${result?.message || response.statusText}`);
    }

    return result.data as T;
}

async function mutateWithFile<T>(
    endpoint: string,
    method: "POST" | "PUT",
    productData: Product,
    imageFile?: File | null
): Promise<T> {
    const formData = new FormData();

    // Key must exactly match backend: productJson
    formData.append("productJson", JSON.stringify(productData));

    if (imageFile) {
        formData.append("imageFile", imageFile);
    }

    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbnRvbmlvLm11Y29sbGFyaUBjaXQuZWR1LmFsIiwiaWF0IjoxNzU4NDU3NzUwLCJleHAiOjE3NjEwNDk3NTB9.YoFtfh50GZYEj2UulgJZNQSAvHaQ8RKZ4dv0PEHquz4";
    const headers: Record<string, string> = {};

    // 2. If a token exists, add it to the Authorization header
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Corrected the URL to include '/api' to be consistent with the fetcher
    const response = await fetch(`${BACKEND_URL}/api/products${endpoint}`, {
        method,
        headers,
        credentials: "include",
        body: formData, // DO NOT set Content-Type manually for FormData
    });

    const result = await response.json();
    toast.success(`SUCCESS`)
    if (!response.ok) {
        throw new Error(`Fetch failed (${response.status}): ${result?.message || response.statusText}`);
    }


    return result.data as T;
}

// --- Product API functions (No changes needed here) ---
export const getAllProducts = (search?: string, type?: string) => {
    let query = "";
    if (search || type) {
        query = "?";
        if (search) query += `search=${encodeURIComponent(search)}`;
        if (search && type) query += "&";
        if (type) query += `type=${encodeURIComponent(type)}`;
    }
    return fetcher<Product[]>(`/all${query}`);
};

export const getProductById = (id: number) => fetcher<Product>(`/${id}`);

export const createProduct = (product: Product, imageFile?: File | null) =>
    mutateWithFile<Product>("", "POST", product, imageFile);

export const updateProduct = (product: Product, imageFile?: File | null) =>
    mutateWithFile<Product>("", "PUT", product, imageFile);

export const deleteProduct = (id: number) => fetcher<void>(`/${id}`, "DELETE");