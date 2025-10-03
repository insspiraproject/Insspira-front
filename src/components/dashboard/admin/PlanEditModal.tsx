"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { FiX } from "react-icons/fi";
import type { AdminPlan } from "@/services/dashboardAdmin";

type Currency = 'USD' | 'COP' | 'ARS';

export default function PlanEditModal({
  open,
  plan,
  onClose,
  onSave,
}: {
  open: boolean;
  plan?: AdminPlan;
  onClose: () => void;
  onSave: (p: { name: string; pricePerMonth: number; currency: Currency; features: string[]; isActive: boolean; type?: string }) => void;
}) {
  const [local, setLocal] = useState<AdminPlan | null>(plan ?? null);

  useEffect(() => setLocal(plan ?? null), [plan]);
  if (!open || !local) return null;

  const featuresStr = local.features.join(", ");

  const handleCurrency = (e: ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Currency;
    setLocal({ ...local, currency: next });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[var(--color-violeta)] text-white border border-white/10 shadow-2xl">
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg font-semibold">Edit Plan</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="p-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Name
            <select
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
              value={local.name}
              onChange={(e) => setLocal({ ...local, name: e.target.value })}
            >
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Plus">Plus</option>
              <option value="Business">Business</option>
            </select>
          </label>

          <label className="text-sm">
            Monthly Price
            <input
              type="number" min={0} step="0.01"
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
              value={local.pricePerMonth}
              onChange={(e) => setLocal({ ...local, pricePerMonth: Number(e.target.value) })}
            />
          </label>

          <label className="text-sm">
            Currency
            <select
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
              value={local.currency}
              onChange={handleCurrency}
            >
              <option value="USD">USD</option>
              <option value="COP">COP</option>
              <option value="ARS">ARS</option>
            </select>
          </label>

          <label className="text-sm md:col-span-2">
            Features (comma separated)
            <input
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
              value={featuresStr}
              onChange={(e) =>
                setLocal({
                  ...local,
                  features: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={local.isActive}
              onChange={(e) => setLocal({ ...local, isActive: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="p-5 border-t border-white/10 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/20 hover:border-white">
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                name: local.name,
                pricePerMonth: local.pricePerMonth,
                currency: local.currency as Currency,
                features: local.features,
                isActive: local.isActive,
              })
            }
            className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
