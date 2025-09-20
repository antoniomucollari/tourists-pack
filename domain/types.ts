//for dashboard page

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface Order {
    id: number;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    customerName?: string; // Assuming you'll add this to your OrderDTO
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
}

export interface OrderStatusDistribution {
    [key: string]: number;
}

export interface PopularItem {
    itemName: string;
    orderCount: number;
}

export interface TotalOrders{
    totalOrders: number;
}