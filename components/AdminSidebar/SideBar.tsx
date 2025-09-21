'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ClipboardList, Package, ChevronDown } from 'lucide-react';

export default function AdminSidebar() {
    const pathname = window.location.pathname;
    const [isProductsOpen, setProductsOpen] = useState(false);

    // Automatically open the products dropdown if the user is on a products-related page
    useEffect(() => {
        if (pathname.startsWith("/products")) {
            setProductsOpen(true);
        }
    }, [pathname]);

    const isDashboardActive = pathname === "/dashboard";
    const isOrdersActive = pathname.startsWith("/dashboard/orders");
    // The main "Products" button is active if the path starts with /products
    const isProductsActive = pathname.startsWith("/products");

    return (
        <aside className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col fixed">
            <div className="bg-gray-950 p-4 text-center">
                <h1 className="text-2xl font-bold text-white">Vodafone</h1>
            </div>

            <nav className="flex-grow p-4 space-y-2">
                {/* Dashboard Link */}
                <a
                    href="/dashboard"
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                        isDashboardActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    Dashboard
                </a>

                {/* Orders Link */}
                <a
                    href="/dashboard/orders"
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                        isOrdersActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
                    }`}
                >
                    <ClipboardList className="w-5 h-5 mr-3" />
                    Orders
                </a>

                {/* Products Dropdown */}
                <div>
                    <button
                        onClick={() => setProductsOpen(!isProductsOpen)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                            isProductsActive ? "bg-red-600 text-white" : "hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                        <div className="flex items-center">
                            <Package className="w-5 h-5 mr-3" />
                            Products
                        </div>
                        <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {isProductsOpen && (
                        <div className="mt-2 pl-8 space-y-1">
                            {/* All Products Link */}
                            <a
                                href="/products"
                                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                    pathname === "/products" ? "text-white font-semibold" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                All
                            </a>
                            {/* Packet Link */}
                            <a
                                href="/products/packet"
                                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                    pathname === "/products/packet" ? "text-white font-semibold" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Packet
                            </a>
                            {/* Electronics Link */}
                            <a
                                href="/products/electronics"
                                className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                    pathname === "/products/electronics" ? "text-white font-semibold" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Electronics
                            </a>
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

