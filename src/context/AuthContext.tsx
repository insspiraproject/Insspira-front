"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LoginFormValues } from "@/validators/LoginSchema";
import type { RegisterFormValues } from "@/validators/RegisterSchema";
import {
  AuthUser,
  LoginUser,
  RegisterUser,
  getMe,
} from "@/services/authservice";
 import { API_BASE } from "@/services/authservice";

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

          // /** 👉 Cookies para que el middleware pueda redirigir estrictamente */
          // function writeCookies(user: AuthUser | null, token: string | null) {
          //   if (typeof document === "undefined") return;
          //   const maxAge = 60 * 60 * 24 * 30; // 30 días
          //   const attrs = `Path=/; Max-Age=${maxAge}; SameSite=Lax${typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : ""}`;

          //   // auth_token (solo señal de sesión para el middleware)
          //   if (token) {
          //     document.cookie = `auth_token=${encodeURIComponent(token)}; ${attrs}`;
          //   } else {
          //     document.cookie = `auth_token=; Path=/; Max-Age=0; SameSite=Lax`;
          //   }

          //   // role (admin | user) — fuente: user.role o, si hay token, del payload
          //   let role: "admin" | "user" | "" = "";
          

          //   if (role) {
          //     document.cookie = `role=${role}; ${attrs}`;
          //   } else {
          //     document.cookie = `role=; Path=/; Max-Age=0; SameSite=Lax`;
          //   }
          // }

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => readStorage());
  const [isHydrated, setIsHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const setAuth = useCallback((user: AuthUser | null, token: string | null) => {
    setState({ user, token });
    writeStorage({ user, token }); // sigue persistiendo si hay token
  }, []);

  // ✅ bootstrap: intentar sesión con cookie
  useEffect(() => {
    let cancelled = false;
    setIsChecking(true);

    (async () => {
      try {
        const me = await getMe(); // usa cookie de passport
        if (!cancelled && me) {
          setAuth(me, null);
        }
      } catch (err) {
        console.error("Auth bootstrap error:", err);
      } finally {
        if (!cancelled) {
          setIsChecking(false);
          setIsHydrated(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setAuth]);

  const login = useCallback(
    async (values: LoginFormValues) => {
      const res = await LoginUser(values);
      if (!res) return false;
      setAuth(res.user ?? null, res.token ?? null);
      return Boolean(res.user || res.token);
    },
    [setAuth]
  );

  const register = useCallback(
    async (values: RegisterFormValues) => {
      const res = await RegisterUser(values);
      if (!res) return false;
      setAuth(res.user ?? null, res.token ?? null);
      return Boolean(res.user || res.token);
    },
    [setAuth]
  );

  const logout = useCallback(async () => {
    setAuth(null, null);
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout cookie error:", err);
    }
  }, [setAuth]);

  const authFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const headers = new Headers(init?.headers ?? {});
      if (state.token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${state.token}`);
      }
      return fetch(input, {
        ...init,
        headers,
        credentials: "include", // 🔑 incluye cookie siempre
      });
    },
    [state.token]
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