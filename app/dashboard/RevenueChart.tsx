'use client';

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getMonthlyRevenue } from "@/lib/api";
import {MonthlyRevenue} from "@/domain/types";

export function RevenueChart() {
    const [data, setData] = useState<MonthlyRevenue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        getMonthlyRevenue(currentYear)
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-80 flex items-center justify-center text-gray-500">Loading chart...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#e60000" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}