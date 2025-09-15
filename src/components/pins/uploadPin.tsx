// src/components/pins/UploadPin.tsx
"use client";

import { useState } from "react";
import type { DragEvent, ChangeEvent, FormEvent } from "react";
import { getCloudinarySignature, uploadToCloudinary, savePin } from "@/services/pins/pins.services";

function validateFile(f: File) {
  const MAX_BYTES = 2 * 1024 * 1024; // 2MB
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(f.type)) return "Formato no permitido (jpg/png/webp).";
  if (f.size > MAX_BYTES) return "Archivo excede 2MB.";
  return null;
}

export default function UploadPin() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const selectFile = (f: File) => {
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      selectFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Elegí un archivo primero.");
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const sigData = await getCloudinarySignature();
      const result = await uploadToCloudinary(file, sigData);
      const imageUrl = result.secure_url;

      await savePin(imageUrl, description.trim());
      alert(`Archivo "${file.name}" subido correctamente!`);
      setFile(null);
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Error al subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleUpload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-violeta)] px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-stretch gap-4 p-6 border border-white/15 bg-[var(--color-blanco)]/5 rounded-2xl w-full max-w-md mx-auto"
      >
        {/* Feedback de error */}
        {error && (
          <div className="rounded-lg border border-red-300/40 bg-red-100 text-red-800 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Zona de drop / selector */}
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-white/90">{file.name}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-40 h-40 object-cover rounded-lg shadow"
            />
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-sm text-red-200 underline hover:text-red-100"
            >
              Eliminar archivo
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`w-full h-32 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragging ? "border-blue-400 bg-blue-50/20" : "border-white/30"
            }`}
          >
            <p className="text-sm text-white/80 text-center">
              Arrastra una imagen aquí o{" "}
              <label htmlFor="fileInput" className="text-white underline cursor-pointer">
                selecciónala
              </label>
            </p>
          </div>
        )}

        <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} accept="image/*" />

        <label className="w-full text-sm text-white/90">
          Descripción
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 outline-none focus:border-white/40"
            placeholder="Escribe una descripción"
          />
        </label>

        <button
          type="submit"
          disabled={!file || uploading}
          className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)] font-semibold hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : "Subir archivo"}
        </button>
      </form>
    </div>
  );
}
