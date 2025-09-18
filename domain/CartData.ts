import CartItem from "@/domain/CartItemInterface ";

export interface CartData {
    id: number;
    cartItems: CartItem[];
    quantity: number;
    totalAmount: number;
}