import CartItem from "@/domain/CartItemInterface ";

export default interface Order {
    id: number;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    orderItems: CartItem[];
    paymentUrl?: string;
    paymentGatewayOrderId?: string;
}