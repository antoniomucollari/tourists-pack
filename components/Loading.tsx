import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div
            className="flex flex-col items-center justify-center"
            style={{ height: '200px' }} // You can adjust the height as needed
        >
            <Loader2 className="h-12 w-12 text-slate-400 animate-spin" />
        </div>
    );
}