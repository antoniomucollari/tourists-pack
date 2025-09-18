// File Path: app/orders/OrderList.tsx
'use client';

import OrderDTO from "@/domain/OrderDTO";
import Link from "next/link";

// --- ORDER ITEM COMPONENT ---
interface OrderItemProps {
    order: OrderDTO;
}

const OrderItem = ({ order }: OrderItemProps) => {
    return (
        // The entire list item is now a link to the detail page
        <li className="border rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-md hover:border-red-300 cursor-pointer">
            <Link href={`/orders/${order.id}`} className="block flex-1">
                <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-gray-500 text-sm">{new Date(order.orderDate).toLocaleString()}</p>
                    <p className="text-gray-700 mt-1">
                        Total: <span className="font-medium">{order.totalAmount} ALL</span>
                    </p>
                </div>
            </Link>
            <div className="flex flex-col items-start md:items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === "COMPLETED" ? "bg-green-100 text-green-700" : order.orderStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                  {order.orderStatus}
                </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {order.paymentStatus}
                </span>

                    {order.paymentUrl && order.paymentStatus === "PENDING" && (
                        <a
                            href={order.paymentUrl}
                            className="mt-2 text-white bg-[#e60000] px-4 py-2 rounded-lg text-sm hover:bg-red-700 text-center"
                            target="_blank"
                            rel="noopener noreferrer">
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

