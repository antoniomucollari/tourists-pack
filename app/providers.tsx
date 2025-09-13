
"use client";

    import { CartProvider } from "react-use-cart";
import {AuthProvider} from "@/context/AuthContext";
import {ReactNode} from "react";
import 'nprogress/nprogress.css';
    export function Providers({ children }: { children: ReactNode }) {
        return (
            <AuthProvider>
                <CartProvider>{children}</CartProvider>
            </AuthProvider>
        );
    }