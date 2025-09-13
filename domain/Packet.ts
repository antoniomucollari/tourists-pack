export default interface Packet {
    id: string;
    cartId: string;
    quantity: number;
    itemTotal: number;
    name: string;
    subtitle: string;
    price: number;
    duration: number;
    features: string[];
    popular: boolean;
}
