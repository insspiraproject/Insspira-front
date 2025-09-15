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
import { AuthUser, LoginUser, RegisterUser } from "@/services/authservice";


// === Estado y tipos expuestos ===
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrated: boolean; // útil para evitar parpadeo/hydration issues en UI
  login: (values: LoginFormValues) => Promise<boolean>;
  register: (values: RegisterFormValues) => Promise<boolean>;
  logout: () => void;
  setAuth: (user: AuthUser | null, token: string | null) => void;
}

// === Storage helpers (sin 'any') ===
const USER_KEY = "auth:user";
const TOKEN_KEY = "auth:token";

function readStorage(): AuthState {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const userRaw = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      user: userRaw ? (JSON.parse(userRaw) as AuthUser) : null,
      token: token ?? null,
    };
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
    // ignore
  }
}

// === Contexto ===
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// === Provider ===
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null });
  const [isHydrated, setIsHydrated] = useState(false);

  // hidrata desde localStorage SOLO en el cliente
  useEffect(() => {
    setState(readStorage());
    setIsHydrated(true);
  }, []);

  const setAuth = useCallback((user: AuthUser | null, token: string | null) => {
    setState({ user, token });
    writeStorage({ user, token });
  }, []);

  const login = useCallback(async (values: LoginFormValues) => {
    const res = await LoginUser(values);
    if (!res) return false;

    const token = (res as { token?: string }).token ?? null;
    const user = (res as { user?: AuthUser }).user ?? null;

    setAuth(user, token);
    return Boolean(user || token);
  }, [setAuth]);

  const register = useCallback(async (values: RegisterFormValues) => {
    const res = await RegisterUser(values);
    if (!res) return false;

    const token = (res as { token?: string }).token ?? null;
    const user = (res as { user?: AuthUser }).user ?? null;

    setAuth(user, token);
    return Boolean(user || token);
  }, [setAuth]);

  const logout = useCallback(() => {
    setAuth(null, null);
  }, [setAuth]);

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.user || state.token),
      isAdmin: state.user?.role === "admin",
      isHydrated,
      login,
      register,
      logout,
      setAuth,
    }),
    [state, isHydrated, login, register, logout, setAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// === Hook ===
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
