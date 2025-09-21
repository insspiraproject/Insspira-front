// src/services/dashboard.ts
import { api } from '@/services/pins.services';

export type BackendHashtag = { id: string; tag: string };

export type BackendPin = {
  id: string;
  image: string;
  description: string;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  hashtags?: BackendHashtag[]; // <- ⬅️ ahora lo contemplamos
  user?: { name?: string | null; username?: string | null } | null;
};

export type UIPost = {
  id: string;
  title: string;
  imageUrl: string;
  stats: { likes: number; views: number };
  createdAt: string; // ISO
  tags: string[];    // <- ⬅️ lo exponemos para luego mapear a Post
};

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
    tags: Array.isArray(p.hashtags) ? p.hashtags.map(h => h.tag).filter(Boolean) : [], // <- ⬅️ aquí
  };
}

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
  biography?: string; // tu back usa "biography"
};

export async function updateUserBasics(id: string, payload: UpdateUserPayload) {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
}

export async function setProfilePicture(id: string, publicId: string) {
  const { data } = await api.patch(`/users/${id}/profile-picture`, { publicId });
  return data;
}
