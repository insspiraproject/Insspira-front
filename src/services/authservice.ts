import { LoginFormValues } from "@/validators/LoginSchema";
import { RegisterFormValues } from "@/validators/RegisterSchema";
import { toast } from "react-toastify";

/** ====== Tipos de dominio ====== */
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
  // permite campos extra sin forzar any
  [k: string]: unknown;
}

export interface RegisterResponse {
  token?: string;
  user?: AuthUser;
  message?: string;
  [k: string]: unknown;
}

/** ====== Config ====== */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

/** ====== Helpers sin any ====== */
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function postJSON<TReq, TRes>(
  url: string,
  body: TReq
): Promise<{ ok: boolean; status: number; data: TRes | null; error?: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // si vas a usar cookies/sesiones del backend, activa:
    // credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await safeJson<TRes>(res);

  if (!res.ok) {
    const maybeMsg =
      data && typeof data === "object" && "message" in data
        ? (data as { message?: unknown }).message
        : undefined;

    const error =
      typeof maybeMsg === "string" && maybeMsg.trim().length > 0
        ? maybeMsg
        : res.statusText || "Request failed";

    return { ok: false, status: res.status, data, error };
  }

  return { ok: true, status: res.status, data };
}

/** ====== Services ====== */
export const RegisterUser = async (
  userData: RegisterFormValues
): Promise<RegisterResponse | null> => {
  try {
    const { ok, data, error } = await postJSON<RegisterFormValues, RegisterResponse>(
      `${API_BASE}/auth/register`,
      userData
    );

    if (!ok) {
      toast.error(error ?? "Registration failed");
      return null;
    }

    toast.success("User registered successfully!");
    return data;
  } catch (err: unknown) {
    const msg = getErrorMessage(err);
    console.error("Registration error:", msg);
    toast.error(msg || "Something went wrong during registration");
    return null;
  }
};

export const LoginUser = async (
  userData: LoginFormValues
): Promise<LoginResponse | null> => {
  try {
    const { ok, data, error } = await postJSON<LoginFormValues, LoginResponse>(
      `${API_BASE}/auth/login`,
      userData
    );

    if (!ok) {
      toast.error(error ?? "Login failed");
      return null;
    }

    toast.success("User logged successfully!");
    return data;
  } catch (err: unknown) {
    const msg = getErrorMessage(err);
    console.error("Login error:", msg);
    toast.error(msg || "Something went wrong during login");
    return null;
  }
};
