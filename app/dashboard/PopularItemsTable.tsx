'use client';

import { useEffect, useState } from "react";
import { getMostPopularItems } from "@/lib/api";
import { PopularItem } from "@/domain/types";

export function PopularItemsTable() {
    const [items, setItems] = useState<PopularItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMostPopularItems()
            .then(setItems)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-4 text-gray-500">Loading popular items...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Most Popular Items</h3>
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-4 py-3">Item</th>
                    <th scope="col" className="px-4 py-3 text-right">Orders</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.itemName} className="border-b">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.itemName}</td>
                        <td className="px-4 py-3 text-right">{item.orderCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}