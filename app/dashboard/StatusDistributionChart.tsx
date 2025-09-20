'use client';

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getOrderStatusDistribution } from "@/lib/api";
import {OrderColors} from "@/lib/OrderColors";


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

    if (loading) return <PieChartSkeleton/>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={OrderColors[entry.name.replace(/ /g, "_")] || "#CCCCCC"} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={10} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

function PieChartSkeleton() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="flex items-center justify-center h-[300px]">
                <div className="w-48 h-48 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    );
}