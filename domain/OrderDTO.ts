import { OrderStatus } from "./OrderStatus";

export default interface OrderDTO {
    id: string;
    orderDate: string;
    totalAmount: number;
    orderStatus: OrderStatus;
    paymentStatus: OrderStatus;
    paymentUrl?: string;
}