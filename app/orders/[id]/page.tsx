'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import Order from '@/domain/Order';
import Link from "next/link";
import { OrderDetailPageSkeleton } from "@/app/orders/OrderDetailPageSkeleton";
import { useSearchParams } from 'next/navigation';

// Import color maps
import { OrderColors, PaymentColors } from "@/lib/OrderColors";

// --- COMPONENT ---
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params);
    const { id } = unwrappedParams;

    const searchParams = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cameFromDashboard = searchParams.has('dashboard');
    const backHref = cameFromDashboard ? '/dashboard' : '/orders';
    const backText = cameFromDashboard ? 'Back to Dashboard' : 'Back to All Orders';

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
                    href={backHref}
                    className="mt-4 inline-block text-white bg-[#e60000] px-6 py-2 rounded-lg hover:bg-red-700"
                >
                    {backText}
                </Link>
            </div>
        );
    }

    if (!order) {
        return <div className="p-6 text-center">Order not found.</div>;
    }

    // --- COLORS ---
    const orderColor = OrderColors[order.orderStatus as keyof typeof OrderColors] || "#6B7280";
    const paymentColor = PaymentColors[order.paymentStatus as keyof typeof PaymentColors] || "#6B7280";

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Link href={backHref} className="text-red-600 hover:underline mb-6 block">
                &larr; {backText}
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
                        <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: `${orderColor}20`, color: orderColor }}
                        >
                            {order.orderStatus}
                        </span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Payment Status</h2>
                        <span
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: `${paymentColor}20`, color: paymentColor }}
                        >
                            {order.paymentStatus}
                        </span>
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-2 border-t pt-4">Items</h2>
                    <ul className="space-y-3">
                        {order.orderItems?.map(item => (
                            <li key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-gray-700">
                                    {item.product.price * item.quantity} ALL
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
