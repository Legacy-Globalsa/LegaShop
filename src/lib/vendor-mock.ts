/**
 * Mock data for vendor dashboard aggregations not yet served by the backend.
 * Gated by VITE_VENDOR_USE_MOCK env flag in hooks.
 */

export interface VendorAnalytics {
  todayOrders: number;
  todayRevenue: number;
  pendingCount: number;
  outForDeliveryCount: number;
  lowStockCount: number;
  weekRevenue: number;
  topProducts: { id: number; name: string; sold: number; revenue: number }[];
  salesLast7Days: { date: string; orders: number; revenue: number }[];
}

export const MOCK_VENDOR_ANALYTICS: VendorAnalytics = {
  todayOrders: 14,
  todayRevenue: 612,
  pendingCount: 3,
  outForDeliveryCount: 2,
  lowStockCount: 5,
  weekRevenue: 4280,
  topProducts: [
    { id: 1, name: "Lucky Me Pancit Canton", sold: 86, revenue: 430 },
    { id: 2, name: "Century Tuna Flakes in Oil 180g", sold: 54, revenue: 540 },
    { id: 3, name: "Birch Tree Full Cream Milk 1kg", sold: 42, revenue: 798 },
    { id: 4, name: "C2 Apple Iced Tea 500ml", sold: 38, revenue: 190 },
    { id: 5, name: "CDO Karne Norte 150g", sold: 31, revenue: 217 },
  ],
  salesLast7Days: [
    { date: "Apr 17", orders: 9, revenue: 412 },
    { date: "Apr 18", orders: 12, revenue: 538 },
    { date: "Apr 19", orders: 11, revenue: 489 },
    { date: "Apr 20", orders: 15, revenue: 671 },
    { date: "Apr 21", orders: 13, revenue: 602 },
    { date: "Apr 22", orders: 17, revenue: 756 },
    { date: "Apr 23", orders: 14, revenue: 612 },
  ],
};

export interface VendorPayout {
  id: number;
  period: string;
  gross: number;
  commission: number;
  net: number;
  status: "PENDING" | "PAID";
  paid_at: string | null;
}

export const MOCK_VENDOR_PAYOUTS: VendorPayout[] = [
  { id: 1, period: "Apr 1 – Apr 7", gross: 3120, commission: 312, net: 2808, status: "PAID", paid_at: "2026-04-09" },
  { id: 2, period: "Apr 8 – Apr 14", gross: 3640, commission: 364, net: 3276, status: "PAID", paid_at: "2026-04-16" },
  { id: 3, period: "Apr 15 – Apr 21", gross: 4280, commission: 428, net: 3852, status: "PENDING", paid_at: null },
];

export const USE_VENDOR_MOCK = import.meta.env.VITE_VENDOR_USE_MOCK !== "false";
