export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center" role="status" aria-label="Loading">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                </div>
                <p className="mt-6 text-lg font-semibold text-gray-700">Loading Your Cart...</p>
            </div>
        </div>
    );
}

