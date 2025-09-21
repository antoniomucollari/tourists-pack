import Product from "@/domain/Product";

export interface CartItemInterface {
    id: number;
    product: Product;
    quantity: number;
    pricePerUnit: number;
    subTotal: number;
}