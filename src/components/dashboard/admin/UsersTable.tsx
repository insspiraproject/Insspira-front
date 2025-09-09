// src/components/admin/UsersTable.tsx
"use client";

import { managedUsers } from "@/mocks/adminMocks";
import Image from "next/image";
import { useMemo, useState } from "react";


export default function UsersTable() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState(managedUsers);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(
      (u) =>
        u.name.toLowerCase().includes(t) ||
        u.username.toLowerCase().includes(t) ||
        u.email.toLowerCase().includes(t)
    );
  }, [q, rows]);

  const toggleStatus = (id: string) => {
    setRows((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
      )
    );
  };

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Usuarios</h3>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none"
        />
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-white/10">
            <tr className="[&>th]:py-2">
              <th>Usuario</th>
              <th>Correo</th>
              <th>Plan</th>
              <th>Posts</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:py-2">
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="flex items-center gap-2">
                  <Image
                    src={u.avatar}
                    alt={u.name}
                    width={32}
                    height={32}
                    className="size-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs opacity-80">@{u.username}</div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.plan}</td>
                <td>{u.posts}</td>
                <td>{u.status}</td>
                <td>
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="px-3 py-1.5 rounded-lg border border-white/20 hover:border-white"
                  >
                    {u.status === "active" ? "Suspender" : "Reactivar"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center opacity-70">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
