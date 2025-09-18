"use client"
import EmptyCart from "@/app/cart/EmptyCart";
import { useHybridCart } from "@/hooks/useHybridCart";
import CartItems from "@/app/cart/components/CartItems";
import OrderSummary from "@/app/cart/components/OrderSummary";
import {useState } from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";

export default function CartPage() {
    const [error, setError] = useState<string | null>(null);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const router = useRouter();
    const { isLoading, isEmpty, items, updateItemQuantity, removeItem, cartTotal } =
        useHybridCart();
    const { isLoading: authLoading } = useAuth();

    const handleCheckout = async () => {
        setError(null);
        setIsCheckoutLoading(true);
        try {
            const response = await fetch("/api/orders/checkout", { method: "POST" });
            if (response.status === 403) {
                router.push("/login?redirect=/cart");
                return;
            }
            const result = await response.json();
            if (!response.ok ) {
                setError(result.data);
                throw new Error(result.message || "Failed to create order.");
            }
            const paymentUrl = result.data?.paymentUrl;
            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                throw new Error("Payment URL was not provided by the server.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    if (!isLoading && isEmpty && !authLoading) return <EmptyCart />;

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <CartItems
                            items={items}
                            isLoading={isLoading}
                            authLoading={authLoading}
                            updateItemQuantity={updateItemQuantity}
                            removeItem={removeItem}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <OrderSummary
                            isLoading={isLoading}
                            cartTotal={cartTotal}
                            authLoading={authLoading}
                            isCheckoutLoading={isCheckoutLoading}
                            handleCheckout={handleCheckout}
                            error={error}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
