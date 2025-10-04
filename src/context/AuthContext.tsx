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
  logoutGoogle
} from "@/services/authservice";
 import { API_BASE } from "@/services/authservice";
// import getUserFromToken from "@/services/authservice";
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

// type JwtPayload = {
//   sub?: string;
//   email?: string;
//   name?: string;
//   isAdmin?: boolean;
// };

// function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
//   try {
//     const [, payload] = token.split(".");
//     if (!payload) return null;
//     const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
//     return JSON.parse(json) as T;
//   } catch {
//     return null;
//   }
// }


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
  const [state, setState] = useState<AuthState>(() => readStorage());
  const [isHydrated, setIsHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const setAuth = useCallback((user: AuthUser | null, token: string | null) => {
    setState({ user, token });
    writeStorage({ user, token });
  }, []);

  // ✅ sincronización multi-tab con localStorage
  useEffect(() => {
    setIsHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY || e.key === TOKEN_KEY) {
        setState(readStorage());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ bootstrap: intentar sesión con cookie (Passport)
  useEffect(() => {
  let cancelled = false;
  setIsChecking(true);

  const fetchUser = async () => {
    try {
      // llama siempre a getMe() para rehidratar sesión desde cookie
      const me = await getMe(); // usa cookie de Passport
      if (!cancelled && me) {
        setAuth(me, state.token); // mantiene token local si existe
      }
    } catch (err) {
      console.error("Auth bootstrap error:", err);
    } finally {
      if (!cancelled) setIsChecking(false);
      if (!cancelled) setIsHydrated(true);
    }
  };

  fetchUser();

  // también revisa query de Google login
  const params = new URLSearchParams(window.location.search);
  if (params.get("googleLogin") === "success") {
    fetchUser(); // fuerza getMe() si viene de redirección Google
  }

  return () => {
    cancelled = true;
  };
}, [setAuth, state.token]);



// useEffect(() => {
//     if (!isHydrated) return;

//     let cancelled = false;

//     const bootstrap = async () => {
//       setIsChecking(true);
//       try {
//         let user: AuthUser | null = null;

//         if (state.token) {
//           // flujo login normal con token
//           user = await getUserFromToken(state.token);
//         }

//         if (!user) {
//           // si no hay token válido, intenta cookie Passport
//           user = await getMe();
//         }

//         if (!cancelled) {
//           setAuth(user, state.token); // si no hay user, será null
//         }
//       } catch (err) {
//         console.error("Auth bootstrap error:", err);
//         if (!cancelled) setAuth(null, null);
//       } finally {
//         if (!cancelled) setIsChecking(false);
//         setIsHydrated(true); // hidrata al final
//       }
//     };

//     bootstrap();

//     return () => {
//       cancelled = true;
//     };
//   }, [isHydrated, state.token, setAuth]);

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
    // 1️⃣ Limpiar estado local siempre
    setAuth(null, null);
     localStorage.removeItem("auth:user");
    localStorage.removeItem("auth:token");
    try {
      // 2️⃣ Logout normal de JWT
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
  
      // 3️⃣ Logout de Google dentro de la app
      const googleSuccess = await logoutGoogle();
      if (!googleSuccess) {
        console.warn("No se pudo cerrar sesión de Google en la app");
      }
    } catch (err) {
      console.warn("Logout error:", err);
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
      isAuthenticated: Boolean(state.user), // ✅ más seguro: requiere user
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