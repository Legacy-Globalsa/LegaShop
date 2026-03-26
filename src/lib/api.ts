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

export type { User, AuthTokens, AuthResponse, SignupData, LoginData };
