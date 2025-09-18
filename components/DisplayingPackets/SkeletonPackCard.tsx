export const SkeletonPackCard = () => (
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