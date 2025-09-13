'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import Order from '@/domain/Order';
import Link from "next/link";
import { OrderDetailPageSkeleton } from "@/app/orders/OrderDetailPageSkeleton";

// --- TYPES ---
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params);
    const { id } = unwrappedParams;

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchOrderDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchOrderDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get<{ data: Order }>(`/api/orders/get-by-id/${id}`);
            setOrder(response.data.data);
        } catch (err) {
            setError("Failed to fetch order details. The order may not exist or you may not have permission to view it.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <OrderDetailPageSkeleton />;
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-600">
                <p>{error}</p>
                <Link
                    href="/orders"
                    className="mt-4 inline-block text-white bg-[#e60000] px-6 py-2 rounded-lg hover:bg-red-700"
                >
                    Back to Orders
                </Link>
            </div>
        );
    }

    if (!order) {
        return <div className="p-6 text-center">Order not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Link href="/orders" className="text-red-600 hover:underline mb-6 block">
                &larr; Back to All Orders
            </Link>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                        <p className="text-gray-500">
                            Placed on: {new Date(order.orderDate).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold">{order.totalAmount} ALL</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Order Status</h2>
                        <p>{order.orderStatus}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Payment Status</h2>
                        <p>{order.paymentStatus}</p>
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-2 border-t pt-4">Items</h2>
                    <ul className="space-y-3">
                        {order.orderItems?.map(item => (
                            <li key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.packet.name}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-gray-700">
                                    {item.packet.price * item.quantity} ALL
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
