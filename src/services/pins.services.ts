// src/services/pins.ts
import axios from "axios";
import type { IPins } from "@/interfaces/IPins";
import type { IUploadPin } from "@/interfaces/IUploadPin";
import type { ICategory } from "@/interfaces/ICategory";

// Usa una sola var de entorno y haz fallback limpio
const API_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

// Opcional Cloudinary (si lo usas)
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

// ---- Axios centralizado ----
export const api = axios.create({ baseURL: API_URL });

// Interceptor para meter Bearer token (frontend)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("auth:token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      undefined;
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper para loguear bien los errores
function explainAxiosError(err: unknown) {
  const e = err as any;
  const status = e?.response?.status;
  const text = e?.response?.statusText;
  const body = e?.response?.data;
  return `HTTP ${status ?? "?"} ${text ?? ""} :: ${typeof body === "string" ? body : JSON.stringify(body)}`;
}

// ---- Servicios ----
export const getAllPins = async (): Promise<IPins[]> => {
  try {
    const { data } = await api.get<IPins[]>("/pins");
    return data;
  } catch (error) {
    console.error("Error getting pins:", explainAxiosError(error));
    return [];
  }
};

export const searchPins = async (query: string): Promise<IPins[]> => {
  try {
    const { data } = await api.get<IPins[]>("/pins/search", { params: { q: query } });
    return data;
  } catch (error) {
    console.error("Error searching pins:", explainAxiosError(error));
    return [];
  }
};

export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const { data } = await api.get<ICategory[]>("/category");
    return data;
  } catch (error) {
    console.error("Error fetching categories:", explainAxiosError(error));
    return [];
  }
};

// --- Cloudinary (opcional) ---
export const getCloudinarySignature = async () => {
  const { data } = await api.get("/files/signature"); // asegúrate que exista en tu back
  return data as { signature: string; timestamp: number; folder: string };
};

export const uploadToCloudinary = async (
  file: File,
  signatureData: { signature: string; timestamp: number; folder: string }
) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) {
    throw new Error("Faltan envs de Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_API_KEY)");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const res = await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data as { secure_url: string };
};

// --- Crear Pin ---
/**
 * IUploadPin debería tener, como mínimo:
 * { image?: string; imageUrl?: string; description: string; categoryId: string }
 * Envía solo lo que tu DTO espera.
 */
export const savePin = async (pin: IUploadPin) => {
  try {
    const payload = {
      image: (pin as any).image ?? (pin as any).imageUrl, // compat: image | imageUrl
      description: pin.description,
      categoryId: (pin as any).categoryId, // UUID de la categoría
    };
    const { data } = await api.post("/pins", payload);
    return data;
  } catch (error) {
    console.error("Error creating pin:", explainAxiosError(error));
    throw error; // deja que el caller muestre el toast, etc.
  }
};
