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

    if (loading) return (
        <>
            <ChartSkeleton/>
        </>
    );

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

function ChartSkeleton() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full animate-pulse">
            {/* Title Placeholder */}
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            {/* Chart Area Placeholder */}
            <div className="w-full h-[300px] bg-gray-200 rounded-md flex items-end p-4 border border-gray-200">
                <div className="flex-1 h-full flex items-end gap-2 sm:gap-3">
                    <div className="bg-gray-300 w-full rounded-t-md h-1/3"></div>
                    <div className="bg-gray-300 w-full rounded-t-md h-1/2"></div>
                    <div className="bg-gray-300 w-full rounded-t-md h-2/3"></div>
                    <div className="bg-gray-300 w-full rounded-t-md h-1/4"></div>
                    <div className="bg-gray-300 w-full rounded-t-md h-3/4"></div>
                    <div className="bg-gray-300 w-full rounded-t-md h-1/2"></div>
                    <div className="bg-gray-300 w-full rounded-t-md h-2/3"></div>
                    <div className="bg-gray-300 w-full rounded-t-md h-1/2 hidden sm:block"></div>
                    <div className="bg-gray-300 w-full rounded-t-md h-5/6 hidden sm:block"></div>
                </div>
            </div>
        </div>
    );
}