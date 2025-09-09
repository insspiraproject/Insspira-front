// src/components/admin/PlanEditModal.tsx
"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import type { Plan } from "@/mocks/adminMocks";

export default function PlanEditModal({
  open,
  plan,
  onClose,
  onSave,
}: {
  open: boolean;
  plan?: Plan;
  onClose: () => void;
  onSave: (p: Plan) => void;
}) {
  const [local, setLocal] = useState<Plan | null>(plan ?? null);

  useEffect(() => setLocal(plan ?? null), [plan]);

  if (!open || !local) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[var(--color-violeta)] text-white border border-white/10 shadow-2xl">
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg font-semibold">Editar plan</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Cerrar"
          >
            <FiX />
          </button>
        </div>

        <div className="p-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Nombre
            <select
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
              value={local.name}
              onChange={(e) =>
                setLocal({ ...local, name: e.target.value as Plan["name"] })
              }
            >
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Plus">Plus</option>
              <option value="Business">Business</option>
            </select>
          </label>

          <label className="text-sm">
            Precio mensual
            <input
              type="number"
              min={0}
              step="0.01"
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
              value={local.pricePerMonth}
              onChange={(e) =>
                setLocal({ ...local, pricePerMonth: Number(e.target.value) })
              }
            />
          </label>

          <label className="text-sm">
            Moneda
            <select
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
              value={local.currency}
              onChange={(e) =>
                setLocal({
                  ...local,
                  currency: e.target.value as Plan["currency"],
                })
              }
            >
              <option value="USD">USD</option>
              <option value="COP">COP</option>
            </select>
          </label>

          <label className="text-sm md:col-span-2">
            Características (separadas por coma)
            <input
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
              value={local.features.join(", ")}
              onChange={(e) =>
                setLocal({ ...local, features: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })
              }
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={local.isActive}
              onChange={(e) => setLocal({ ...local, isActive: e.target.checked })}
            />
            Activo
          </label>
        </div>

        <div className="p-5 border-t border-white/10 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/20 hover:border-white"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(local)}
            className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
