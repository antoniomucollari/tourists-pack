export const SkeletonOrderItem = () => (
    <li className="rounded-xl p-4 shadow-sm animate-pulse">
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2 flex-grow"><div className="h-5 bg-gray-200 rounded w-3/5"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div><div className="h-4 bg-gray-200 rounded w-1/4 mt-1"></div></div>
            <div className="flex flex-col items-start md:items-end gap-2"><div className="h-6 bg-gray-200 rounded-full w-24"></div><div className="h-6 bg-gray-200 rounded-full w-28"></div><div className="h-8 bg-gray-200 rounded-lg w-20 mt-2"></div></div>
        </div>
    </li>
);