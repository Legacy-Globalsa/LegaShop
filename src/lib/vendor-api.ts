/**
 * Vendor-scoped API wrappers.
 * All endpoints require role=VENDOR (enforced by backend `IsVendor` permission).
 */

import type { Order, Product, Store } from "@/lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// authFetch is defined in api.ts but not exported. Re-implement a thin version
// that reuses the same token-storage contract (access_token in localStorage).
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("access_token");
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { ...options, headers });
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function unwrap<T>(data: PaginatedResponse<T> | T[]): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in data) return data.results;
  return [];
}

async function asJson<T>(res: Response, errMsg: string): Promise<T> {
  if (!res.ok) {
    let detail = errMsg;
    try {
      const body = await res.json();
      detail = typeof body === "object" ? body.error || body.detail || Object.values(body).flat().join(" ") : errMsg;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

// ──────────────────────────────────────
// Store (vendor's own)
// ──────────────────────────────────────

export async function fetchMyStore(): Promise<Store | null> {
  const res = await authFetch(`${API_BASE_URL}/stores/me/`);
  if (res.status === 404) return null;
  return asJson<Store>(res, "Failed to fetch store");
}

export type StoreInput = Partial<
  Pick<
    Store,
    | "name"
    | "name_ar"
    | "description"
    | "phone"
    | "latitude"
    | "longitude"
    | "delivery_zone"
    | "avg_delivery_min"
    | "district"
    | "image_url"
  >
>;

export async function createMyStore(data: StoreInput | FormData): Promise<Store> {
  const res = await authFetch(`${API_BASE_URL}/stores/create/`, {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return asJson<Store>(res, "Failed to create store");
}

export async function updateMyStore(id: number, data: StoreInput | FormData): Promise<Store> {
  const res = await authFetch(`${API_BASE_URL}/stores/${id}/update/`, {
    method: "PATCH",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return asJson<Store>(res, "Failed to update store");
}

// ──────────────────────────────────────
// Vendor Products
// ──────────────────────────────────────

export interface VendorProductFilters {
  category?: string | number;
  is_deal?: boolean;
  low_stock?: boolean;
  search?: string;
}

export async function fetchVendorProducts(filters: VendorProductFilters = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", String(filters.category));
  if (filters.is_deal) params.set("is_deal", "true");
  if (filters.low_stock) params.set("low_stock", "true");
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();
  const res = await authFetch(`${API_BASE_URL}/vendor/products/${qs ? `?${qs}` : ""}`);
  const data = await asJson<PaginatedResponse<Product> | Product[]>(res, "Failed to fetch products");
  return unwrap<Product>(data);
}

export type ProductInput = {
  category: number;
  name: string;
  name_tl?: string;
  name_ar?: string;
  description?: string;
  price: number | string;
  sale_price?: number | string | null;
  currency?: string;
  stock: number;
  unit?: string;
  image_url?: string;
  is_deal?: boolean;
  deal_type?: "ONE_RIYAL" | "FIVE_RIYAL" | null;
};

export async function createVendorProduct(data: ProductInput | FormData): Promise<Product> {
  const res = await authFetch(`${API_BASE_URL}/vendor/products/`, {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return asJson<Product>(res, "Failed to create product");
}

export async function updateVendorProduct(id: number, data: Partial<ProductInput> | FormData): Promise<Product> {
  const res = await authFetch(`${API_BASE_URL}/vendor/products/${id}/`, {
    method: "PATCH",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return asJson<Product>(res, "Failed to update product");
}

export async function deleteVendorProduct(id: number): Promise<void> {
  const res = await authFetch(`${API_BASE_URL}/vendor/products/${id}/delete/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
}

// ──────────────────────────────────────
// Vendor Orders
// ──────────────────────────────────────

export interface VendorOrderFilters {
  status?: Order["status"];
  from?: string; // YYYY-MM-DD
  to?: string;
}

export async function fetchVendorOrders(filters: VendorOrderFilters = {}): Promise<Order[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  const qs = params.toString();
  const res = await authFetch(`${API_BASE_URL}/vendor/orders/${qs ? `?${qs}` : ""}`);
  const data = await asJson<PaginatedResponse<Order> | Order[]>(res, "Failed to fetch orders");
  return unwrap<Order>(data);
}

export async function fetchVendorOrder(id: number): Promise<Order> {
  const res = await authFetch(`${API_BASE_URL}/vendor/orders/${id}/`);
  return asJson<Order>(res, "Failed to fetch order");
}

export async function updateVendorOrderStatus(id: number, status: Order["status"]): Promise<Order> {
  const res = await authFetch(`${API_BASE_URL}/vendor/orders/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return asJson<Order>(res, "Failed to update order status");
}
