"use client";

import { useEffect, useState } from "react";
import PackCard from "@/components/DisplayingPackets/PackCard";
import { ChevronRight } from "lucide-react";
import Product from "@/domain/Product";

export default function CarouselClient({ product }: { product: Product[] }) {
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(0);

    const packets = product.filter(
        (p): p is Product & { productType: 'PACKET' } => p.productType === 'PACKET'
    );

    useEffect(() => {
        const getItemsPerPage = () => {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        };
        const handleResize = () => setItemsPerPage(getItemsPerPage());
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? packets.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === packets.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const maxIndex = packets.length > itemsPerPage ? packets.length - itemsPerPage : 0;

    return (
        <section>
            <h2 className="section-title">
                <span className="color-red">Tourist Packs</span> Plans & Pricing
            </h2>
            <div className="carousel-container">
                <button
                    onClick={goToPrevious}
                    className="carousel-button prev"
                    disabled={currentIndex === 0}
                >
                    &#10094;
                </button>
                <div className="carousel-viewport">
                    <div
                        className="carousel-slider"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                        }}>
                        {packets.map((pack) => (
                            <div
                                className={`carousel-slide ${pack.isPopular ? "popular" : ""}`}
                                key={pack.id}
                            >
                                <PackCard
                                    id={pack.id.toString()}
                                    title={pack.name}
                                    subtitle={pack.subtitle}
                                    price={pack.price}
                                    duration={`${pack.duration} days`}
                                    features={pack.features}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    aria-label="Next"
                    onClick={goToNext}
                    className="carousel-button next"
                    disabled={currentIndex === maxIndex}
                >
                    <ChevronRight size={24} strokeWidth={1} />
                </button>
            </div>
        </section>
    );
}