// lib/OrderColors.ts
export const OrderColors: { [key: string]: string } = {
    INITIALIZED: "#3B82F6", // Bright Blue
    ON_THE_WAY:  "#F59E0B", // Bright Amber/Orange
    DELIVERED:   "#16A34A", // Vivid Green
    CANCELLED:   "#EF4444", // Bright Red
    FAILED:      "#e60000", // Deep Red (distinct from CANCELLED)
    CONFIRMED:   "#8B5CF6", // Bright Violet/Purple (distinct from DELIVERED)
};

export const PaymentColors: { [key: string]: string } = {
    PENDING:   "#FACC15", // Amber / attention
    REJECTED:  "#DC2626", // Red / rejected
    CANCELED:  "#F97316", // Orange / canceled
    COMPLETED: "#16A34A", // Green / success
    FAILED:    "#B91C1C", // Dark Red / failed
    REFUNDED:  "#3B82F6", // Blue / refunded
    EXPIRED:   "#6B7280", // Gray / expired
};