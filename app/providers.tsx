
"use client";

import { CartProvider } from "react-use-cart";

export function Providers({ children }: { children: React.ReactNode }) {
    return <CartProvider>{children}</CartProvider>;
}