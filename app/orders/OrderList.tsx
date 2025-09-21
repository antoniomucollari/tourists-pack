// File: app/orders/OrderList.tsx
'use client';

import OrderDTO from "@/domain/OrderDTO";
import Link from "next/link";
import { OrderColors, PaymentColors } from "@/lib/OrderColors";
import {useAuth} from "@/context/AuthContext";

// --- ORDER ITEM COMPONENT ---
interface OrderItemProps {
    order: OrderDTO;
}

const OrderItem = ({ order }: OrderItemProps) => {
    const orderColor = OrderColors[order.orderStatus] || "#6B7280"; // fallback gray
    const paymentColor = PaymentColors[order.paymentStatus] || "#6B7280";
    const {isAdmin} = useAuth();
    return (
        <li
            className="border rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-md cursor-pointer"
        >
            <Link href={`/orders/${order.id}${isAdmin ? '?dashboard' : ''}`} className="block flex-1">
                <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-gray-500 text-sm">{new Date(order.orderDate).toLocaleString()}</p>
                    <p className="text-gray-700 mt-1">
                        Total: <span className="font-medium">{order.totalAmount} ALL</span>
                    </p>
                </div>
            </Link>
            <div className="flex flex-col items-start md:items-end gap-2">
                {/* Order Status */}
                <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                        backgroundColor: orderColor + "33", // 33 = 20% opacity
                        color: orderColor,
                    }}
                >
                    {order.orderStatus}
                </span>

                {/* Payment Status */}
                <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                        backgroundColor: paymentColor + "33",
                        color: paymentColor,
                    }}
                >
                    {order.paymentStatus}
                </span>

                {/* Pay Now button */}
                {order.paymentUrl && order.paymentStatus === "PENDING" && !isAdmin && (
                    <a
                        href={order.paymentUrl}
                        className="mt-2 text-white bg-[#e60000] px-4 py-2 rounded-lg text-sm hover:bg-red-700 text-center"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Pay Now
                    </a>
                )}
            </div>
        </li>
    );
};

// --- ORDER LIST COMPONENT ---
interface OrderListProps {
    orders: OrderDTO[];
}

export default function OrderList({ orders }: OrderListProps) {
    return (
        <ul className="space-y-4">
            {orders.map((order) => (
                <OrderItem key={order.id} order={order} />
            ))}
        </ul>
    );
}
