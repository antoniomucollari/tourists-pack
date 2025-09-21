'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link";

// --- SVG Icon Components ---
const DashboardIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const OrdersIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ProductsIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isProductsOpen, setProductsOpen] = useState(false);

    // Automatically open products dropdown if on a product page
    useEffect(() => {
        if (pathname.startsWith("/products")) {
            setProductsOpen(true);
        }
    }, [pathname]);

    const isDashboardActive = pathname === "/dashboard";
    const isOrdersActive = pathname.startsWith("/dashboard/orders");
    const isProductsActive = pathname.startsWith("/products");

    return (
        <aside className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col fixed">
            <div className="bg-gray-950 p-4 text-center">
                <h1 className="text-2xl font-bold text-white">Vodafone</h1>
            </div>

            <nav className="flex-grow p-4 space-y-2">
                {/* Dashboard */}
                <Link
                    href="/dashboard"
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                        isDashboardActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
                    }`}
                >
                    <DashboardIcon className="w-6 h-6 mr-3" />
                    Dashboard
                </Link>

                {/* Orders */}
                <Link
                    href="/dashboard/orders"
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                        isOrdersActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
                    }`}
                >
                    <OrdersIcon className="w-6 h-6 mr-3" />
                    Orders
                </Link>

                {/* Products Dropdown */}
                <div>
                    <button
                        onClick={() => setProductsOpen(!isProductsOpen)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                            isProductsActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                        <div className="flex items-center">
                            <ProductsIcon className="w-6 h-6 mr-3" />
                            Products
                        </div>
                        <ChevronDownIcon
                            className={`w-5 h-5 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {isProductsOpen && (
                        <div className="mt-2 pl-8 space-y-1">
                            <Link
                                href="/products/packet"
                                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                    pathname === "/products/packet" ? "text-white" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Packet
                            </Link>
                            <Link
                                href="/products/electronics"
                                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                    pathname === "/products/electronics" ? "text-white" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Electronics
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            <div className="p-4 border-t border-gray-800 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Vodafone Inc.</p>
            </div>
        </aside>
    );
}
