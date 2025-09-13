'use client';

import { useEffect, useState } from "react";
import axios from "axios";

import OrderDTO from "@/domain/OrderDTO";
import { OrderStatus } from "@/domain/OrderStatus";
import OrderList from "@/app/orders/OrderList";

const useAuth = () => {
    return { isAuthenticated: true, isCustomer: true, isLoading: false };
};
// ------------------
const statusOptions: OrderStatus[] = ["PENDING", "COMPLETED", "CANCELLED", "EXPIRED"];
// --- RE-INTEGRATED COMPONENTS ---
// To fix the resolution error, the separated components are now included directly in this file.

const SkeletonOrderItem = () => (
    <li className="rounded-xl p-4 shadow-sm animate-pulse">
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2 flex-grow"><div className="h-5 bg-gray-200 rounded w-3/5"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div><div className="h-4 bg-gray-200 rounded w-1/4 mt-1"></div></div>
            <div className="flex flex-col items-start md:items-end gap-2"><div className="h-6 bg-gray-200 rounded-full w-24"></div><div className="h-6 bg-gray-200 rounded-full w-28"></div><div className="h-8 bg-gray-200 rounded-lg w-20 mt-2"></div></div>
        </div>
    </li>
);

// --- MAIN PAGE COMPONENT ---
export default function Page() {
    const { isAuthenticated, isCustomer, isLoading: isAuthLoading } = useAuth();
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filterStatus, setFilterStatus] = useState<"ALL" | OrderStatus>(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const statusFromUrl = searchParams.get('status') as OrderStatus;
            return statusOptions.includes(statusFromUrl) ? statusFromUrl : "ALL";
        }
        return "ALL";
    });

    useEffect(() => {
        if (!isAuthLoading && isAuthenticated && isCustomer) {
            fetchOrders(filterStatus);
        }
    }, [isAuthLoading, isAuthenticated, isCustomer, filterStatus]);

    const fetchOrders = async (status: "ALL" | OrderStatus) => {
        setIsLoading(true);
        let apiUrl = "/api/orders/me"; // Using relative path for proxy
        if (status !== "ALL") {
            apiUrl += `?status=${status}`;
        }
        try {
            const response = await axios.get<{ data: OrderDTO[] }>(apiUrl);
            setOrders(response.data.data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as "ALL" | OrderStatus;
        setFilterStatus(newStatus);

        const currentParams = new URLSearchParams(window.location.search);
        if (newStatus === "ALL") {
            currentParams.delete('status');
        } else {
            currentParams.set('status', newStatus);
        }
        const search = currentParams.toString();
        const query = search ? `?${search}` : '';
        // Use browser history API to update URL without full reload
        window.history.pushState({ path: `${window.location.pathname}${query}` }, '', `${window.location.pathname}${query}`);
    };

    const pageIsLoading = isAuthLoading || isLoading;

    if (pageIsLoading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
                <div className="mb-6 h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <ul className="space-y-4">{[1, 2, 3].map((i) => <SkeletonOrderItem key={i} />)}</ul>
            </div>
        );
    }

    if (!isAuthenticated || !isCustomer ) {
        return (
            <div className="p-6 text-center text-gray-500"><h1 className="text-xl font-semibold mb-2">Access Denied</h1><p>Please log in as a customer to view your orders.</p><a href="/login" className="mt-4 inline-block text-white bg-[#e60000] px-6 py-2 rounded-lg hover:bg-red-700">Go to Login</a></div>
        );
    }

    if (!pageIsLoading && !orders.length) {
        if (filterStatus === "ALL") {
            return (
                <div className="p-6 text-center text-gray-500"><h1 className="text-2xl font-semibold mb-6">My Orders</h1><p>You have no orders yet.</p><a href="/shop" className="mt-4 inline-block text-white bg-[#e60000] px-6 py-2 rounded-lg hover:bg-red-700">Start Shopping</a></div>
            );
        } else {
            return (
                <div className="max-w-6xl mx-auto p-6">
                    <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
                    <div className="mb-6 flex items-center gap-4">
                        <label htmlFor="status" className="font-medium">Filter by Status:</label>
                        <select id="status" value={filterStatus} onChange={handleFilterChange} className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                            <option value="ALL">ALL</option>{statusOptions.map((status) =>
                            <option key={status} value={status}>{status}</option>)}</select></div>
                    <div className="p-6 text-center text-gray-500 border rounded-lg"><p>No orders found with the status {filterStatus}.</p>
                    </div></div>
            );
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
            <div className="mb-6 flex items-center gap-4">
                <label htmlFor="status" className="font-medium">Filter by Status:</label>
                <select id="status" value={filterStatus} onChange={handleFilterChange} className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option value="ALL">ALL</option>
                    {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
            </div>
            <OrderList orders={orders} />
        </div>
    );
}

