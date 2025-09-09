// src/components/admin/PaymentsTable.tsx
"use client";

import { adminPayments, managedUsers } from "@/mocks/adminMocks";

export default function PaymentsTable() {
  const rows = adminPayments
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p) => {
      const u = managedUsers.find((x) => x.id === p.userId);
      return { ...p, userName: u?.name ?? p.userId, email: u?.email ?? "" };
    });

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white">
      <h3 className="font-semibold mb-3">Pagos</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-white/10">
            <tr className="[&>th]:py-2">
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Detalle</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:py-2">
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>
                  <div className="font-medium">{p.userName}</div>
                  <div className="text-xs opacity-80">{p.email}</div>
                </td>
                <td>{p.description}</td>
                <td>{p.method}</td>
                <td>{p.status}</td>
                <td>
                  {p.amount} {p.currency}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center opacity-70">
                  No hay pagos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
