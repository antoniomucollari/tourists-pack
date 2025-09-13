import OrderItem from "@/domain/OrderItem";

export default interface Order {
    id: number;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    orderItems: OrderItem[];
    paymentUrl?: string;
    paymentGatewayOrderId?: string;
}