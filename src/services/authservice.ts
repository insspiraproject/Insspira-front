import axios from "axios";
import { toast } from "react-toastify";
import { LoginFormValues } from "@/validators/LoginSchema";
import { RegisterFormValues } from "@/validators/RegisterSchema";

/** ====== Tipos ====== */
export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export interface LoginResponse {
  token?: string;
  user?: AuthUser;
  message?: string;
}

export interface RegisterResponse {
  token?: string;
  user?: AuthUser;
  message?: string;
}

/** ====== Config ====== */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

/** ====== Helpers ====== */
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

// async function postJSON<TReq, Tres>(url: string, body: TReq) {
//   try {
//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });
//     const data = await res.json().catch(() => null);
//     if (!res.ok) {
//       return { ok: false, status: res.status, data, error: data?.any || res.statusText };
//     }
//     return { ok: true, status: res.status, data };
//   } catch (err: unknown) {
//     return { ok: false, status: 500, data: null, error: getErrorMessage(err) };
//   }
// }

interface ApiError {
  message?: string;
}

async function postJSON<TReq, TRes extends ApiError>(url: string, body: TReq): Promise<{ ok: boolean; status: number; data: TRes | null; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null) as TRes | null;

    if (!res.ok) {
      return { 
        ok: false, 
        status: res.status, 
        data, 
        error: data?.message || res.statusText  // ✅ ya no usa 'any'
      };
    }

    return { ok: true, status: res.status, data };
  } catch (err: unknown) {
    return { ok: false, status: 500, data: null, error: getErrorMessage(err) };
  }
}

/** ====== Auth API ====== */
export const RegisterUser = async (userData: RegisterFormValues): Promise<RegisterResponse | null> => {
  const { ok, data, error } = await postJSON<RegisterFormValues, RegisterResponse>(
    `${API_BASE}/auth/register`,
    userData
  );
  if (!ok) toast.error(error || "Registration failed");
  else toast.success("User registered successfully!");
  return data ?? null;
};

export const LoginUser = async (userData: LoginFormValues): Promise<LoginResponse | null> => {
  const { ok, data, error } = await postJSON<LoginFormValues, LoginResponse>(
    `${API_BASE}/auth/login`,
    userData
  );
  if (!ok) toast.error(error || "Login failed");
  else toast.success("Logged in successfully!");
  return data ?? null;
};

/** ====== Axios con JWT ====== */
export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** ====== Login/Logout ====== */
export function login() {
  window.location.href = `${API_BASE}/login`; // Auth0/Google redirect
}

export async function logoutLocal() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  try {
    await api.post(`${API_BASE}/auth/logout`);
  } catch (err) {
    console.warn("Logout backend failed", err);
  }
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    const res = await api.get(`${API_BASE}/auth/me`);
    return res.data.user ?? null;
  } catch {
    return null;
  }
}

/** ====== Guardar token de query param (Auth0) ====== */
export function saveTokenFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("token", token);
    console.log(token)
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}