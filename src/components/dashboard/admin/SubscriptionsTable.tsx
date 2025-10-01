// src/components/admin/SubscriptionsTable.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchAdminSubscriptions, type AdminSubscription } from "@/services/dashboardAdmin";

export default function SubscriptionsTable() {
  const [rows, setRows] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminSubscriptions().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white">
      <h3 className="font-semibold mb-3">Subscriptions</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-white/10">
            <tr className="[&>th]:py-2">
              <th>User</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Start</th>
              <th>Renews</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:py-2">
            {loading && (
              <tr><td colSpan={6} className="py-6 text-center opacity-70">Loading…</td></tr>
            )}
            {!loading && rows.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td>
                  <div className="font-medium">{s.userName}</div>
                  <div className="text-xs opacity-80">{s.email}</div>
                </td>
                <td>{s.plan}</td>
                <td>{s.status}</td>
                <td>{new Date(s.startedAt).toLocaleDateString()}</td>
                <td>{s.renewsAt ? new Date(s.renewsAt).toLocaleDateString() : "-"}</td>
                <td>{s.pricePerMonth} {s.currency}/month</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
