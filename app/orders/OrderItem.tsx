// File Path: app/orders/OrderItem.tsx
'use client';

// --- COLOR HELPER FUNCTION ---
// This function returns the appropriate Tailwind classes for each status
import {OrderStatus} from "@/domain/OrderStatus";
import OrderDTO from "@/domain/OrderDTO";

const getStatusClasses = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
        case 'COMPLETED':
            return 'bg-emerald-100 text-emerald-800';
        case 'PENDING':
            return 'bg-amber-100 text-amber-800';
        case 'CANCELLED':
            return 'bg-slate-100 text-slate-700';
        case 'EXPIRED':
            return 'bg-rose-100 text-rose-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export default function OrderItem({ order }: { order:OrderDTO }) {
    return (
        <a href={`/orders/${order.id}`} className="block">
            <li className="border rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-md hover:border-red-300 cursor-pointer">
                <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-gray-500 text-sm">{new Date(order.orderDate).toLocaleString()}</p>
                    <p className="text-gray-700 mt-1">Total: <span className="font-medium">{order.totalAmount} ALL</span></p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                    {/* Order Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(order.orderStatus)}`}>
                        {order.orderStatus}
                    </span>
                    {/* Payment Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(order.paymentStatus)}`}>
                        {order.paymentStatus}
                    </span>
                    {order.paymentUrl && order.paymentStatus === "PENDING" && (
                        <a
                            href={order.paymentUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 text-white bg-[#e60000] px-4 py-2 rounded-lg text-sm hover:bg-red-700 text-center"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Pay Now
                        </a>
                    )}
                </div>
            </li>
        </a>
    );
}

