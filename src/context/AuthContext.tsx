"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import type { LoginFormValues } from "@/validators/LoginSchema";
import type { RegisterFormValues } from "@/validators/RegisterSchema";
import { AuthUser, LoginUser, RegisterUser } from "@/services/authservice";

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrated: boolean;
  isChecking: boolean;
  login: (values: LoginFormValues) => Promise<boolean>;
  register: (values: RegisterFormValues) => Promise<boolean>;
  logout: () => void;
  setAuth: (user: AuthUser | null, token: string | null) => void;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const USER_KEY = "auth:user";
const TOKEN_KEY = "auth:token";

type JwtPayload = {
  sub?: string;
  email?: string;
  name?: string;
  isAdmin?: boolean;
  // agrega aquí otros claims si los usas (exp, iat, etc.)
};

function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function readStorage(): AuthState {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const userRaw = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    return { user: userRaw ? (JSON.parse(userRaw) as AuthUser) : null, token: token ?? null };
  } catch {
    return { user: null, token: null };
  }
}

function writeStorage(next: AuthState) {
  try {
    if (next.user) localStorage.setItem(USER_KEY, JSON.stringify(next.user));
    else localStorage.removeItem(USER_KEY);
    if (next.token) localStorage.setItem(TOKEN_KEY, next.token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null });
  const [isHydrated, setIsHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setState(readStorage());
    setIsHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY || e.key === TOKEN_KEY) {
        setState(readStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAuth = useCallback((user: AuthUser | null, token: string | null) => {
    setState({ user, token });
    writeStorage({ user, token });
  }, []);

  // (opcional) chequeo de token en /auth/me si lo habilitas
  useEffect(() => {
    const check = async () => {
      if (!isHydrated) return;
      setIsChecking(true);
      try {
        // Si tuvieras un endpoint de verificación por Bearer:
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}/auth/me`, {
        //   headers: state.token ? { Authorization: `Bearer ${state.token}` } : undefined,
        // });
        // if (res.ok) { ... }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Auth error:", msg);
      } finally {
        setIsChecking(false);
      }
    };
    check();
  }, [isHydrated]);

  const extractTokenAndUser = (res: unknown): { token: string | null; user: AuthUser | null } => {
    // Acepta token en 'token' o 'accessToken' y un posible 'user'
    const anyRes = res as Record<string, unknown>;
    const token =
      (anyRes?.token as string | undefined) ??
      (anyRes?.accessToken as string | undefined) ??
      null;

    let user = (anyRes?.user as AuthUser | undefined) ?? null;

    // Si no viene user, intenta decodificar el JWT para armar uno básico
    if (!user && token) {
      const payload = decodeJwt<JwtPayload>(token) ?? {};
      user = {
        id: payload.sub ?? "",
        email: payload.email ?? "",
        name: payload.name ?? (payload.email?.split?.("@")[0] ?? "User"),
        role: payload.isAdmin ? "admin" : "user",
      };
    }

    return { token, user };
  };

  const login = useCallback(
    async (values: LoginFormValues) => {
      const res = await LoginUser(values);
      if (!res) return false;
      const { token, user } = extractTokenAndUser(res);
      setAuth(user, token);
      return Boolean(user || token);
    },
    [setAuth]
  );

  const register = useCallback(
    async (values: RegisterFormValues) => {
      const res = await RegisterUser(values);
      if (!res) return false;
      const { token, user } = extractTokenAndUser(res);
      setAuth(user, token);
      return Boolean(user || token);
    },
    [setAuth]
  );

  const logout = useCallback(() => {
    setAuth(null, null);
  }, [setAuth]);

  // fetch autenticado tipado
  const authFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const headers = new Headers(init?.headers ?? {});
      const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return fetch(input, { ...init, headers });
    },
    []
  );

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.user || state.token),
      isAdmin: state.user?.role === "admin",
      isHydrated,
      isChecking,
      login,
      register,
      logout,
      setAuth,
      authFetch,
    }),
    [state, isHydrated, isChecking, login, register, logout, setAuth, authFetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
