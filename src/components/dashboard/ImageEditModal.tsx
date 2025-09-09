"use client";

import { useEffect, useState } from "react";
import { FiX, FiUpload } from "react-icons/fi";

export default function ImageEditModal({
  open,
  onClose,
  onSave,
  currentUrl,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  currentUrl: string;
}) {
  const [preview, setPreview] = useState<string>(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (open) {
      setPreview(currentUrl);
      setError(null);
      setDragging(false);
    }
  }, [open, currentUrl]);

  if (!open) return null;

  const readFile = (file: File) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Formato no permitido. Usa PNG, JPG o WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo supera 5MB. Reduce el tamaño, por favor.");
      return;
    }
    setError(null);
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = String(fr.result || "");
      if (dataUrl) setPreview(dataUrl);
    };
    fr.readAsDataURL(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) readFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) readFile(f);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[var(--color-violeta)] text-white border border-white/10 shadow-2xl">
        {/* header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg font-semibold">Actualizar foto de perfil</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Cerrar"
            title="Cerrar"
          >
            <FiX />
          </button>
        </div>

        {/* body */}
        <div className="p-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          {/* Zona de carga */}
          <div>
            <label
              htmlFor="avatarFile"
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`block cursor-pointer rounded-xl border border-dashed p-6 text-center transition
                ${dragging ? "border-white bg-white/10" : "border-white/30 bg-white/5 hover:border-white/60"}`}
              title="Haz clic o arrastra una imagen"
            >
              <input
                id="avatarFile"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleInput}
              />
              <div className="mx-auto mb-3 grid place-items-center">
                <FiUpload className="text-2xl" />
              </div>
              <div className="text-sm font-medium">Haz clic o arrastra una imagen aquí</div>
              <div className="mt-1 text-xs text-white/70">Formatos: PNG, JPG o WEBP · Máx: 5MB</div>
            </label>

            {error && (
              <p className="mt-2 text-xs text-red-300">
                {error}
              </p>
            )}
          </div>

          {/* Preview circular */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview || currentUrl}
                alt="Vista previa"
                className="absolute inset-0 w-full h-full rounded-full object-cover ring-2 ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="p-5 border-t border-white/10 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/20 hover:border-white"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(preview || currentUrl);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)]"
            disabled={!preview || preview === currentUrl}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
