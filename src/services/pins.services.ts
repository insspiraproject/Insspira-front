// src/services/pins.services.ts (o src/services/pins.ts)
import axios, { type AxiosRequestHeaders } from "axios";
import type { IPins } from "@/interfaces/IPins";
import type { IUploadPin } from "@/interfaces/IUploadPin";
import type { ICategory } from "@/interfaces/ICategory";

const API_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export const api = axios.create({ baseURL: API_URL });

// ✅ sin any: usa AxiosRequestHeaders
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("auth:token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      undefined;
    if (token) {
      const headers: AxiosRequestHeaders = (config.headers as AxiosRequestHeaders) ?? {};
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
  }
  return config;
});

type AxiosLikeError = {
  response?: { status?: number; statusText?: string; data?: unknown };
};

// ✅ sin any: estrecha a un tipo auxiliar
function explainAxiosError(err: unknown) {
  const e = err as AxiosLikeError;
  const status = e?.response?.status;
  const text = e?.response?.statusText;
  const body = e?.response?.data;
  return `HTTP ${status ?? "?"} ${text ?? ""} :: ${
    typeof body === "string" ? body : JSON.stringify(body)
  }`;
}

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

export const getCloudinarySignature = async () => {
  const { data } = await api.get("/files/signature");
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

// Helpers sin any para leer propiedades opcionales
function readStringKey(obj: unknown, key: string): string | undefined {
  if (typeof obj !== "object" || obj === null) return undefined;
  const val = (obj as Record<string, unknown>)[key];
  return typeof val === "string" ? val : undefined;
}

type UploadPayload = Pick<IUploadPin, "description"> & {
  image?: string;
  imageUrl?: string;
  categoryId?: string;
};

// --- Crear Pin ---
export const savePin = async (pin: IUploadPin | UploadPayload) => {
  try {
    const payload = {
      image: readStringKey(pin, "image") ?? readStringKey(pin, "imageUrl"),
      description: (pin as IUploadPin).description, // esto sí está en tu interfaz
      categoryId: readStringKey(pin, "categoryId"),
    };
    const { data } = await api.post("/pins", payload);
    return data;
  } catch (error) {
    console.error("Error creating pin:", explainAxiosError(error));
    throw error;
  }
};
