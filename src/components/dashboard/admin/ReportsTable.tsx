// src/components/admin/ReportsTable.tsx
"use client";

import { useEffect, useState } from "react";
import {
  fetchAdminReports,
  setAdminReportStatus,
  type AdminReport,
} from "@/services/dashboardAdmin";

export default function ReportsTable() {
  const [rows, setRows] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminReports().then((r) => {
      setRows(r);
      setLoading(false);
    });
  }, []);

  const setStatus = async (id: string, status: "open" | "resolved" | "dismissed") => {
    await setAdminReportStatus(id, status);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white">
      <h3 className="font-semibold mb-3">Image Reports</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-white/10">
            <tr className="[&>th]:py-2">
              <th>ID</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:py-2">
            {loading && (
              <tr><td colSpan={5} className="py-6 text-center opacity-70">Loading…</td></tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r.id} className="border-b border-white/5">
                <td className="font-mono">{r.id}</td>
                <td>{r.reason ?? "-"}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>{r.status}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => setStatus(r.id, "resolved")}
                    className="px-2 py-1 rounded-lg border border-white/20 hover:border-white"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => setStatus(r.id, "dismissed")}
                    className="px-2 py-1 rounded-lg border border-white/20 hover:border-white"
                  >
                    Dismiss
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center opacity-70">No reports</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
