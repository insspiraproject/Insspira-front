"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
  FiHome,
  FiTrendingUp,
  FiInfo,
  FiZap,
  FiLayout,
  FiUser,
} from "react-icons/fi";

// TODO: reemplaza por tu auth real (contexto o hook)
const isAuthenticated = true;

function cx(...classes: (string | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Derivamos contexto de ruta (determinístico, apto para SSR)
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard/admin");
  const isUserDashboard = pathname.startsWith("/dashboard") && !isAdminRoute;
  const atLogin = pathname === "/login";
  const atRegister = pathname === "/register";

  // UI móvil (solo afecta interacciones en cliente; el HTML base es estable)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const logout = () => {
    // Implementa tu cierre de sesión real (cookies/storage)
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="w-full border-b border-white/10 bg-[linear-gradient(to_right,rgba(28,22,62,.9)_0%,rgba(116,53,150,.85)_40%,rgba(116,53,150,.85)_60%,rgba(28,22,62,.9)_100%)] backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-blanco)] text-[var(--color-violeta)] font-bold text-[10px] sm:text-[11px]"
              aria-label="Insspira - Inicio"
            >
              Logo
            </Link>
            <Link href="/" className="text-base sm:text-xl md:text-2xl font-semibold text-[var(--color-blanco)]">
              Insspira
            </Link>
            <span
              className={cx(
                "ml-2 inline-flex items-center rounded-full border border-white/20 px-2 py-0.5 text-[10px] sm:text-xs text-white/90",
                !isAdminRoute && "hidden"
              )}
            >
              <FiLayout className="mr-1" /> Admin
            </span>
          </div>

          {/* Search (desktop siempre visible) */}
          <div className="hidden md:flex items-center min-w-[300px] max-w-xl flex-1 mx-4">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                placeholder="Buscar inspiración..."
                className="w-full pl-10 pr-3 h-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Acciones derecha */}
          <div className="flex items-center gap-2">
            {/* Toggle search móvil */}
            <button
              onClick={() => {
                setMobileSearchOpen((v) => !v);
                setMobileOpen(false);
              }}
              className="md:hidden p-2 rounded-lg border border-white/15 text-white hover:border-white/30"
              aria-label="Buscar"
              title="Buscar"
            >
              <FiSearch />
            </button>

            {/* Nav principal desktop (siempre) */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
              >
                <span className="inline-flex items-center gap-1">
                  <FiHome /> Feed
                </span>
              </Link>
              <Link
                href="/trending"
                className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
              >
                <span className="inline-flex items-center gap-1">
                  <FiTrendingUp /> Tendencias
                </span>
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
              >
                <span className="inline-flex items-center gap-1">
                  <FiInfo /> About
                </span>
              </Link>
              <Link
                href="/pricing"
                className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
              >
                <span className="inline-flex items-center gap-1">
                  <FiZap /> Precios
                </span>
              </Link>
            </nav>

            {/* CTAs (desktop) — todos los bloques están presentes; se ocultan con `hidden` */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Admin */}
              <div className={cx(!isAdminRoute && "hidden", "flex items-center gap-2")}>
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
                >
                  <span className="inline-flex items-center gap-1">
                    <FiLayout /> Panel Admin
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm"
                >
                  <span className="inline-flex items-center gap-1">
                    <FiLogOut /> Cerrar sesión
                  </span>
                </button>
              </div>

              {/* User Dashboard */}
              <div className={cx(!isUserDashboard && "hidden", "flex items-center gap-2")}>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
                >
                  <span className="inline-flex items-center gap-1">
                    <FiUser /> Mi dashboard
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm"
                >
                  <span className="inline-flex items-center gap-1">
                    <FiLogOut /> Cerrar sesión
                  </span>
                </button>
              </div>

              {/* Pública con sesión */}
              <div
                className={cx(
                  (isAdminRoute || isUserDashboard || !isAuthenticated) && "hidden",
                  "flex items-center gap-2"
                )}
              >
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
                >
                  <span className="inline-flex items-center gap-1">
                    <FiUser /> Mi dashboard
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm"
                >
                  <span className="inline-flex items-center gap-1">
                    <FiLogOut /> Cerrar sesión
                  </span>
                </button>
              </div>

              {/* Pública sin sesión (incluye /login y /register, con variaciones mínimas) */}
              <div
                className={cx(
                  (isAdminRoute || isUserDashboard || isAuthenticated) && "hidden",
                  "flex items-center gap-2"
                )}
              >
                {/* En /login, mostramos Inicio + Registrarse */}
                <Link
                  href={atLogin ? "/" : "/login"}
                  className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
                >
                  {atLogin ? "Inicio" : "Iniciar sesión"}
                </Link>
                <Link
                  href={atRegister ? "/login" : "/register"}
                  className="px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm"
                >
                  {atRegister ? "Iniciar sesión" : "Registrarse"}
                </Link>
              </div>
            </div>

            {/* Hamburguesa */}
            <button
              onClick={() => {
                setMobileOpen((v) => !v);
                setMobileSearchOpen(false);
              }}
              className="md:hidden p-2 rounded-lg border border-white/15 text-white hover:border-white/40"
              aria-label="Menú"
              title="Menú"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Search móvil (panel) */}
        <div className={cx(!mobileSearchOpen && "hidden", "md:hidden px-3 sm:px-4 md:px-6 pb-3")}>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              placeholder="Buscar inspiración..."
              className="w-full pl-10 pr-3 h-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Drawer móvil (links + CTAs). Misma estrategia: todos los bloques existen; se ocultan por clase */}
        <div className={cx(!mobileOpen && "hidden", "md:hidden px-3 sm:px-4 md:px-6 pb-3")}>
          <nav className="grid gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <FiHome /> Feed
              </span>
            </Link>
            <Link
              href="/trending"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <FiTrendingUp /> Tendencias
              </span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <FiInfo /> About
              </span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <FiZap /> Precios
              </span>
            </Link>

            {/* ADMIN móvil */}
            <div className={cx(!isAdminRoute && "hidden", "grid gap-2")}>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-left px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <FiLayout /> Panel Admin
                </span>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="text-left px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <FiLogOut /> Cerrar sesión
                </span>
              </button>
            </div>

            {/* USER móvil */}
            <div className={cx(!isUserDashboard && "hidden", "grid gap-2")}>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="text-left px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <FiUser /> Mi dashboard
                </span>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="text-left px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <FiLogOut /> Cerrar sesión
                </span>
              </button>
            </div>

            {/* PÚBLICA con sesión móvil */}
            <div
              className={cx(
                (isAdminRoute || isUserDashboard || !isAuthenticated) && "hidden",
                "grid gap-2"
              )}
            >
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="text-left px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <FiUser /> Mi dashboard
                </span>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="text-left px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <FiLogOut /> Cerrar sesión
                </span>
              </button>
            </div>

            {/* PÚBLICA sin sesión móvil (incluye /login y /register) */}
            <div
              className={cx(
                (isAdminRoute || isUserDashboard || isAuthenticated) && "hidden",
                "grid gap-2"
              )}
            >
              <Link
                href={atLogin ? "/" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm"
              >
                {atLogin ? "Inicio" : "Iniciar sesión"}
              </Link>
              <Link
                href={atRegister ? "/login" : "/register"}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm"
              >
                {atRegister ? "Iniciar sesión" : "Registrarse"}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
