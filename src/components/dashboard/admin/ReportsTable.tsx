// src/components/admin/ReportsTable.tsx
"use client";

import { reports as initialReports } from "@/mocks/adminMocks";
import { useState } from "react";

export default function ReportsTable() {
  const [rows, setRows] = useState(initialReports);

  const setStatus = (id: string, status: "open" | "resolved" | "dismissed") => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white">
      <h3 className="font-semibold mb-3">Reportes de imágenes</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-white/10">
            <tr className="[&>th]:py-2">
              <th>ID</th>
              <th>Post</th>
              <th>Reportado por</th>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:py-2">
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/5">
                <td className="font-mono">{r.id}</td>
                <td>{r.postId}</td>
                <td>{r.reportedBy}</td>
                <td>{r.reason}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>{r.status}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => setStatus(r.id, "resolved")}
                    className="px-2 py-1 rounded-lg border border-white/20 hover:border-white"
                  >
                    Resolver
                  </button>
                  <button
                    onClick={() => setStatus(r.id, "dismissed")}
                    className="px-2 py-1 rounded-lg border border-white/20 hover:border-white"
                  >
                    Desestimar
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center opacity-70">
                  No hay reportes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
