"use client";
import { useState } from "react";
import Sidebar from "@/components/AdminSidebar/SideBar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 transform ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } w-64 bg-gray-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 z-40`}
            >
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top bar for mobile */}
                <header className="flex items-center justify-between bg-white border-b p-4 shadow-sm lg:hidden">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-700">
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
