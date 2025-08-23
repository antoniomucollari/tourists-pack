"use client";

import {useCart} from "react-use-cart";

interface PackCardProps {
  id: string    ;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  features: string[];
}

export default function PackCard(product: PackCardProps) {

    const { addItem } = useCart();

  return (
    <div className="pack-card">
      {/* Card Header */}
      <div className="pack-header">
        <h3 className="pack-title">{product.title}</h3>
        <p className="pack-subtitle">{product.subtitle}</p>
        <div className="pack-price">{product.price}</div>
        <div className="pack-duration">{product.duration}</div>
      </div>

      {/* Card Body */}
      <div className="pack-body">
        <ul className="pack-features">
          {product.features.map((feature, index) => (
            <li key={index} className="pack-feature">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Card Footer */}
      <div className="pack-footer">
        <button
          className="pack-button"
          onClick={()=> addItem(product)}
          disabled={false}
        >
          Activate
        </button>
      </div>
    </div>
  );
}
