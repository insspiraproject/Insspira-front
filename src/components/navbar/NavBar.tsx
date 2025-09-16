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
  FiZap,
  FiLayout,
  FiUser,
  FiPlus,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { isHydrated, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isHydrated) return null;

  const HIDE_ROUTES = new Set(["/", "/login", "/register"]);
  if (HIDE_ROUTES.has(pathname)) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
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
              className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-blanco)] text-[var(--color-violeta)] font-[lora] text-[10px] sm:text-[11px]"
              aria-label="Insspira - Home"
            >
              Logo
            </Link>
            <Link
              href="/"
              className="text-base sm:text-xl md:text-2xl font-[lora] text-[var(--color-blanco)]"
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
                placeholder="Search for inspiration..."
                className="w-full pl-10 pr-3 h-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Toggle mobile search */}
            <button
              onClick={() => {
                setMobileSearchOpen((v) => !v);
                setMobileOpen(false);
              }}
              className="md:hidden p-2 rounded-lg border border-white/15 text-white hover:border-white/30"
              aria-label="Search"
              title="Search"
            >
              <FiSearch />
            </button>

            {/* Main nav (desktop) */}
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/home" className={linkBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiHome /> Feed
                </span>
              </Link>
              <Link href="/payments" className={linkBtn}>
                <span className="inline-flex items-center gap-1">
                  <FiZap /> Pricing
                </span>
              </Link>

              {isAuthenticated && (
               <>
                <Link href="/dashboard" className={linkBtn}>
                  <span className="inline-flex items-center gap-1">
                    <FiUser /> My Dashboard
                  </span>
                </Link>
                <Link href="/uploadPin" className={linkBtn}>
                  <span className="inline-flex items-center gap-1">
                    <FiPlus /> Create pin
                  </span>
                </Link>
               </> 
              )}
              {isAuthenticated && isAdmin && (
                <Link href="/admin" className={linkBtn}>
                  <span className="inline-flex items-center gap-1">
                    <FiLayout /> Admin Panel
                  </span>
                </Link>
              )}
            </nav>

            {/* CTAs (desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className={linkBtn}>
                    Log in
                  </Link>
                  <Link href="/register" className={primaryBtn}>
                    Sign up
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className={primaryBtn}>
                  <span className="inline-flex items-center gap-1">
                    <FiLogOut /> Log out
                  </span>
                </button>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => {
                setMobileOpen((v) => !v);
                setMobileSearchOpen(false);
              }}
              className="md:hidden p-2 rounded-lg border border-white/15 text-white hover:border-white/40"
              aria-label="Menu"
              title="Menu"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 sm:px-4 md:px-6 pb-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                placeholder="Search for inspiration..."
                className="w-full pl-10 pr-3 h-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 outline-none focus:border-white/30"
              />
            </div>
          </div>
        )}

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden px-3 sm:px-4 md:px-6 pb-3">
            <nav className="grid gap-2">
              <Link href="/home" onClick={() => setMobileOpen(false)} className={linkBtn}>
                <span className="inline-flex items-center gap-2">
                  <FiHome /> Feed
                </span>
              </Link>
              <Link href="/payments" onClick={() => setMobileOpen(false)} className={linkBtn}>
                <span className="inline-flex items-center gap-2">
                  <FiZap /> Pricing
                </span>
              </Link>


              {isAuthenticated && (
               <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={linkBtn}>
                  <span className="inline-flex items-center gap-2">
                    <FiUser /> My Dashboard
                  </span>
                </Link>
                <Link href="/uploadPin" onClick={() => setMobileOpen(false)} className={linkBtn}>
                  <span className="inline-flex items-center gap-2">
                    <FiPlus /> Create pin
                  </span>
                </Link>
                </> 
              )}
              {isAuthenticated && isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className={linkBtn}>
                  <span className="inline-flex items-center gap-2">
                    <FiLayout /> Admin Panel
                  </span>
                </Link>
              )}

              {!isAuthenticated ? (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className={linkBtn}>
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className={primaryBtn}>
                    Sign up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className={primaryBtn}
                >
                  <span className="inline-flex items-center gap-2">
                    <FiLogOut /> Log out
                  </span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
