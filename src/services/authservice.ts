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

export type RegisterResponse = LoginResponse;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

/* ================= helpers ================= */

interface JWTPayload {
  sub?: string;
  email?: string;
  name?: string;
  isAdmin?: boolean;
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

    const url = `${API_BASE}/users/${id}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }, // 👈 NECESARIO
      credentials: "include",
    });

    console.log("[authservice.getUserFromToken] GET", url, "status:", res.status);

    if (!res.ok) {
      const txt = await res.text();
      console.log("[authservice.getUserFromToken] body:", txt);
      return null;
    }

    const u = (await res.json()) as APIUser;
    const authUser: AuthUser = {
      id: u.id,
      name: u.name ?? u.username ?? u.email,
      email: u.email,
      role: u.isAdmin ? "admin" : "user",
    };
    console.log("[authservice.getUserFromToken] resolved user:", authUser);
    return authUser;
  } catch (e) {
    console.log("[authservice.getUserFromToken] error:", e);
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
  const t = (data as Record<string, unknown>).accessToken ?? (data as Record<string, unknown>).token;
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

/* ================= Auth local ================= */

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

export function loginWithAuth0(): void {
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const RETURN_TO = process.env.NEXT_PUBLIC_RETURN_TO || 'http://localhost:3001/dashboard';
  // antes llamabas a /login; ahora a /start-login
  window.location.href = `${API_BASE}/start-login?returnTo=${encodeURIComponent(RETURN_TO)}`;
}

export const LoginUser = async (userData: LoginFormValues) => {
  const { ok, data, error } = await postJSON<LoginFormValues>(`${API_BASE}/auth/login`, userData);
  if (!ok) { toast.error(error ?? "Login failed"); return null; }

  const accessToken = pickToken(data);
  let user: AuthUser | undefined;

  if (accessToken) {
    // rol from token
    const payload = decodeJwtPayload(accessToken);
    const isAdmin = !!payload?.isAdmin;

    // trae datos del user para name/email, pero el rol lo fija el token
    const apiUser = await getUserFromToken(accessToken); // usa Authorization ya
    user = apiUser ? { ...apiUser, role: isAdmin ? "admin" : "user" } :
                     (payload?.sub && payload?.email) ? { id: payload.sub, name: payload.name ?? payload.email, email: payload.email, role: isAdmin ? "admin" : "user" } :
                     undefined;
  }

  toast.success("User logged successfully!");
  return { token: accessToken, user };
};

/* ============= Soporte Auth0: login + guardado token de callback ============= */
// Guarda ?token=... (callback de Auth0) y actualiza el AuthContext con setAuth
export async function saveTokenFromQueryAndHydrateAuth(
  setAuth: (user: AuthUser | null, token: string | null) => void
): Promise<void> {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  if (!token) return;

  const payload = decodeJwtPayload(token);
  console.log("[saveTokenFromQuery] token payload:", payload);

  localStorage.setItem("auth:token", token);
  const user = await getUserFromToken(token); // ← ahora trae Authorization
  console.log("[saveTokenFromQuery] user from API:", user);

  if (user) localStorage.setItem("auth:user", JSON.stringify(user));
  setAuth(user ?? null, token);

  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url.toString());
}

/* ================= getMe() para tu hook useUser ================= */

interface MeResponse {
  user?: APIUser | null;          // devuelto por tu /auth/me cuando hay sesión
  oidcUser?: { sub?: string; email?: string; name?: string } | null; // opcional en tu back
  message?: string;
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    // soporta ambas claves que usas en el front
    const token =
      (typeof window !== "undefined" && (localStorage.getItem("auth:token") || localStorage.getItem("token"))) ||
      null;

    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      credentials: "include", // por si tu back usa cookie de Auth0
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const data = await safeJson<MeResponse>(res);
    // si el back retorna un 'user' ya normalizado
    if (data?.user) {
      const u = data.user;
      return {
        id: u.id,
        name: u.name ?? u.username ?? u.email,
        email: u.email,
        role: u.isAdmin ? "admin" : "user",
      };
    }

    // fallback: si tenemos token, decodificamos y completamos llamando /users/:id
    if (token) {
      const user = await getUserFromToken(token);
      if (user) return user;
    }

    return null;
  } catch {
    return null;
  }
}
