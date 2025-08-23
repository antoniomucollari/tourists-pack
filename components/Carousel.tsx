"use client"
import {useEffect, useState} from "react";
import PackCard from "@/components/PackCard";
export default function Carousel(){

    const packs = [
        {
            id: "1",
            title: "Basic Pack",
            subtitle: "Perfect for short visits",
            price: 500,
            duration: "3 days",
            features: ["2GB Data", "50 Minutes", "100 SMS"],
        },
        {
            id: "2",
            title: "Standard Pack",
            subtitle: "Great for week-long stays",
            price: 1000,
            duration: "7 days",
            features: ["5GB Data", "100 Minutes", "Unlimited SMS"],
            isPopular: true
        },
        {
            id: "3",
            title: "Advanced Pack",
            subtitle: "Great for week-long stays",
            price: 1500,
            duration: "3 days",
            features: ["∞ GB Data", "100 Minutes", "Unlimited SMS"],
        },
        {
            id: "4",
            title: "Ultimated Pack",
            subtitle: "Great for week-long stays",
            price: 2000,
            duration: "3 days",
            features: ["∞ GB Data", "100 Minutes", "Unlimited SMS"],
        },
    ];

    const [itemsPerPage, setItemsPerPage] = useState(3);
    useEffect(() => {
        const getItemsPerPage = () => {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        };

        const handleResize = () => {
            setItemsPerPage(getItemsPerPage());
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? packs.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === packs.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const maxIndex = packs.length > itemsPerPage ? packs.length - itemsPerPage : 0;
    return(
        <section>
            <h2 className="section-title"><span className="color-red">Tourist Packs</span> Plans & Pricing</h2>

            <div className="carousel-container">
                {/* Previous Button - now with disabled state */}
                <button onClick={goToPrevious} className="carousel-button prev" disabled={currentIndex === 0}>
                    &#10094;
                </button>

                <div className="carousel-viewport">
                    <div
                        className="carousel-slider"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                    >
                        {packs.map((pack, index) => (
                            <div className={`carousel-slide  ${pack.isPopular ? 'popular' : ''}`} key={index}>
                                <PackCard
                                    id={pack.id}
                                    title={pack.title}
                                    subtitle={pack.subtitle}
                                    price={pack.price}
                                    duration={pack.duration}
                                    features={pack.features}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Button - now with disabled state */}
                <button onClick={goToNext} className="carousel-button next" disabled={currentIndex === maxIndex}>
                    &#10095;
                </button>
            </div>
        </section>
    )
}