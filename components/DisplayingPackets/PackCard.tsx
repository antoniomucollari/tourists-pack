import { useHybridCart } from "@/hooks/useHybridCart";
import {useAuth} from "@/context/AuthContext";

interface PackCardProps {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  features: string[];
}

export default function PackCard(product: PackCardProps) {
  const { addItem } = useHybridCart();
    const {isAdmin} = useAuth();
  return (
    <div className="pack-card">
      <div className="pack-header">
        <h3 className="pack-title">{product.title}</h3>
        <p className="pack-subtitle">{product.subtitle}</p>
        <div className="pack-price">{product.price} L</div>
        <div className="pack-duration">{product.duration}</div>
      </div>

      <div className="pack-body">
        <ul className="pack-features">
          {product.features.map((feature, index) => (
            <li key={index} className="pack-feature">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="pack-footer">
        <button
          className="pack-button"
          onClick={() =>
            addItem({
              id: product.id,
              name: product.title,
              subtitle: product.subtitle,
              price: product.price,
              productType: "PACKET",
              duration: parseInt(product.duration),
              features: product.features,
              isPopular: false,
            })
          }
          disabled={isAdmin}
        >
          Activate
        </button>
      </div>
    </div>
  );
}
