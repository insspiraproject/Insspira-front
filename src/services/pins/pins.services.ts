// src/services/pins.ts
import axios from "axios";
import type { IPins } from "@/interfaces/IPins";
import type { IUploadPin } from "@/interfaces/IUploadPin";
import type { ICategory } from "@/interfaces/ICategory";

// ---- ENV (lado cliente/SSR) ----
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

// ---- Axios centralizado ----
const api = axios.create({
  baseURL: API_URL,
  // timeout: 10000,
});

// ---- Servicios ----
export const getAllPins = async (): Promise<IPins[]> => {
  try {
    const { data } = await api.get<IPins[]>("/pins");
    return data;
  } catch (error) {
    console.error("Error getting pins: ", error);
    return [];
  }
};

export const searchPins = async (query: string): Promise<IPins[]> => {
  try {
    const { data } = await api.get<IPins[]>("/pin/search", {
      params: { q: query },
    });
    return data;
  } catch (error) {
    console.error("Error searching pins: ", error);
    return [];
  }
};

export const getCloudinarySignature = async () => {
  // usa la misma baseURL (api) para evitar inconsistencias
  const { data } = await api.get("/files/signature");
  console.log("Cloudinary signature data:", data);
  
  return data; // { signature, timestamp, folder, ... }
};

export const uploadToCloudinary = async (
  file: File,
  signatureData: { signature: string; timestamp: number; folder: string }
) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) {
    throw new Error("Faltan variables de entorno de Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_API_KEY)");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const res = await axios.post(url, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
console.log("Cloudinary upload response:", res.data);
return res.data;
};
export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const { data } = await api.get<ICategory[]>("/category");
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
export const savePin = async (pin: IUploadPin) => {
  const {data  } = await api.post("/pins", pin);
  return data;
};


