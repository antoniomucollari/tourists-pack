import Electronics from './Electronics';
import Packet from './Packet';

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