// Centralizes all API fetching logic

import { MonthlyRevenue, OrderStatusDistribution, PopularItem } from "@/domain/types";
import { Property } from "csstype";
import Order = Property.Order;

const BACKEND_URL = process.env.NEXT_PUBLIC_APP_URL;

async function fetcher<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const response = await fetch(`${BACKEND_URL}/api/orders${endpoint}`, {
        method: "GET",
        headers,
        credentials: "include", // only matters if same-origin cookies exist
    });

    const result = await response.json();
    if (!response.ok) {
        const errorMessage = result?.message || result || response.statusText;
        throw new Error(`Fetch failed (${response.status}): ${errorMessage}`);
    }

    return result.data as T;
}

// --- API Functions ---
export const getTotalOrders = () => fetcher<number>("/stats/total-orders");
export const getTotalRevenue = () => fetcher<number>("/stats/total-revenue");
export const getUniqueCustomers = () => fetcher<number>("/unique-customers");
export const getMonthlyRevenue = (year: number) => fetcher<MonthlyRevenue[]>(`/stats/monthly-revenue?year=${year}`);
export const getOrderStatusDistribution = () => fetcher<OrderStatusDistribution>("/stats/status-distribution");
export const getRecentOrders = () => fetcher<{ content: Order[] }>(`/all?page=0&size=5&sort=orderDate,desc`);
export const getMostPopularItems = () => fetcher<PopularItem[]>("/stats/most-popular-items?limit=5");
