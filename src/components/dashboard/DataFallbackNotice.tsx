"use client";

import { FiX, FiInfo } from "react-icons/fi";

export default function DataFallbackNotice({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--color-violeta)] text-white border border-white/10 shadow-2xl">
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="inline-flex items-center gap-2">
            <FiInfo />
            <h2 className="text-lg font-semibold">Datos incompletos</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Cerrar"
          >
            <FiX />
          </button>
        </div>
        <div className="p-5 text-sm leading-relaxed">
          Algunas secciones del perfil todavía usan información de <strong>mock</strong>
          (avatar, biografía, estadísticas o suscripción) porque tu backend todavía no provee esos campos.
          Podrás completarlos o los reemplazaremos automáticamente cuando tu API los expose.
        </div>
        <div className="p-5 border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
