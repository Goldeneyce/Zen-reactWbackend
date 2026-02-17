import { OrderSchemaType, OrderActivityType, ReturnRequestType } from "@repo/order-db"

export type OrderType = OrderSchemaType & {
    _id: string;
};

export type OrderChartType = {
    month: string,
    total: number,
    successful: number,
}

export type OrderActivityLogType = OrderActivityType & {
    _id: string;
};

export type ReturnRequestFullType = ReturnRequestType & {
    _id: string;
};

export type OrderAdminStats = {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    avgOrderValue: number;
    todayOrders: number;
    todayRevenue: number;
};

export type OrderStatusCount = {
    status: string;
    count: number;
};

export type RevenueByDay = {
    date: string;
    revenue: number;
    orders: number;
};