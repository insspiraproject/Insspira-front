// src/components/admin/PaymentsTable.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAdminPayments, type AdminPayment } from "@/services/dashboardAdmin";

export default function PaymentsTable() {
  const [rows, setRows] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminPayments().then((data) => {
      // ordena DESC por fecha
      const sorted = data.slice().sort((a, b) => b.date.localeCompare(a.date));
      setRows(sorted);
      setLoading(false);
    });
  }, []);

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white">
      <h3 className="font-semibold mb-3">Payments</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-white/10">
            <tr className="[&>th]:py-2">
              <th>Date</th>
              <th>User</th>
              <th>Details</th>
              <th>Method</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:py-2">
            {loading && (
              <tr><td colSpan={6} className="py-6 text-center opacity-70">Loading…</td></tr>
            )}
            {!loading && rows.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>
                  <div className="font-medium">{p.userName ?? p.userId ?? "-"}</div>
                  <div className="text-xs opacity-80">{p.email ?? ""}</div>
                </td>
                <td>{p.description}</td>
                <td>{p.method}</td>
                <td>{p.status}</td>
                <td>{p.amount} {p.currency}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center opacity-70">No payments</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
