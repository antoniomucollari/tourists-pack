export default interface Electronics {
    productSize: string;
    discountPrice?: number; // Optional because not all electronics are on sale
    imageUrl: string;
    stockNumber: number;
}