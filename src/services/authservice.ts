// src/services/authservice.ts
import { LoginFormValues } from "@/validators/LoginSchema";
import { RegisterFormValues } from "@/validators/RegisterSchema";
import { toast } from "react-toastify";

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
  [k: string]: unknown;
}

// ✅ usa type alias en lugar de una interfaz vacía que extiende de otra
export type RegisterResponse = LoginResponse;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

// --- helpers ---
interface JWTPayload {
  sub?: string;
  email?: string;
  name?: string;
  [k: string]: unknown;
}

function decodeJwtPayload(token: string): JWTPayload | null {
  try {
    const base = token.split(".")[1];
    if (!base) return null;
    const b64 = base.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    const json = decodeURIComponent(
      Array.prototype.map
        .call(atob(padded), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as JWTPayload;
  } catch {
    return null;
  }
}

type APIUser = {
  id: string;
  name?: string | null;
  username?: string | null;
  email: string;
  isAdmin?: boolean;
};

async function getUserFromToken(accessToken: string): Promise<AuthUser | null> {
  try {
    const payload = decodeJwtPayload(accessToken);
    const id = payload?.sub;
    if (!id) return null;

    const res = await fetch(`${API_BASE}/users/${id}`);
    if (!res.ok) return null;
    const u = (await res.json()) as APIUser;
    return {
      id: u.id,
      name: u.name ?? u.username ?? u.email,
      email: u.email,
      role: u.isAdmin ? "admin" : "user",
    };
  } catch {
    return null;
  }
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

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function pickMessage(data: unknown, fallback: string): string {
  if (isRecord(data) && typeof data.message === "string") return data.message;
  return fallback;
}

function pickToken(data: unknown): string | undefined {
  if (!isRecord(data)) return undefined;
  const t = data.accessToken ?? data.token;
  return typeof t === "string" ? t : undefined;
}

async function postJSON<TReq, TRes = unknown>(
  url: string,
  body: TReq
): Promise<{ ok: boolean; status: number; data: TRes | null; error?: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await safeJson<TRes>(res);

  if (!res.ok) {
    const msg = pickMessage(data, res.statusText || "Request failed");
    return { ok: false, status: res.status, data, error: String(msg) };
  }
  return { ok: true, status: res.status, data };
}

// --- SERVICES ---
export const RegisterUser = async (
  userData: RegisterFormValues
): Promise<RegisterResponse | null> => {
  try {
    const { ok, data, error } = await postJSON<RegisterFormValues>(`${API_BASE}/auth/register`, userData);
    if (!ok) {
      toast.error(error ?? "Registration failed");
      return null;
    }

    const accessToken = pickToken(data);
    const user: AuthUser | undefined =
      accessToken ? (await getUserFromToken(accessToken)) ?? undefined : undefined;

    toast.success("User registered successfully!");
    return { token: accessToken, user };
  } catch (err: unknown) {
    toast.error((err as Error)?.message || "Something went wrong during registration");
    return null;
  }
};

export const LoginUser = async (
  userData: LoginFormValues
): Promise<LoginResponse | null> => {
  try {
    const { ok, data, error } = await postJSON<LoginFormValues>(`${API_BASE}/auth/login`, userData);
    if (!ok) {
      toast.error(error ?? "Login failed");
      return null;
    }

    const accessToken = pickToken(data);
    const user: AuthUser | undefined =
      accessToken ? (await getUserFromToken(accessToken)) ?? undefined : undefined;

    toast.success("User logged successfully!");
    return { token: accessToken, user };
  } catch (err: unknown) {
    toast.error((err as Error)?.message || "Something went wrong during login");
    return null;
  }
};
