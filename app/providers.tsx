
"use client";

import { CartProvider } from "react-use-cart";
import {AuthProvider} from "@/app/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>{children}</CartProvider>
        </AuthProvider>
    );
}