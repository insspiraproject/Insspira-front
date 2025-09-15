'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Search from "@/components/navbar/Search";
import { useSearch } from "@/context/Search/SearchContext";
import { FiMenu, FiX, FiSearch, FiLogOut, FiHome, FiTrendingUp, FiInfo, FiZap, FiLayout, FiUser } from "react-icons/fi";

export const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Hook de búsqueda
  const { performSearch } = useSearch();

  const HIDE_ROUTES = new Set(["/", "/login", "/register"]);
  if (HIDE_ROUTES.has(pathname)) return null;

  const logout = () => {
    router.push("/login");
  };

  const linkBtn = "px-3 py-2 rounded-xl border border-white/15 text-white hover:border-white/40 text-sm";
  const primaryBtn = "px-3 py-2 rounded-xl bg-white text-[var(--color-violeta)] text-sm";

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
            <Search onSearch={performSearch} />
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
              <Link href="/home" className={linkBtn}><FiHome /> Feed</Link>
              <Link href="/trending" className={linkBtn}><FiTrendingUp /> Trending</Link>
              <Link href="/about" className={linkBtn}><FiInfo /> About</Link>
              <Link href="/payments" className={linkBtn}><FiZap /> Pricing</Link>
            </nav>

            {/* CTAs (desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/dashboard" className={linkBtn}><FiUser /> Dashboard</Link>
              <Link href="/dashboard/admin" className={linkBtn}><FiLayout /> Admin</Link>
              <Link href="/login" className={linkBtn}>Log in</Link>
              <Link href="/register" className={primaryBtn}>Sign up</Link>
              <button onClick={logout} className={primaryBtn}>Log out</button>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => {
                setMobileOpen((v) => !v);
                setMobileSearchOpen(false);
              }}
              className="md:hidden p-2 rounded-lg border border-white/15 text-white hover:border-white/40"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 sm:px-4 md:px-6 pb-3">
            {/* Aquí reemplazamos el input crudo por nuestro componente Search */}
            <Search onSearch={performSearch} />
          </div>
        )}

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden px-3 sm:px-4 md:px-6 pb-3">
            <nav className="grid gap-2">
              <Link href="/home" onClick={() => setMobileOpen(false)} className={linkBtn}><FiHome /> Feed</Link>
              <Link href="/trending" onClick={() => setMobileOpen(false)} className={linkBtn}><FiTrendingUp /> Trending</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className={linkBtn}><FiInfo /> About</Link>
              <Link href="/payments" onClick={() => setMobileOpen(false)} className={linkBtn}><FiZap /> Pricing</Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={linkBtn}><FiUser /> Dashboard</Link>
              <Link href="/dashboard/admin" onClick={() => setMobileOpen(false)} className={linkBtn}><FiLayout /> Admin</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className={linkBtn}>Log in</Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className={primaryBtn}>Sign up</Link>
              <button
                onClick={() => { setMobileOpen(false); logout(); }}
                className={primaryBtn}
              >Log out</button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}