import axios, { type AxiosRequestHeaders } from 'axios';

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

/* ================= Tipos backend ================= */
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
  profilePicture?: string | null;
  biography?: string | null;
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

/* ================= Pins ================= */
export async function fetchUserPins(userId: string, page = 1, limit = 20): Promise<UIPost[]> {
  const { data } = await api.get<BackendPin[]>(`/users/${userId}/pins`, { params: { page, limit } });
  return (data ?? []).map(toUIPost);
}

export async function fetchUserLikedPins(userId: string, page = 1, limit = 20): Promise<UIPost[]> {
  const { data } = await api.get<BackendPin[]>(`/users/${userId}/liked-pins`, { params: { page, limit } });
  return (data ?? []).map(toUIPost);
}

/* ================= Avatar helpers (Cloudinary) ================= */
export async function getAvatarSignature(userId: string) {
  const { data } = await api.get('/files/signature', { params: { folder: `avatars/${userId}` } });
  return data as { signature: string; timestamp: number; folder: string; apiKey: string; cloudName: string };
}

export async function uploadAvatarToCloudinary(
  file: File,
  sig: { signature: string; timestamp: number; folder: string; apiKey: string; cloudName: string }
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;
  const res = await fetch(url, { method: 'POST', body: formData });
  const json = await res.json();
  return { secure_url: json.secure_url as string, public_id: json.public_id as string };
}

export async function updateUserProfile(
  id: string,
  patch: { name?: string; username?: string; email?: string; biography?: string }
) {
  const { data } = await api.put(`/users/${id}`, patch);
  return data as BackendUser;
}

export async function setProfilePicture(id: string, publicId: string) {
  const { data } = await api.patch(`/users/${id}/profile-picture`, { publicId });
  return data as BackendUser;
}

/* ================= Subscripciones / Pagos ================= */

type PlanLike = string | { type?: string; features?: string[] | string } | null;

export type SubStatusResponse = {
  success: boolean;
  hasActivePayment: boolean;
  plan: PlanLike;       // ⬅️ antes era any
  status?: string;
  endsAt?: string;
  benefits?: { name?: string; features?: string[] };
};

type PaymentHistoryItem = {
  id: number | string;
  paymentId: string;
  date: string;
  plan: string;
  description: string;
  status: "paid" | "cancelled" | "expired" | "pending";
  usdPrice: number;
  arsPrice: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

type PaymentHistoryResponse = {
  success: boolean;
  history: PaymentHistoryItem[];
  stats: { totalPayments: number; totalSpentUSD: number; totalSpentARS: number; activeSubscriptions: number };
};

export async function fetchSubscriptionStatus(userId: string): Promise<SubStatusResponse | null> {
  try {
    const { data } = await api.get<SubStatusResponse>(`/subscriptions/status/${userId}`);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function fetchPaymentHistory(userId: string): Promise<PaymentHistoryItem[]> {
  try {
    const { data } = await api.get<PaymentHistoryResponse>(`/subscriptions/history/${userId}`);
    return data?.history ?? [];
  } catch {
    return [];
  }
}