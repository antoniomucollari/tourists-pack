import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    Icon: LucideIcon;
}

export function StatCard({ title, value, subtitle, Icon }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
        </div>
    );
}