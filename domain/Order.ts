import CartItem from "@/domain/CartItemInterface ";
import Product from "@/domain/Product";

export default interface Order {
    id: number;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    orderItems: Product[];
    paymentUrl?: string;
    paymentGatewayOrderId?: string;
}