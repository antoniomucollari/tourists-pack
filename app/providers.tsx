"use client";

// 1. Import the provider from react-use-cart and give it an alias
import { CartProvider as LocalCartProvider } from "react-use-cart";
import { AuthProvider } from "@/context/AuthContext";
// 2. Import YOUR custom CartProvider that we built
import { CartProvider } from "@/context/CartContext";
import {ReactNode, useState} from "react";
import 'nprogress/nprogress.css';

import {QueryClient, QueryClientProvider } from "@tanstack/react-query";
export function Providers({ children }: { children: ReactNode }) {
const [queryClient] = useState(() => new QueryClient());
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <LocalCartProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </LocalCartProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
}