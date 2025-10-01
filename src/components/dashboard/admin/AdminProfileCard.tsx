// src/components/admin/AdminProfileCard.tsx
"use client";
import { useAuth } from "@/context/AuthContext";

export default function AdminProfileCard() {
  const { user } = useAuth(); // ← viene de localStorage/AuthContext

  if (!user) return null;

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white flex items-center gap-4">
      <div>
        <div className="text-lg font-semibold">{user.name}</div>
        <div className="text-sm opacity-80">{user.email}</div>
        <div className="text-sm mt-1">
          Role: <span className="font-medium">{user.role ?? "user"}</span>
        </div>
      </div>
    </section>
  );
}
