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
  token?: string;          // <- normalizado
  user?: AuthUser;         // <- agregado si logramos obtenerlo
  message?: string;
  [k: string]: unknown;
}

export interface RegisterResponse extends LoginResponse {}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

// --- helpers ---
function decodeJwtPayload(token: string): any | null {
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
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function getUserFromToken(accessToken: string): Promise<AuthUser | null> {
  try {
    const payload = decodeJwtPayload(accessToken);
    const id = payload?.sub;
    if (!id) return null;

    // En tu backend /users/:id es público según tu código
    const res = await fetch(`${API_BASE}/users/${id}`);
    if (!res.ok) return null;
    const u = await res.json(); // trae isAdmin
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
  try { return JSON.parse(text) as T; } catch { return null; }
}

async function postJSON<TReq, TRes>(
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
    const msg = (data && typeof data === "object" && (data as any).message) || res.statusText || "Request failed";
    return { ok: false, status: res.status, data, error: String(msg) };
  }
  return { ok: true, status: res.status, data };
}

// --- SERVICES ---
export const RegisterUser = async (userData: RegisterFormValues): Promise<RegisterResponse | null> => {
  try {
    const { ok, data, error } = await postJSON<RegisterFormValues, any>(`${API_BASE}/auth/register`, userData);
    if (!ok) {
      toast.error(error ?? "Registration failed");
      return null;
    }

  const accessToken: string | undefined = data?.accessToken ?? data?.token;
  const user: AuthUser | undefined =
    accessToken ? (await getUserFromToken(accessToken)) ?? undefined : undefined;

    toast.success("User registered successfully!");
    return { token: accessToken, user }; // <- normalizado
  } catch (err: unknown) {
    toast.error((err as Error)?.message || "Something went wrong during registration");
    return null;
  }
};

export const LoginUser = async (userData: LoginFormValues): Promise<LoginResponse | null> => {
  try {
    const { ok, data, error } = await postJSON<LoginFormValues, any>(`${API_BASE}/auth/login`, userData);
    if (!ok) {
      toast.error(error ?? "Login failed");
      return null;
    }

  const accessToken: string | undefined = data?.accessToken ?? data?.token;
  const user: AuthUser | undefined =
    accessToken ? (await getUserFromToken(accessToken)) ?? undefined : undefined;

    toast.success("User logged successfully!");
    return { token: accessToken, user }; // <- normalizado
  } catch (err: unknown) {
    toast.error((err as Error)?.message || "Something went wrong during login");
    return null;
  }
};
