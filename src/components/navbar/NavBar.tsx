// src/components/navbar/NavBar.tsx
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

export default function NavBar() {
  const pathname = usePathname();          // <-- hooks SIEMPRE antes de returns
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Ocultar en estas rutas (se decide DESPUÉS de llamar hooks)
  const HIDE_ROUTES = new Set(["/", "/login", "/register"]);
  if (HIDE_ROUTES.has(pathname)) return null;

  const logout = () => {
    // TODO: integra tu logout real cuando tengas auth
    router.push("/login");
  };

  const linkBtn =
    "px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm";
  const primaryBtn =
    "px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm";

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
            <Link
              href="/"
              className="text-base sm:text-xl md:text-2xl font-semibold text-[var(--color-blanco)]"
            >
              Insspira
            </Link>
          </div>

          {/* Search (desktop) */}
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

            {/* Nav principal (desktop) */}
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/" className={linkBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiHome /> Feed
                </span>
              </Link>
              <Link href="/trending" className={linkBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiTrendingUp /> Tendencias
                </span>
              </Link>
              <Link href="/about" className={linkBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiInfo /> About
                </span>
              </Link>
              <Link href="/pricing" className={linkBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiZap /> Precios
                </span>
              </Link>
            </nav>

            {/* CTAs (desktop) — por ahora TODAS visibles */}
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/dashboard" className={linkBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiUser /> Mi dashboard
                </span>
              </Link>
              <Link href="/admin" className={linkBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiLayout /> Panel Admin
                </span>
              </Link>
              <Link href="/login" className={linkBtn}>
                Iniciar sesión
              </Link>
              <Link href="/register" className={primaryBtn}>
                Registrarse
              </Link>
              <button onClick={logout} className={primaryBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiLogOut /> Cerrar sesión
                </span>
              </button>
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

        {/* Search móvil */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 sm:px-4 md:px-6 pb-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                placeholder="Buscar inspiración..."
                className="w-full pl-10 pr-3 h-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 outline-none focus:border-white/30"
              />
            </div>
          </div>
        )}

        {/* Drawer móvil */}
        {mobileOpen && (
          <div className="md:hidden px-3 sm:px-4 md:px-6 pb-3">
            <nav className="grid gap-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className={linkBtn}>
                <span className="inline-flex items-center gap-2">
                  <FiHome /> Feed
                </span>
              </Link>
              <Link href="/trending" onClick={() => setMobileOpen(false)} className={linkBtn}>
                <span className="inline-flex items-center gap-2">
                  <FiTrendingUp /> Tendencias
                </span>
              </Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className={linkBtn}>
                <span className="inline-flex items-center gap-2">
                  <FiInfo /> About
                </span>
              </Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className={linkBtn}>
                <span className="inline-flex items-center gap-2">
                  <FiZap /> Precios
                </span>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={linkBtn}>
                <span className="inline-flex items-center gap-2">
                  <FiUser /> Mi dashboard
                </span>
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)} className={linkBtn}>
                <span className="inline-flex items-center gap-2">
                  <FiLayout /> Panel Admin
                </span>
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className={linkBtn}>
                Iniciar sesión
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className={primaryBtn}>
                Registrarse
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className={primaryBtn}
              >
                <span className="inline-flex items-center gap-2">
                  <FiLogOut /> Cerrar sesión
                </span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
