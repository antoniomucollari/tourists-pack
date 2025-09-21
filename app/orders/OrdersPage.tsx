'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import OrderDTO from "@/domain/OrderDTO";
import { OrderStatus, PaymentStatus } from "@/domain/OrderStatus";
import OrderList from "@/app/orders/OrderList";
import { SkeletonOrderItem } from "@/app/orders/OrderItemSkeleton";

type OrdersPageProps = {
    isAdmin?: boolean;
    searchable?: boolean;
};

const orderStatusOptions: OrderStatus[] = [
    "INITIALIZED",
    "CONFIRMED",
    "DELIVERED",
    "ON_THE_WAY",
    "CANCELLED",
    "FAILED",
];

const paymentStatusOptions: PaymentStatus[] = [
    "PENDING", "COMPLETED", "FAILED", "REFUNDED", "EXPIRED", "REJECTED", "CANCELED"
];

export default function OrdersPage({ isAdmin = false, searchable = false }: OrdersPageProps) {
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchId, setSearchId] = useState("");

    const [orderFilter, setOrderFilter] = useState<"ALL" | OrderStatus>(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const status = params.get("orderStatus") as OrderStatus;
            return orderStatusOptions.includes(status) ? status : "ALL";
        }
        return "ALL";
    });

    const [paymentFilter, setPaymentFilter] = useState<"ALL" | PaymentStatus>(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const status = params.get("paymentStatus") as PaymentStatus;
            return paymentStatusOptions.includes(status) ? status : "ALL";
        }
        return "ALL";
    });

    // --- Fetch orders ---
    useEffect(() => {
        if (!searchId) {
            fetchOrders();
        }
    }, [orderFilter, paymentFilter]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            let apiUrl = isAdmin ? "/api/orders/all" : "/api/orders/me";

            const params = new URLSearchParams();
            if (orderFilter !== "ALL") params.set("orderStatus", orderFilter);
            if (paymentFilter !== "ALL") params.set("paymentStatus", paymentFilter);

            if ([...params].length) apiUrl += `?${params.toString()}`;

            const response = await axios.get<{ data: any }>(apiUrl);
            const data = isAdmin ? response.data.data.content || [] : response.data.data || [];
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrderById = async (id: string) => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await axios.get<{ data: OrderDTO }>(`/api/orders/get-by-id/${id}`);
            setOrders(response.data.data ? [response.data.data] : []);
        } catch (err) {
            console.error("Failed to fetch order by id:", err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (orderFilter !== "ALL") params.set("orderStatus", orderFilter);
        if (paymentFilter !== "ALL") params.set("paymentStatus", paymentFilter);
        const query = params.toString() ? `?${params.toString()}` : "";
        window.history.pushState({}, "", `${window.location.pathname}${query}`);
    }, [orderFilter, paymentFilter]);

    const handleOrderFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrderFilter(e.target.value as "ALL" | OrderStatus);
    };

    const handlePaymentFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaymentFilter(e.target.value as "ALL" | PaymentStatus);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId) {
            // ✅ Reset filters to ALL
            setOrderFilter("ALL");
            setPaymentFilter("ALL");
            fetchOrderById(searchId);
        } else {
            fetchOrders();
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <ul className="space-y-4">
                    {[1, 2, 3].map(i => <SkeletonOrderItem key={i} />)}
                </ul>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">{isAdmin ? "All Orders" : "My Orders"}</h1>

            <div className="mb-6 flex flex-wrap gap-4 items-center">
                {/* Order Status Filter */}
                <div>
                    <label htmlFor="orderStatus" className="font-medium mr-2">Order Status:</label>
                    <select
                        id="orderStatus"
                        value={orderFilter}
                        onChange={handleOrderFilterChange}
                        className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="ALL">ALL</option>
                        {orderStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                    <label htmlFor="paymentStatus" className="font-medium mr-2">Payment Status:</label>
                    <select
                        id="paymentStatus"
                        value={paymentFilter}
                        onChange={handlePaymentFilterChange}
                        className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="ALL">ALL</option>
                        {paymentStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* Search by ID */}
                {searchable && (
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search by Order ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="border rounded-lg p-2"
                        />
                        <button
                            type="submit"
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Search
                        </button>
                    </form>
                )}
            </div>

            {!orders.length ? (
                <div className="p-6 text-center text-gray-500 border rounded-lg">
                    {searchId
                        ? <p>No order found with ID {searchId}.</p>
                        : orderFilter === "ALL" && paymentFilter === "ALL"
                            ? <p>No orders found.</p>
                            : <p>No orders found with the selected filters.</p>
                    }
                </div>
            ) : (
                <OrderList orders={orders} />
            )}
        </div>
    );
}
