"use client";

interface PackCardProps {
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  features: string[];
}

export default function PackCard({
  title,
  subtitle,
  price,
  duration,
  features,
}: PackCardProps) {
  const handleActivate = async () => {};

  return (
    <div className="pack-card">
      {/* Card Header */}
      <div className="pack-header">
        <h3 className="pack-title">{title}</h3>
        <p className="pack-subtitle">{subtitle}</p>
        <div className="pack-price">{price}</div>
        <div className="pack-duration">{duration}</div>
      </div>

      {/* Card Body */}
      <div className="pack-body">
        <ul className="pack-features">
          {features.map((feature, index) => (
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
          onClick={handleActivate}
          disabled={false}
        >
          Activate
        </button>
      </div>
    </div>
  );
}
