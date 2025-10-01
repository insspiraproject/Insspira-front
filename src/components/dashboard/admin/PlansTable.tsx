"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchAdminPlans,
  toggleAdminPlan,
  upsertAdminPlan,
  updateAdminPlan,
  deleteAdminPlan,
  type AdminPlan,
} from "@/services/dashboardAdmin";
import PlanEditModal from "./PlanEditModal";

export default function PlansTable() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminPlan | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchAdminPlans();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((p) => p.name.toLowerCase().includes(t));
  }, [q, rows]);

  const toggleActive = async (id: string) => {
    const updated = await toggleAdminPlan(id);
    setRows((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: updated.isActive } : p)));
  };

  const savePlan = async (partial: {
    name: string; pricePerMonth: number; currency: 'USD'|'COP'|'ARS'; features: string[]; isActive: boolean;
  }) => {
    if (!editing) return;
    const updated = await updateAdminPlan(editing.id, partial);
    setRows((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...updated } as AdminPlan : p)));
    setEditing(null);
  };

  const addPlan = async () => {
    const created = (await upsertAdminPlan({
      name: "Plus",
      pricePerMonth: 9.99,
      currency: "USD",
      features: ["New feature"],
      isActive: true,
    })) as AdminPlan;

    setRows((prev) => [created, ...prev]);

    const fresh = (await fetchAdminPlans()).find((p) => p.id === created.id);
    setEditing(fresh ?? created);
  };

  const removePlan = async (id: string) => {
    await deleteAdminPlan(id);
    setRows((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Plans</h3>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search plan..."
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none"
          />
          <button onClick={addPlan} className="px-3 py-2 rounded-lg bg-white text-[var(--color-violeta)]">
            Add plan
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-white/10">
            <tr className="[&>th]:py-2">
              <th>Name</th>
              <th>Price</th>
              <th>Currency</th>
              <th>Features</th>
              <th>Active</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:py-2">
            {loading && (
              <tr><td colSpan={7} className="py-6 text-center opacity-70">Loading…</td></tr>
            )}
            {!loading && filtered.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="font-medium">{p.name}</td>
                <td>{p.pricePerMonth}</td>
                <td>{p.currency}</td>
                <td className="max-w-[360px]"><div className="line-clamp-2">{p.features.join(", ")}</div></td>
                <td>{p.isActive ? "Yes" : "No"}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button onClick={() => setEditing(p)} className="px-2 py-1 rounded-lg border border-white/20 hover:border-white">
                    Edit
                  </button>
                  <button onClick={() => toggleActive(p.id)} className="px-2 py-1 rounded-lg border border-white/20 hover:border-white">
                    {p.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => removePlan(p.id)} className="px-2 py-1 rounded-lg border border-white/20 hover:border-white">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center opacity-70">No results</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <PlanEditModal
        open={!!editing}
        plan={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSave={savePlan}
      />
    </section>
  );
}
