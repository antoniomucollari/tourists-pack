'use client';

import { useEffect, useState } from "react";
import { getRecentOrders } from "@/lib/api";
import {Order} from "@/domain/types";

export function RecentOrdersTable() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRecentOrders()
            .then(data => setOrders(data.content))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-4 text-gray-500">Loading recent orders...</div>;

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
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                            <td className="px-4 py-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3">${order.totalAmount.toFixed(2)}</td>
                            <td className="px-4 py-3">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        {order.orderStatus}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}