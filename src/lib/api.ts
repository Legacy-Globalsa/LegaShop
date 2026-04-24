const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface User {
  id: number;
  first_name: string;
  email: string;
  phone_number: string;
  role: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

interface SignupData {
  name: string;
  email: string;
  phone_number?: string;
  password: string;
  confirm_password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function apiSignup(data: SignupData): Promise<ApiResponse<AuthResponse>> {
  try {
    const res = await fetch(`${API_BASE_URL}/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      // DRF returns errors as object with field names as keys
      const errorMsg = typeof json === "object"
        ? Object.values(json).flat().join(" ")
        : "Signup failed";
      return { error: errorMsg };
    }

    return { data: json };
  } catch {
    return { error: "Network error. Is the backend running?" };
  }
}

export async function apiLogin(data: LoginData): Promise<ApiResponse<AuthResponse>> {
  try {
    const res = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      const errorMsg = typeof json === "object"
        ? Object.values(json).flat().join(" ")
        : "Login failed";
      return { error: errorMsg };
    }

    return { data: json };
  } catch {
    return { error: "Network error. Is the backend running?" };
  }
}

// Token management
export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
}

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// User management
export function saveUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): User | null {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem("user");
}

export function logout() {
  clearTokens();
  clearUser();
}

export async function apiGoogleLogin(idToken: string): Promise<ApiResponse<AuthResponse>> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/google/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });

    const json = await res.json();

    if (!res.ok) {
      const errorMsg = typeof json === "object"
        ? Object.values(json).flat().join(" ")
        : "Google login failed";
      return { error: errorMsg };
    }

    return { data: json };
  } catch {
    return { error: "Network error. Is the backend running?" };
  }
}

// ──────────────────────────────────────
// Authenticated fetch helper with token refresh
// ──────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    return true;
  } catch {
    return false;
  }
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  // If 401, try refreshing the token once
  if (res.status === 401 && token) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshToken().finally(() => { refreshPromise = null; });
    }
    const refreshed = await refreshPromise;
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getAccessToken()}`;
      res = await fetch(url, { ...options, headers });
    } else {
      // Refresh failed — force logout
      logout();
    }
  }

  return res;
}

// ──────────────────────────────────────
// Image URL helper — prefers Cloudinary upload over legacy URL
// ──────────────────────────────────────
export function getImageUrl(item: { image?: string | null; image_url?: string | null }): string | null {
  return item.image || item.image_url || null;
}

// ──────────────────────────────────────
// Type definitions for backend models
// ──────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  name_tl: string;
  name_ar: string;
  parent: number | null;
  image_url: string | null;
  image: string | null;
  is_active: boolean;
  subcategories: Category[];
  created_at: string;
}

export interface Product {
  id: number;
  store: number;
  store_name: string;
  category: number;
  category_name: string;
  name: string;
  name_tl: string;
  name_ar: string;
  description: string;
  price: string;
  sale_price: string | null;
  currency: string;
  stock: number;
  unit: string;
  image_url: string | null;
  image: string | null;
  is_deal: boolean;
  deal_type: "ONE_RIYAL" | "FIVE_RIYAL" | null;
  is_active: boolean;
  created_at: string;
}

export interface Store {
  id: number;
  owner: number;
  owner_name: string;
  name: string;
  name_ar: string;
  description: string;
  phone: string;
  latitude: number;
  longitude: number;
  delivery_zone: number;
  avg_delivery_min: number;
  rating: number;
  is_active: boolean;
  image_url: string | null;
  image: string | null;
  district: string;
  created_at: string;
}

export interface Review {
  id: number;
  user: number;
  reviewer_name: string;
  store: number;
  product: number | null;
  rating: number;
  comment: string;
  created_at: string;
}

// ──────────────────────────────────────
// Pagination helper
// ──────────────────────────────────────

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Extract items from a paginated or plain array response */
function unwrapResults<T>(data: PaginatedResponse<T> | T[]): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'results' in data) return data.results;
  return [];
}

// ──────────────────────────────────────
// Public API — Products
// ──────────────────────────────────────

export async function fetchProducts(params?: Record<string, string>): Promise<Product[]> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const res = await fetch(`${API_BASE_URL}/products/${query}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return unwrapResults<Product>(data);
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${API_BASE_URL}/products/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return await res.json();
}

export async function fetchDeals(dealType?: string): Promise<Product[]> {
  const url = dealType
    ? `${API_BASE_URL}/products/deals/?deal_type=${dealType}`
    : `${API_BASE_URL}/products/deals/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch deals");
  const data = await res.json();
  return unwrapResults<Product>(data);
}

// ──────────────────────────────────────
// Public API — Categories
// ──────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return await res.json();
}

// ──────────────────────────────────────
// Public API — Stores
// ──────────────────────────────────────

export async function fetchStores(): Promise<Store[]> {
  const res = await fetch(`${API_BASE_URL}/stores/`);
  if (!res.ok) throw new Error("Failed to fetch stores");
  const data = await res.json();
  return unwrapResults<Store>(data);
}

export async function fetchStoreById(id: number): Promise<Store | null> {
  const res = await fetch(`${API_BASE_URL}/stores/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch store");
  return await res.json();
}

export async function fetchStoreProducts(storeId: number): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products/?store=${storeId}`);
  if (!res.ok) throw new Error("Failed to fetch store products");
  const data = await res.json();
  return unwrapResults<Product>(data);
}

