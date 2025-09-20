'use client';

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getOrderStatusDistribution } from "@/lib/api";
import { OrderStatusDistribution } from "@/lib/types";

const COLORS: { [key: string]: string } = {
    INITIALIZED: "#3B82F6", // Blue
    ON_THE_WAY: "#F97316",  // Orange
    DELIVERED: "#22C55E",   // Green
    CANCELLED: "#8B5CF6",   // Violet
    FAILED: "#EF4444",      // Red
};

export function StatusDistributionChart() {
    const [data, setData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrderStatusDistribution()
            .then((dist) => {
                const chartData = Object.entries(dist).map(([name, value]) => ({
                    name: name.replace(/_/g, " "),
                    value,
                }));
                setData(chartData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-80 flex items-center justify-center text-gray-500">Loading chart...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name.replace(/ /g, "_")] || "#CCCCCC"} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={10} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}