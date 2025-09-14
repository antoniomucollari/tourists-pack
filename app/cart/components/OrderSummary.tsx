import { OrderSummarySkeleton } from "@/app/cart/skeleton";
import { ShieldCheck } from "lucide-react";

interface Props {
    isLoading: boolean;
    cartTotal: number;
    isCheckoutLoading: boolean;
    handleCheckout: () => void;
    error: string | null;
    authLoading: boolean;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat("sq-AL", {
        style: "currency",
        currency: "ALL",
    }).format(price);

export default function OrderSummary({
                                 isLoading, cartTotal,
                                 isCheckoutLoading,
                                 handleCheckout,
                                 error,authLoading

                             }: Props) {
    if (isLoading|| authLoading) return <OrderSummarySkeleton />;

    return (
        <div className="bg-white rounded-lg shadow-md p-8 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">
                Order Summary
            </h2>
            <div className="space-y-4 text-gray-600">
                <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">Free</span>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center font-bold text-2xl text-gray-900">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
            </div>
            <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                className="w-full mt-8 bg-red-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 text-lg flex items-center justify-center disabled:bg-red-400 disabled:scale-100"
            >
                {isCheckoutLoading  ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span>Processing...</span>
                    </>
                ) : (
                    "Proceed to Checkout"
                )}
            </button>
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            <div className="mt-6 flex items-center justify-center text-sm text-gray-400">
                <ShieldCheck size={18} className="mr-2 text-green-500" />
                <span>Secure payment guaranteed</span>
            </div>
        </div>
    );
}