// ──────────────────────────────────────
// Public API — Reviews
// ──────────────────────────────────────

export async function fetchProductReviews(productId: number): Promise<Review[]> {
  const res = await fetch(`${API_BASE_URL}/products/${productId}/reviews/`);
  if (!res.ok) throw new Error("Failed to fetch product reviews");
  const data = await res.json();
  return unwrapResults<Review>(data);
}

export async function fetchStoreReviews(storeId: number): Promise<Review[]> {
  const res = await fetch(`${API_BASE_URL}/stores/${storeId}/reviews/`);
  if (!res.ok) throw new Error("Failed to fetch store reviews");
  const data = await res.json();
  return unwrapResults<Review>(data);
}

// ──────────────────────────────────────
// Authenticated API — Orders
// ──────────────────────────────────────

export interface Order {
  id: number;
  user: number;
  store: number;
  store_name: string;
  delivery_address: number;
  delivery_address_data?: {
    id: number;
    label: string;
    street: string;
    city: string;
    district: string;
    latitude: number | null;
    longitude: number | null;
    is_default: boolean;
  } | null;
  order_type: "LOCAL_RIYADH" | "PH_REMITTANCE";
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  subtotal: string;
  delivery_fee: string;
  total: string;
  currency: string;
  note: string;
  items: OrderItem[];
  payment: OrderPayment;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price_at_order: string;
  line_total: string;
}

export interface OrderPayment {
  id: number;
  method: "COD" | "MADA" | "VISA" | "APPLE_PAY";
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  amount: string;
  currency: string;
  reference: string;
  paid_at: string | null;
  created_at: string;
}

export interface CreateOrderData {
  store: number;
  delivery_address: number;
  order_type?: string;
  payment_method?: string;
  note?: string;
  idempotency_key?: string;
  items: { product: number; quantity: number }[];
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await authFetch(`${API_BASE_URL}/orders/`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return unwrapResults<Order>(data);
}

export async function fetchOrderById(id: number): Promise<Order> {
  const res = await authFetch(`${API_BASE_URL}/orders/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch order");
  return await res.json();
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  const res = await authFetch(`${API_BASE_URL}/orders/create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(typeof err === "object" ? (err.error || Object.values(err).flat().join(" ")) : "Failed to create order");
  }
  return await res.json();
}

export async function cancelOrder(id: number): Promise<Order> {
  const res = await authFetch(`${API_BASE_URL}/orders/${id}/cancel/`, {
    method: "PUT",
    body: JSON.stringify({ status: "CANCELLED" }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(typeof err === "object" ? Object.values(err).flat().join(" ") : "Failed to cancel order");
  }
  return await res.json();
}

// ──────────────────────────────────────
// Authenticated API — Reviews
// ──────────────────────────────────────

export interface CreateReviewData {
  store: number;
  product?: number;
  rating: number;
  comment: string;
}

export async function createReview(data: CreateReviewData): Promise<Review> {
  const res = await authFetch(`${API_BASE_URL}/reviews/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(typeof err === "object" ? Object.values(err).flat().join(" ") : "Failed to submit review");
  }
  return await res.json();
}

// ──────────────────────────────────────
// Authenticated API — Addresses
// ──────────────────────────────────────

export interface Address {
  id: number;
  label: "HOME" | "WORK" | "OTHER";
  street: string;
  city: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
}

export type AddressInput = Omit<Address, "id" | "created_at">;

export async function fetchAddresses(): Promise<Address[]> {
  const res = await authFetch(`${API_BASE_URL}/addresses/`);
  if (!res.ok) throw new Error("Failed to fetch addresses");
  const data = await res.json();
  return unwrapResults<Address>(data);
}

export async function createAddress(data: AddressInput): Promise<Address> {
  const res = await authFetch(`${API_BASE_URL}/addresses/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(typeof err === "object" ? Object.values(err).flat().join(" ") : "Failed to create address");
  }
  return await res.json();
}

export async function updateAddress(id: number, data: Partial<AddressInput>): Promise<Address> {
  const res = await authFetch(`${API_BASE_URL}/addresses/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(typeof err === "object" ? Object.values(err).flat().join(" ") : "Failed to update address");
  }
  return await res.json();
}

export async function deleteAddress(id: number): Promise<void> {
  const res = await authFetch(`${API_BASE_URL}/addresses/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete address");
}

// ──────────────────────────────────────
// Authenticated API — Profile
// ──────────────────────────────────────

export async function fetchProfile(): Promise<User> {
  const res = await authFetch(`${API_BASE_URL}/profile/`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}

export async function updateProfile(data: { first_name?: string; phone_number?: string }): Promise<User> {
  const res = await authFetch(`${API_BASE_URL}/profile/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(typeof err === "object" ? Object.values(err).flat().join(" ") : "Failed to update profile");
  }
  return await res.json();
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}): Promise<{ detail: string }> {
  const res = await authFetch(`${API_BASE_URL}/change-password/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(typeof err === "object" ? Object.values(err).flat().join(" ") : "Failed to change password");
  }
  return await res.json();
}

export type { User, AuthTokens, AuthResponse, SignupData, LoginData };

// ──────────────────────────────────────
// Search API (combined backend search)
// ──────────────────────────────────────

export interface SearchResults {
  products: Product[];
  stores: Store[];
  categories: Category[];
}

export async function searchAll(query: string): Promise<SearchResults> {
  const res = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search");
  return await res.json();
}
