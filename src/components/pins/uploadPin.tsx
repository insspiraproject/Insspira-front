
"use client";

import { useEffect, useState } from "react";
import type { DragEvent, ChangeEvent, FormEvent } from "react";
import { getCloudinarySignature, uploadToCloudinary, getCategories,savePin } from "@/services/pins/pins.services";
import type { IUploadPin } from "@/interfaces/IUploadPin";
import { ICategory } from "@/interfaces/ICategory";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const FilePreview = dynamic(() => import("@/components/pins/FilePreview"), {
  ssr: false,
});
function validateFile(f: File) {
  const MAX_BYTES = 2 * 1024 * 1024; 
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(f.type)) return "File format not allowed (jpg/png/webp).";
  if (f.size > MAX_BYTES) return "File exceeds 2 MB.";
  return null;
}


export default function UploadPin() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [hashtagsInput, setHashtagsInput] = useState<string>("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
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

 useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories); 
        if (categories.length > 0) {
          setCategoryId(categories[0].id); 
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  const handleUpload = async () => {
    if (!file) {
      setError("Choose a file.");
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const sigData = await getCloudinarySignature();
      const result = await uploadToCloudinary(file, sigData);
      const imageUrl = result.secure_url;
      const hashtagsArray = hashtagsInput
        .split("#")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => ({ tag })); 

       await savePin({ image: imageUrl, description, categoryId,  hashtags: hashtagsArray, } as IUploadPin);
      toast.success(`File "${file.name}" uploaded successfully!`);
      setFile(null);
      setDescription("");
      setHashtagsInput("");
      


    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
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
        className="flex flex-col items-stretch gap-4 p-6 border border-white/15 bg-[var(--color-morado)] rounded-2xl w-full max-w-md mx-auto"
      >
       
        {error && (
          <div className="rounded-lg border border-red-300/40 bg-red-100 text-red-800 px-3 py-2 text-sm">
            {error}
          </div>
        )}

 
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-white/90">{file.name}</p>
         
           <FilePreview file={file} />
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-sm text-red-200 underline hover:text-red-100"
            >
              Remove file
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
              Drag and drop or{" "}
              <label htmlFor="fileInput" className="text-white underline cursor-pointer">
                browse files
              </label>
            </p>
          </div>
        )}

        <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} accept="image/*" />

        <label className="w-full text-md text-white/90">
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 outline-none focus:border-white/40"
            placeholder="share your thoughts..."
          />
        </label>
        <input
        type="text"
        placeholder="Add hashtags #tech #art"
        value={hashtagsInput}
        onChange={(e) => setHashtagsInput(e.target.value)}
        className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 outline-none focus:border-white/40"
      />  


      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full mt-1 p-2 rounded-lg bg-white/10  border border-white/20 text-white outline-none focus:border-white/40"
      >
        <option value="" disabled className="bg-[var(--color-morado)]">
          Choose a category
        </option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id} className="bg-[var(--color-morado)] text-white">
            {cat.name}
        </option>
  ))}

</select>

        <button
          type="submit"
          disabled={!file || uploading}
          className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)] font-semibold hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Pin"}
        </button>
      </form>
    </div>
  );
}
