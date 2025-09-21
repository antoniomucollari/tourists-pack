import Electronics from './Electronics';
import Packet from './Packet';

// This is the base for all products, containing common fields.
interface ProductBase {
    id: number;
    name: string;
    subtitle: string;
    price: number;
}


type Product = ProductBase & (
    {
        productType: 'PACKET';
    } & Packet
    |
    {
        productType: 'ELECTRONICS';
    } & Electronics
    );

export default Product;