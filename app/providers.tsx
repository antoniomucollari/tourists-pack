
"use client";

    import { CartProvider } from "react-use-cart";
import {AuthProvider} from "@/context/AuthContext";
import {ReactNode} from "react";

    export function Providers({ children }: { children: ReactNode }) {
        return (
            <AuthProvider>
                <CartProvider>{children}</CartProvider>
            </AuthProvider>
        );
    }