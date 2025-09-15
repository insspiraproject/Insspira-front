// import { LoginFormValues } from "@/validators/LoginSchema";
// import { RegisterFormValues } from "@/validators/RegisterSchema";
// import { toast } from "react-toastify";
// import axios from "axios"
// /** ====== Tipos de dominio ====== */
// export type UserRole = "admin" | "user";

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role?: UserRole;
// }

// export interface LoginResponse {
//   token?: string;
//   user?: AuthUser;
//   message?: string;
//   // permite campos extra sin forzar any
//   [k: string]: unknown;
// }

// export interface RegisterResponse {
//   token?: string;
//   user?: AuthUser;
//   message?: string;
//   [k: string]: unknown;
// }

// /** ====== Config ====== */
// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

// /** ====== Helpers sin any ====== */
// function getErrorMessage(err: unknown): string {
//   if (err instanceof Error) return err.message;
//   return "Unexpected error";
// }

// async function safeJson<T>(res: Response): Promise<T | null> {
//   const text = await res.text();
//   if (!text) return null;
//   try {
//     return JSON.parse(text) as T;
//   } catch {
//     return null;
//   }
// }

// async function postJSON<TReq, TRes>(
//   url: string,
//   body: TReq
// ): Promise<{ ok: boolean; status: number; data: TRes | null; error?: string }> {
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     // si vas a usar cookies/sesiones del backend, activa:
//     // credentials: "include",
//     body: JSON.stringify(body),
//   });

//   const data = await safeJson<TRes>(res);

//   if (!res.ok) {
//     const maybeMsg =
//       data && typeof data === "object" && "message" in data
//         ? (data as { message?: unknown }).message
//         : undefined;

//     const error =
//       typeof maybeMsg === "string" && maybeMsg.trim().length > 0
//         ? maybeMsg
//         : res.statusText || "Request failed";

//     return { ok: false, status: res.status, data, error };
//   }

//   return { ok: true, status: res.status, data };
// }

// /** ====== Services ====== */
// export const RegisterUser = async (
//   userData: RegisterFormValues
// ): Promise<RegisterResponse | null> => {
//   try {
//     const { ok, data, error } = await postJSON<RegisterFormValues, RegisterResponse>(
//       `${API_BASE}/auth/register`,
//       userData
//     );

//     if (!ok) {
//       toast.error(error ?? "Registration failed");
//       return null;
//     }

//     toast.success("User registered successfully!");
//     return data;
//   } catch (err: unknown) {
//     const msg = getErrorMessage(err);
//     console.error("Registration error:", msg);
//     toast.error(msg || "Something went wrong during registration");
//     return null;
//   }
// };

// export const LoginUser = async (
//   userData: LoginFormValues
// ): Promise<LoginResponse | null> => {
//   try {
//     const { ok, data, error } = await postJSON<LoginFormValues, LoginResponse>(
//       `${API_BASE}/auth/login`,
//       userData
//     );

//     if (!ok) {
//       toast.error(error ?? "Login failed");
//       return null;
//     }

//     toast.success("User logged successfully!");
//     return data;
//   } catch (err: unknown) {
//     const msg = getErrorMessage(err);
//     console.error("Login error:", msg);
//     toast.error(msg || "Something went wrong during login");
//     return null;
//   }
// };


// const api = axios.create({
//   baseURL: API_BASE,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("app_token");
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export function login() {
//   window.location.href = `${API_BASE}/login`;
// }

// export async function logoutLocal() {
//   localStorage.removeItem("app_token");
//   try {
//     await api.post("/auth/logout");
//   } catch (err) {
//     console.warn("No se pudo avisar al backend del logout", err);
//   }
// }

// export async function getMe() {
//   try {
//     const res = await api.get("/auth/me");
//     return res.data.user;
//   } catch (err: any) {
//     throw new Error(err.response?.data?.error || "Error obteniendo usuario");
//   }
// }


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

async function postJSON<TReq, TRes>(url: string, body: TReq) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, status: res.status, data, error: data?.message || res.statusText };
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