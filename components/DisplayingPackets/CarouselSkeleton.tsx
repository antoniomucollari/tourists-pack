import {SkeletonPackCard} from "@/components/DisplayingPackets/SkeletonPackCard";

export const CarouselSkeleton = () => (
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
