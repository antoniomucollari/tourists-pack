import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CartItemSkeleton } from "@/app/cart/skeleton";
import CartItem from "./CartItem";
import Packet from "@/domain/Packet";

interface Props {
    items: Packet[];
    isLoading: boolean;
    isMounted: boolean;
    updateItemQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
}

export default function CartItems({
              items,
              isLoading,
              isMounted,
              updateItemQuantity,
              removeItem,}: Props) {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                <Link
                    href="/public"
                    className="text-gray-500 font-semibold hover:text-red-600 transition flex items-center"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Continue Shopping
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md">
                <div className="divide-y divide-gray-200">
                    {isLoading || !isMounted ? (
                        <div className="p-6">
                            <CartItemSkeleton />
                            <CartItemSkeleton />
                            <CartItemSkeleton />
                        </div>
                    ) : (
                        items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                updateItemQuantity={updateItemQuantity}
                                removeItem={removeItem}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
