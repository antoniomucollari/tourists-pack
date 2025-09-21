import { Trash2 } from "lucide-react";
import Product from "@/domain/Product";

interface Props {
    item: Product;
    updateItemQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat("sq-AL", {
        style: "currency",
        currency: "ALL",
    }).format(price);

export default function CartItem({ item, updateItemQuantity, removeItem }: Props) {
    return (
        <div className="p-6 flex items-center space-x-6 transition-colors hover:bg-gray-50">
            <img
                src={item.productType === 'ELECTRONICS' ? item.imageUrl :`https://publish.oneappcms.vodafone.com/content/dam/multimedia/oneappcms/al/web%20assets/New%20images%20for%20homepage%20test/herobanner-images/RoamingHerobanner.jpg`}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg shadow-sm"
            />
            <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{item.productType}</p>
            </div>
            <div className="flex items-center border border-gray-200 rounded-full">
                <button
                    disabled={item.productType === 'PACKET'}
                    onClick={() => updateItemQuantity(Number(item.id), (item.quantity ?? 0) - 1)}
                    className="px-4 py-2 text-xl font-semibold text-gray-500 hover:bg-gray-100 rounded-l-full transition"
                >
                    -
                </button>
                <span className="px-5 text-center font-semibold text-lg">{item.quantity}</span>
                <button
                    disabled={item.productType === 'PACKET'}
                    onClick={() => updateItemQuantity(Number(item.id), (item.quantity ?? 0) + 1)}
                    className="px-4 py-2 text-xl font-semibold text-gray-500 hover:bg-gray-100 rounded-r-full transition"
                >
                    +
                </button>
            </div>
            <div className="w-32 text-right">
                <p className="font-bold text-xl text-gray-800">
                    {formatPrice(item.price * (item.productType === 'ELECTRONICS' ? item.quantity : 1))}
                </p>
            </div>
            <button
                onClick={() => removeItem(Number(item.id))}
                className="text-gray-400 hover:text-red-600 transition"
                title="Remove item"
            >
                <Trash2 size={22} />
            </button>
        </div>
    );
}
