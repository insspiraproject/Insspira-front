// src/services/pins.services.ts (o src/services/pins.ts)
import axios, { type AxiosRequestHeaders } from "axios";
import type { IPins, IComment } from "@/interfaces/IPins";
import type { IUploadPin } from "@/interfaces/IUploadPin";
import type { ICategory } from "@/interfaces/ICategory";
import { IHashtag } from "@/interfaces/IHashtag";
import Cookies from 'js-cookie';

const API_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;


const getAuthToken = (): string | null => {

  const localStorageToken = localStorage.getItem("auth:token");
  if (localStorageToken) return localStorageToken;
  
  
  const cookieToken = Cookies.get("auth-token");
  if (cookieToken) return cookieToken;
  
  return null;
};

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
  created: string;
  comments: IComment[];
  hashtag: IHashtag;
  liked?: boolean;
  user: string;
}

interface PinByIdResponse {
  id: string;
  image: string;
  description?: string | null;
  likes?: number;
  comment?: number;
  name: string;
  views: number;
  created: string;
  comments: IComment[];
  hashtag: IHashtag;
  user: string;
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
      liked: pin.liked,       
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
console.log(data)
    return {
      id: data.id,
      name: data.name,
      image: data.image,
      description: data.description ?? null,
      likes: data.likes ?? 0,      
      comment: data.comment ?? 0,  
      views: data.views ?? 0,
      created: data.created ?? null,
      comments: data.comments,
      hashtag: data.hashtag,
      user: data.user,
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
 
  const payload = {
    image: readStringKey(pin, "image") ?? readStringKey(pin, "imageUrl"),
    description: (pin as IUploadPin).description,
    categoryId: readStringKey(pin, "categoryId"),
  };

  const { data } = await api.post("/pins", payload);
  return data;
};

// --- Add Like ---
export const addLike = async (pinId: string) => {
  const token = getAuthToken()
  console.log("pinId que se pasa: ", pinId)
  if(!pinId || !token) {
    console.log("Error al encontrar pin o token");
  } 

  return api.post(`/pins/like/${pinId}`,
    {},
    {
      headers: {Authorization: `Bearer ${token}`}
    }
  );
};

// --- View Like ---
export const fetchLikeStatus = async (pinId: string) => {
   const token = getAuthToken();
  if (!pinId || !token) {
    console.warn("Error al encontrar pin o token");
  }

  const { data } = await api.get(`/pins/likeStatus/${pinId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; 
};

// --- Create Comment ---
export const addComment = async (pinId: string, text: string) => {
  const token = getAuthToken();
  console.log("pinId que se pasa: ", pinId)
    if (!pinId) {
      console.log("pinId no existe")
    } if(!token) {
      console.log("token no existe");
    }

    try {
      const res = await api.post(`/pins/comments/${pinId}`,
        {text},
        { headers: {Authorization: `Bearer ${token}`}}
      )
      return res;
    } catch (error) {
      console.error("Error making a comment", error);
    }
}

// --- Crear Reporte ---
export const reportTarget = async (
  
  targetType: "pin" | "comment" | "user",
  targetId: string,
  type: "spam" | "violence" | "sexual" | "hate" | "other",
  reason?: string

) => {
  
  
  try {

    if (!targetId) return null;
    console.log(targetId)

    const response = await api.post("/reports", {
      targetType, targetId, type, reason
    });
  
    return response;
    
  } catch (error) {
    console.error("Error al reporta: ", error);
  return null;
  }
};

export const addView = (pinId: string) => {
  try {
    const view = api.post(`/pins/view/${pinId}`);
    return view;
  } catch (error) {
    console.error("Error: ", error);
  }
}