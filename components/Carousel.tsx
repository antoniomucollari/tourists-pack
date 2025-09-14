"use client"
import { useEffect, useState } from "react";
import PackCard from "@/components/PackCard";
import { ChevronRight } from "lucide-react";
// The old Loading component is no longer needed.
// import Loading from "./Loading";
import Packet from "@/domain/Packet";


/**
 * A skeleton placeholder for a single PackCard.
 * It mimics the card's structure to prevent layout shifts.
 */
const SkeletonPackCard = () => (
    <div className="carousel-slide" aria-hidden="true">
        <div className="w-full h-full p-6 bg-white rounded-lg border border-gray-200 shadow-md animate-pulse">
            {/* Title placeholder */}
            <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3"></div>
            {/* Subtitle placeholder */}
            <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-5"></div>
            {/* Price placeholder */}
            <div className="h-10 bg-gray-300 rounded-md w-1/3 mb-5"></div>
            {/* Duration placeholder */}
            <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-6"></div>
            {/* Features placeholder */}
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            {/* Button placeholder */}
            <div className="h-12 bg-gray-300 rounded-lg mt-8"></div>
        </div>
    </div>
);

/**
 * The main skeleton component for the entire carousel.
 * It is responsive and shows a different number of skeleton cards
 * based on the screen size to match the final component's behavior.
 */
const CarouselSkeleton = () => (
    <section>
        {/* Title Placeholder */}
        <div className="h-10 bg-gray-300 rounded-md w-1/2 md:w-1/3 mx-auto animate-pulse mb-8"></div>

        <div className="carousel-container">
            {/* Prev Button Placeholder */}
            <div className="carousel-button prev bg-gray-200 h-12 w-12 rounded-full opacity-50"></div>

            <div className="carousel-viewport overflow-hidden">
                <div className="flex w-full">
                    {/* Card 1 (Visible on all screen sizes) */}
                    <SkeletonPackCard />
                    {/* Card 2 (Visible on screens > 600px) */}
                    <div className="hidden sm:block w-full">
                        <SkeletonPackCard />
                    </div>
                    {/* Card 3 (Visible on screens > 900px) */}
                    <div className="hidden lg:block w-full">
                        <SkeletonPackCard />
                    </div>
                </div>
            </div>

            {/* Next Button Placeholder */}
            <div className="carousel-button next bg-gray-200 h-12 w-12 rounded-full opacity-50"></div>
        </div>
    </section>
);


// This is your final, data-fetching carousel component.
export default function Carousel() {

    // Step 2: Remove the hardcoded 'packs' array and add state for data, loading, and errors.
    const [packs, setPacks] = useState<Packet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Step 3: Use useEffect to fetch data from your API when the component mounts.
    useEffect(() => {
        const fetchPacks = async () => {
            try {
                // Simulate a network delay to see the skeleton
                await new Promise(resolve => setTimeout(resolve));

                const response = await fetch('/api/packet');

                if (!response.ok) {
                    throw new Error('Failed to fetch data from the server.');
                }

                const result = await response.json();

                // IMPORTANT: Your API wraps the response, so we access the 'data' property.
                setPacks(result.data);

            } catch (err: any) {
                setError(err.message);
                console.error("API Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPacks();
    }, []);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const getItemsPerPage = () => {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        };
        const handleResize = () => setItemsPerPage(getItemsPerPage());
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    if (isLoading) {
        // Use the new CarouselSkeleton component while loading.
        return <CarouselSkeleton />;
    }

    if (error) {
        return <section><h2 className="section-title color-red">Error: {error}</h2></section>;
    }

    const maxIndex = packs.length > itemsPerPage ? packs.length - itemsPerPage : 0;

    // Step 5: Render the carousel with the fetched data from the 'packs' state.
    return (
        <section>
            <h2 className="section-title"><span className="color-red">Tourist Packs</span> Plans & Pricing</h2>
            <div className="carousel-container">
                <button onClick={goToPrevious} className="carousel-button prev" disabled={currentIndex === 0}>
                    &#10094;
                </button>
                <div className="carousel-viewport">
                    <div
                        className="carousel-slider"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                    >
                        {packs.map((pack) => (
                            <div className={`carousel-slide ${pack.popular ? 'popular' : ''}`} key={pack.id}>
                                <PackCard
                                    id={pack.id}
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
                <button aria-label="Next" onClick={goToNext} className="carousel-button next" disabled={currentIndex === maxIndex}>
                    <ChevronRight size={24} strokeWidth={1} />
                </button>
            </div>
        </section>
    );
}
