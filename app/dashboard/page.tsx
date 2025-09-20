
import { getTotalOrders, getTotalRevenue, getUniqueCustomers } from "@/lib/api";
import { ShoppingCart, DollarSign, Users, RefreshCw } from "lucide-react";
import { Suspense } from "react";
import { StatCard } from "./StatCard";
import { RevenueChart } from "./RevenueChart";
import {StatusDistributionChart} from "@/app/dashboard/StatusDistributionChart";
import {RecentOrdersTable} from "@/app/dashboard/RecentOrdersTable";
import {PopularItemsTable} from "@/app/dashboard/PopularItemsTable";

async function Stats() {
    const [totalOrders, totalRevenue, uniqueCustomers] = await Promise.all([
        getTotalOrders(),
        getTotalRevenue(),
        getUniqueCustomers(),
    ]);

    return (
        <>
            <StatCard
                title="Total Orders"
                value={totalOrders}
                subtitle="All time"
                Icon={ShoppingCart}
            />
            <StatCard
                title="Total Revenue"
                value={`ALL ${totalRevenue.toLocaleString()}`}
                subtitle="All time"
                Icon={DollarSign}
            />
            <StatCard
                title="Active Customers"
                value={uniqueCustomers}
                subtitle="Recently ordered"
                Icon={Users}
            />
        </>
    );
}

export default function DashboardPage() {
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <main className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <button className="bg-red-500 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <RefreshCw className="h-4 w-4" />
                        <span>Refresh Data</span>
                    </button>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <Suspense fallback={<div className="text-center col-span-3">Loading stats...</div>}>
                        <Stats />
                    </Suspense>
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
            </main>
        </div>
    );
}