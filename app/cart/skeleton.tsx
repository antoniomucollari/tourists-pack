export const CartItemSkeleton = () => (
    <div className="flex items-center space-x-6 py-6 animate-pulse">
        <div className="w-28 h-28 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-3">
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
    </div>
);

export const OrderSummarySkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
        <div className="h-8 w-1/2 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-5 w-1/5 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div className="mt-8 pt-6 border-t border-dashed">
            <div className="flex justify-between items-center">
                <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-7 w-1/4 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div className="h-14 w-full bg-gray-200 rounded-lg mt-8"></div>
    </div>
);
