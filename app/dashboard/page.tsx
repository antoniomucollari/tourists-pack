"use client";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/CircularLoader";
import { useState, useEffect } from "react";
import { getTotalOrders, getTotalRevenue, getUniqueCustomers } from "@/lib/api";
import { ShoppingCart, DollarSign, Users, RefreshCw, ArrowLeft } from "lucide-react";
import { StatCard } from "./StatCard";
import { RevenueChart } from "./RevenueChart";
import { StatusDistributionChart } from "@/app/dashboard/StatusDistributionChart";
import { RecentOrdersTable } from "@/app/dashboard/RecentOrdersTable";
import { PopularItemsTable } from "@/app/dashboard/PopularItemsTable";

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [uniqueCustomers, setUniqueCustomers] = useState<number>(0);

    useEffect(() => {
        let mounted = true;

        async function fetchStats() {
            setLoading(true);
            setError(null);
            try {
                const [orders, revenue, customers] = await Promise.all([
                    getTotalOrders(),
                    getTotalRevenue(),
                    getUniqueCustomers(),
                ]);
                if (!mounted) return;

                setTotalOrders(orders);
                setTotalRevenue(revenue);
                setUniqueCustomers(customers);
                setLoading(false);
            } catch (err: any) {
                if (!mounted) return;
                setError(err.message || "Failed to fetch stats");
                setLoading(false);
            }
        }

        fetchStats();

        return () => {
            mounted = false;
        };
    }, [refreshCounter]);

    if (loading) return <CustomLoader />;
    if (error) return <div className="text-center text-red-500 col-span-3">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div className="flex gap-2 items-center">
                    <button
                        className="cursor-pointer bg-gray-300 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-400"
                        onClick={() => router.push("/")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                </div>
                <button
                    className="cursor-pointer bg-red-500 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                    onClick={() => setRefreshCounter((prev) => prev + 1)}
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Orders" value={totalOrders} subtitle="All time" Icon={ShoppingCart} />
                <StatCard
                    title="Total Revenue"
                    value={`ALL ${Number(totalRevenue).toLocaleString()}`}
                    subtitle="All time"
                    Icon={DollarSign}
                />
                <StatCard title="Active Customers" value={uniqueCustomers} subtitle="Recently ordered" Icon={Users} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                <div className="lg:col-span-3">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-2">
                    <StatusDistributionChart />
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <RecentOrdersTable />
                </div>
                <div className="lg:col-span-2">
                    <PopularItemsTable />
                </div>
            </div>
        </div>
    );
}
