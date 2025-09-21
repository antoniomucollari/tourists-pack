"use client";

import { CartProvider as LocalCartProvider } from "react-use-cart";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { ReactNode, useState } from "react";
import "nprogress/nprogress.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <LocalCartProvider>
            <CartProvider>
              {children}
              <Toaster position="top-right" />
            </CartProvider>
          </LocalCartProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
