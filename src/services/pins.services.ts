// src/services/pins.services.ts (o src/services/pins.ts)
import axios, { type AxiosRequestHeaders } from "axios";
import type { IPins } from "@/interfaces/IPins";
import type { IUploadPin } from "@/interfaces/IUploadPin";
import type { ICategory } from "@/interfaces/ICategory";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const API_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export const api = axios.create({ baseURL: API_URL, withCredentials: true });
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

// interface PinUserSlim {
//   name?: string | null;
//   username?: string | null;
// }

export interface UIPinModal {
  id: string;
  name: string;
  image: string;
  description?: string | null;
  likes: number;
  comment: number;
  views: number;
}

interface PinByIdResponse {
  id: string;
  image: string;
  description?: string | null;
  likes?: number;
  comment?: number;
  name: string;
  views: number;
}
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
    return data.map((pin: IPins) => ({
      id: pin.id,
      image: pin.image,
      description: pin.description,
      likesCount: pin.likesCount,       
      commentsCount: pin.commentsCount,  
      views: pin.views,
      user: pin.user,
    }));
  } catch (error) {
    console.error("Error getting pins:", explainAxiosError(error));
    return [];
  }
};

/* ===== Servicio ===== */
export async function getPinById(id: string): Promise<UIPinModal | null> {
  try {
    // OJO: tu back es /pins/:id (con S)
    const { data } = await api.get<PinByIdResponse>(`/pins/${id}`);

    return {
      id: data.id,
      name: data.name,
      image: data.image,
      description: data.description ?? null,
      likes: data.likes ?? 0,      
      comment: data.comment ?? 0,  
      views: data.views ?? 0,      
    };
  } catch (err) {
    console.error("getPinById failed:", err);
    return null;
  }
}

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

// --- Add Like ---
export const addLike = async (pinId: string) => {
  const token = localStorage.getItem("auth:token")
  console.log(token)
  if (!pinId) return;

  if(!token) {
    console.log("JWT not found");
    return null;
  }

   try {
    const response = await api.post(`/pins/like/${pinId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (err) {
    const error = err as AxiosError
    const status = error?.response?.status;

    if (status === 403 || status === 429) {
      toast.error("Has alcanzado el límite de likes de tu plan.");
    } else {
      toast.error("Error al dar like, intenta nuevamente.");
    }
    return null;
  }
}

// --- Delete Like ---
export const deleteLike = async (pinId: string) => {
  const token = localStorage.getItem("auth:token");
  console.log(token);
  
  if(!pinId) return null
  if(!token) {
     console.log("JWT not found")
  }

  try {
    const response = axios.delete(
      `/pins/like/${pinId}`,
      {
        headers: { Authorization: `Bearer ${token}`}
      },
    )
    return response;
  } catch (error) {
    console.error("Error when delete like: ", error);
    return null
  }
}
