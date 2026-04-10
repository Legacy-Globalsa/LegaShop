const API_BASE_URL = "http://127.0.0.1:8000/api";

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
// Authenticated fetch helper
// ──────────────────────────────────────

async function authFetch(url: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
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
// Public API — Products
// ──────────────────────────────────────

export async function fetchProducts(params?: Record<string, string>): Promise<Product[]> {
  try {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    const res = await fetch(`${API_BASE_URL}/products/${query}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const { mockProducts } = await import("./mock-data");
    return mockProducts;
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}/`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const { mockProducts } = await import("./mock-data");
    return mockProducts.find((p) => p.id === id) ?? null;
  }
}

export async function fetchDeals(dealType: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/deals/?deal_type=${dealType}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const { mockProducts } = await import("./mock-data");
    return mockProducts.filter((p) => p.is_deal && p.deal_type === dealType);
  }
}

// ──────────────────────────────────────
// Public API — Categories
// ──────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const { mockCategories } = await import("./mock-data");
    return mockCategories;
  }
}

// ──────────────────────────────────────
// Public API — Stores
// ──────────────────────────────────────

export async function fetchStores(): Promise<Store[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/stores/`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const { mockStores } = await import("./mock-data");
    return mockStores;
  }
}

export async function fetchStoreById(id: number): Promise<Store | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/stores/${id}/`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const { mockStores } = await import("./mock-data");
    return mockStores.find((s) => s.id === id) ?? null;
  }
}

// ──────────────────────────────────────
// Public API — Reviews
// ──────────────────────────────────────

export async function fetchProductReviews(productId: number): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/reviews/`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchStoreReviews(storeId: number): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/stores/${storeId}/reviews/`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

// ──────────────────────────────────────
// Authenticated API — Orders
// ──────────────────────────────────────

export async function fetchOrders() {
  const res = await authFetch(`${API_BASE_URL}/orders/`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return await res.json();
}

export async function fetchOrderById(id: number) {
  const res = await authFetch(`${API_BASE_URL}/orders/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch order");
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
  try {
    const res = await authFetch(`${API_BASE_URL}/addresses/`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    const { mockAddresses } = await import("./mock-data");
    return mockAddresses.map((a) => ({ ...a, created_at: new Date().toISOString() }));
  }
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

