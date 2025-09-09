// src/components/admin/SubscriptionsTable.tsx
"use client";

import { adminSubscriptions, managedUsers } from "@/mocks/adminMocks";

export default function SubscriptionsTable() {
  const rows = adminSubscriptions.map((s) => {
    const user = managedUsers.find((u) => u.id === s.userId);
    return { ...s, userName: user?.name ?? s.userId, email: user?.email ?? "" };
  });

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white">
      <h3 className="font-semibold mb-3">Suscripciones</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-white/10">
            <tr className="[&>th]:py-2">
              <th>Usuario</th>
              <th>Plan</th>
              <th>Estado</th>
              <th>Inicio</th>
              <th>Renueva</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:py-2">
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td>
                  <div className="font-medium">{s.userName}</div>
                  <div className="text-xs opacity-80">{s.email}</div>
                </td>
                <td>{s.plan}</td>
                <td>{s.status}</td>
                <td>{new Date(s.startedAt).toLocaleDateString()}</td>
                <td>{s.renewsAt ? new Date(s.renewsAt).toLocaleDateString() : "-"}</td>
                <td>
                  {s.pricePerMonth} {s.currency}/mes
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
