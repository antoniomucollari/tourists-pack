import Image from "next/image";

export const ActivationStep = ({
  number,
  title,
  text,
    img
}: {
  number: string;
  title: string;
  text: string;
  img: string;
}) => (
  <div className="step">
      <div>
            <Image width={90} height={90} src={img} alt={title} />
      </div>
      <div>
            <h3 className="step-title">{title}</h3>
            <p className="step-text">{text}</p>

      </div>
  </div>
);
