import Electronics from './Electronics';
import Packet from './Packet';

// This is the base for all products, containing common fields.
interface ProductBase {
    id: number;
    name: string;
    subtitle: string;
    price: number;
}

// This uses TypeScript's discriminated union.
// The 'productType' field will tell us whether to expect Packet or Electronics fields.
type Product = ProductBase & (
    {
        productType: 'PACKET';
    } & Packet
    |
    {
        productType: 'ELECTRONICS';
    } & Electronics // If type is ELECTRONICS, it will have Electronics' fields
    );

export default Product;