'use client'
import { useState } from "react";
import {getCloudinarySignature, uploadToCloudinary, savePin} from "@/services/pins/pins.services";
function validateFile(f: File) {
  const MAX_BYTES = 2 * 1024 * 1024; // 2MB
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(f.type)) return "Formato no permitido (jpg/png/webp).";
  if (f.size > MAX_BYTES) return "Archivo excede 2MB.";
  return null;
}

const UploadPin = () => {
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      selectFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return setError("Elegí un archivo primero.");
    setError(null);
    setUploading(true);

    try {
     
      const sigData = await getCloudinarySignature();

      const result = await uploadToCloudinary(file, sigData);
      const imageUrl = result.secure_url;

      await savePin(imageUrl, description);
      alert(`Archivo "${file.name}" subido correctamente!`);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Error al subir el archivo.");
    } finally {
      setUploading(false);
    }

  };
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  handleUpload();
};
    return(
        <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-violeta)]">
      <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 p-6 border rounded-xl w-full max-w-md mx-auto bg-[var(--color-blanco)]"
    >
      {file ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium">{file.name}</p>
            {file.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-40 h-40 object-cover rounded-lg shadow"
              />
            )}
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-sm text-red-600 underline hover:text-red-800"
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
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
            }`}
          >
            <p className="text-sm text-gray-500 text-center">
              Arrastra un archivo aquí o{" "}
              <label
                htmlFor="fileInput"
                className="text-blue-600 cursor-pointer underline"
              >
                selecciónalo
              </label>
            </p>
          </div>
        )}

        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileChange}
        />
         <label className="w-full">
          Descripción:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Escribe una descripción"
          />
        </label>
         <button
    type="submit"
    disabled={!file || uploading}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
  >
    {uploading ? "Subiendo..." : "Subir archivo"}
  </button>
      </form>
    </div>
    )   
}

export default UploadPin;