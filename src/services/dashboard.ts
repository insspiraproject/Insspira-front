// src/services/dashboard.ts
import axios, { type AxiosRequestHeaders } from 'axios';

/* ================= axios local (sin depender de pins.services) ================= */
const API_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000'
).replace(/\/+$/, '');

export const api = axios.create({ baseURL: API_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('auth:token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      undefined;
    if (token) {
      const headers: AxiosRequestHeaders = (config.headers as AxiosRequestHeaders) ?? {};
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
  }
  return config;
});

/* ================= Tipos ================= */
export type BackendHashtag = { id: string; tag: string };

export type BackendPin = {
  id: string;
  image: string;
  description: string;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  hashtags?: BackendHashtag[];
  user?: { name?: string | null; username?: string | null } | null;
};

export type UIPost = {
  id: string;
  title: string;
  imageUrl: string;
  stats: { likes: number; views: number };
  createdAt: string; // ISO
  tags: string[];
};

export type BackendUser = {
  id: string;
  name?: string | null;
  username?: string | null;
  email: string;
  profilePicture?: string | null; // <-- backend
  biography?: string | null;       // <-- backend
  createdAt?: string | Date | null;
  pinsCount?: number | null;
};

/* ================= Adaptadores ================= */
function toUIPost(p: BackendPin): UIPost {
  return {
    id: p.id,
    title: p.description || 'Untitled',
    imageUrl: p.image,
    stats: {
      likes: typeof p.likesCount === 'number' ? p.likesCount : 0,
      views: typeof p.viewsCount === 'number' ? p.viewsCount : 0,
    },
    createdAt: new Date(p.createdAt).toISOString(),
    tags: Array.isArray(p.hashtags) ? p.hashtags.map((h) => h.tag).filter(Boolean) : [],
  };
}

/* ================= Endpoints dashboard ================= */
export async function fetchUserPins(userId: string, page = 1, limit = 20): Promise<UIPost[]> {
  const { data } = await api.get<BackendPin[]>(`/users/${userId}/pins`, { params: { page, limit } });
  return (data ?? []).map(toUIPost);
}

export async function fetchUserLikedPins(userId: string, page = 1, limit = 20): Promise<UIPost[]> {
  const { data } = await api.get<BackendPin[]>(`/users/${userId}/liked-pins`, { params: { page, limit } });
  return (data ?? []).map(toUIPost);
}

export async function fetchUserPinsCount(userId: string): Promise<number> {
  const { data } = await api.get<number>(`/users/${userId}/pins-count`);
  return typeof data === 'number' ? data : 0;
}

export type UpdateUserPayload = {
  name?: string;
  username?: string;
  email?: string;
  biography?: string; // backend usa biography
};

export async function updateUserBasics(id: string, payload: UpdateUserPayload) {
  const { data } = await api.put(`/users/${id}`, payload);
  return data as BackendUser;
}

export async function setProfilePicture(id: string, publicId: string) {
  const { data } = await api.patch(`/users/${id}/profile-picture`, { publicId });
  return data as BackendUser; // devuelve el usuario actualizado
}

/* ================= Cloudinary helpers (para avatar) ================= */
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export async function getCloudinarySignature() {
  const { data } = await api.get('/files/signature');
  return data as { signature: string; timestamp: number; folder: string };
}

export async function uploadAvatarToCloudinary(
  file: File,
  sig: { signature: string; timestamp: number; folder: string }
) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) {
    throw new Error(
      'Faltan envs de Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_API_KEY)'
    );
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const res = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data as { secure_url: string; public_id: string };
}
