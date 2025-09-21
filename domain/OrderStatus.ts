// domain/OrderStatus.ts
export type OrderStatus =
    | "INITIALIZED"
    | "CONFIRMED"
    | "DELIVERED"
    | "ON_THE_WAY"
    | "CANCELLED"
    | "FAILED";


export type PaymentStatus = "PENDING"| "COMPLETED"| "FAILED"| "REFUNDED"| "EXPIRED"| "REJECTED"| "CANCELED";