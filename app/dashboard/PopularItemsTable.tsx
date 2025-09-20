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

    if (loading) return <><TableSkeleton/></>;

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
function TableSkeleton() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
