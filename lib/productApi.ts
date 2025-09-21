// productApi.ts
import Product from "@/domain/Product";

const BACKEND_URL = "http://localhost:8080";

// --- Generic fetcher for JSON endpoints ---
async function fetcher<T>(endpoint: string, method: string = "GET", body?: any): Promise<T> {
    const headers: Record<string, string> = {
        "Accept": "application/json",
    };

    const options: RequestInit = {
        method,
        headers,
        credentials: "include",
    };

    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BACKEND_URL}/products${endpoint}`, options);
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

    const response = await fetch(`${BACKEND_URL}/products${endpoint}`, {
        method,
        credentials: "include",
        body: formData, // DO NOT set Content-Type manually
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(`Fetch failed (${response.status}): ${result?.message || response.statusText}`);
    }

    return result.data as T;
}

// --- Product API functions ---
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
    mutateWithFile<Product>(`/${product.id}`, "PUT", product, imageFile);

export const deleteProduct = (id: number) => fetcher<void>(`/${id}`, "DELETE");
