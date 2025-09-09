// src/components/admin/AdminSidebar.tsx
"use client";

import { JSX } from "react";
import { FiHome, FiUsers, FiFlag, FiCreditCard, FiBookmark, FiUser, FiLayers } from "react-icons/fi";

type Key = "overview" | "users" | "reports" | "subscriptions" | "payments" | "plans" | "profile";

const items: { key: Key; label: string; icon: JSX.Element }[] = [
  { key: "overview", label: "Overview", icon: <FiHome /> },
  { key: "users", label: "Usuarios", icon: <FiUsers /> },
  { key: "reports", label: "Reportes", icon: <FiFlag /> },
  { key: "subscriptions", label: "Suscripciones", icon: <FiBookmark /> },
  { key: "payments", label: "Pagos", icon: <FiCreditCard /> },
  { key: "plans", label: "Planes", icon: <FiLayers /> },
  { key: "profile", label: "Perfil Admin", icon: <FiUser /> },
];

export type AdminTabKey = typeof items[number]["key"];

export default function AdminSidebar({
  active,
  onChange,
}: {
  active: AdminTabKey;
  onChange: (k: AdminTabKey) => void;
}) {
  return (
    <aside className="w-full md:w-[260px] md:sticky md:top-6 md:h-fit md:shrink-0 self-start bg-white/5 border border-white/10 rounded-2xl p-4 text-white">
      <nav className="space-y-1">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border ${
              active === it.key
                ? "bg-white text-[var(--color-violeta)] border-white"
                : "bg-transparent border-white/10 hover:border-white/30"
            }`}
          >
            <span>{it.icon}</span>
            <span className="text-left">{it.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
