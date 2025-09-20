'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRecentOrders } from "@/lib/api";
import { Order } from "@/domain/types";
import { Eye } from "lucide-react";
import { OrderColors } from "@/lib/OrderColors";

export function RecentOrdersTable() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRecentOrders()
            .then(data => setOrders(data.content))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3">Order ID</th>
                        <th scope="col" className="px-4 py-3">Date</th>
                        <th scope="col" className="px-4 py-3">Amount</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">View</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                            <td className="px-4 py-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3">${order.totalAmount.toFixed(2)}</td>
                            <td className="px-4 py-3">
                                    <span
                                        className="px-2 py-1 text-xs font-medium rounded-full"
                                        style={{
                                            backgroundColor: OrderColors[order.orderStatus] + "33", // Light translucent background
                                            color: OrderColors[order.orderStatus],
                                        }}
                                    >
                                        {order.orderStatus.replaceAll("_", " ")}
                                    </span>
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    className="cursor-pointer p-1 rounded hover:bg-gray-100"
                                    onClick={() => router.push(`/orders/${order.id}/?dashboard`)}
                                >
                                    <Eye className="h-5 w-5 text-gray-600" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-pulse mb-4">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
}
