export const OrderDetailPageSkeleton = () => (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
        {/* Back link placeholder */}
        <div className="h-5 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="bg-white shadow-md rounded-lg p-6">
            {/* Header placeholder */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
                <div className="h-7 bg-gray-300 rounded w-24"></div>
            </div>

            {/* Status grid placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
                <div>
                    <div className="h-6 bg-gray-300 rounded w-36 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-28"></div>
                </div>
            </div>

            {/* Items list placeholder */}
            <div>
                <div className="h-6 bg-gray-300 rounded w-20 mb-4  pt-4"></div>
                <ul className="space-y-4">
                    {[1, 2].map(i => (
                        <li key={i} className="flex justify-between items-center">
                            <div>
                                <div className="h-5 bg-gray-200 rounded w-40 mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="h-5 bg-gray-200 rounded w-16"></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);