// src/services/pins.ts
import axios from "axios";
import type { IPins } from "@/interfaces/IPins";

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

// Traer todos los pins.
export const getAllPins = async (): Promise<IPins[]> => {
  try {
    const { data } = await api.get<IPins[]>("/pins");
    return data;
  } catch (error) {
    console.error("Error getting pins: ", error);
    return [];
  }
};

// Traer unicamente un pin mediante su id.
export const getPinById = async (id: string): Promise<IPins | null> => {
    try {
      const { data } = await api.get(`/pins/${id}`);
      return data;
    } catch (error) {
        console.error("Error getting pin using id: ", error);
        return null;
    }
}

// Buscar pins mediante su descripcion o hashtags.
export const searchPins = async (query: string): Promise<IPins[]> => {
  try {
    const { data } = await api.get<IPins[]>("/pins/search", {
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
  const { data } = await api.get("/cloudinary/signature");
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
  const { data } = await axios.post(url, formData);

  return data; // respuesta de Cloudinary
};

export const savePin = async (imageUrl: string, description: string) => {
  const { data } = await api.post("/pin", { imageUrl, description });
  return data;
};