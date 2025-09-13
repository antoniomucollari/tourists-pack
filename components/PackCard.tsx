import { useHybridCart } from "@/hooks/useHybridCart";

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
          onClick={()=> addItem(product)}
          disabled={false}>
          Activate
        </button>
      </div>
    </div>
  );
}
