// src/services/dashboardAdmin.ts
import { api } from './dashboard';

/* ================= Tipos (UI) ================= */
// Users
export type AdminUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  plan: string;               // "Free" | "Pro" | "Business" ...
  posts: number;
  status: 'active' | 'suspended';
  isAdmin: boolean;
  createdAt: string | Date;
};
export type AdminUsersResponse = { total: number; users: AdminUser[] };

// Reports
export type AdminReport = {
  id: string;
  postId?: string;            // si tu backend decide incluirlo a futuro
  reportedBy?: string;        // idem
  reason?: string | null;
  createdAt: string;
  status: 'open' | 'resolved' | 'dismissed' | 'pending';
  targetType?: string;
  targetId?: string;
};

// Subs
export type AdminSubscription = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  plan: string;
  status: string;
  startedAt: string;
  renewsAt: string | null;
  pricePerMonth: number;
  currency: 'USD' | 'COP' | 'ARS';
};

// Payments
export type AdminPayment = {
  id: string;
  date: string;
  userId?: string;
  userName?: string;   // lo completaremos si backend no lo trae
  email?: string;
  description: string;
  method: string;      // "CARD"
  status: 'PAID' | 'CANCELLED' | 'EXPIRED';
  amount: number;
  currency: 'USD' | 'COP' | 'ARS';
};

// Plans
export type AdminPlan = {
  id: string;
  name: 'Free' | 'Pro' | 'Plus' | 'Business' | string;
  pricePerMonth: number;
  currency: 'USD' | 'COP' | 'ARS';
  features: string[];     // adaptamos desde featuresCsv
  isActive: boolean;
  createdAt: string;
};
export type UpsertPlanInput = {
  id?: string;
  name: string;
  pricePerMonth: number;
  currency: 'USD' | 'COP' | 'ARS';
  features: string[];     // lo convertimos a CSV para el backend
  isActive: boolean;
  type?: string;
};

// Overview
export type AdminOverview = {
  totalUsers: number;
  activeSubs: number;
  openReports: number;
  revenueUSD: number;
};

/* ================= Helpers ================= */
const toCsv = (arr: string[]) => (arr || []).map(s => s.trim()).filter(Boolean).join(',');

/* ================= Calls ================= */
// Overview
export async function fetchAdminOverview(): Promise<AdminOverview> {
  const { data } = await api.get<AdminOverview>('/admin/overview');
  return data;
}

// Users
export async function fetchAdminUsers(q = '', page = 1, limit = 20): Promise<AdminUsersResponse> {
  const { data } = await api.get<AdminUsersResponse>('/admin/users', { params: { q, page, limit } });
  return data;
}
export async function setAdminUserStatus(id: string, status: 'active' | 'suspended') {
  const { data } = await api.patch(`/admin/users/${id}/status`, { status });
  return data as AdminUser;
}
export async function setAdminUserRole(id: string, isAdmin: boolean) {
  const { data } = await api.patch(`/admin/users/${id}/role`, { isAdmin });
  return data as AdminUser;
}

// Reports
export async function fetchAdminReports(): Promise<AdminReport[]> {
  const { data } = await api.get<AdminReport[]>('/admin/reports');
  return data;
}
export async function setAdminReportStatus(id: string, status: 'open' | 'resolved' | 'dismissed') {
  const { data } = await api.patch(`/admin/reports/${id}`, { status });
  return data as AdminReport;
}

// Subscriptions
export async function fetchAdminSubscriptions(): Promise<AdminSubscription[]> {
  const { data } = await api.get<AdminSubscription[]>('/admin/subscriptions');
  return data;
}

// Payments
export async function fetchAdminPayments(): Promise<AdminPayment[]> {
  const { data } = await api.get<AdminPayment[]>('/admin/payments');
  return data;
}

// Plans
export async function fetchAdminPlans(): Promise<AdminPlan[]> {
  const { data } = await api.get<Array<{
    id: string;
    name: string;
    pricePerMonth: number | string;
    currency: 'USD' | 'COP' | 'ARS';
    features: string[] | undefined;  // tu backend ya devuelve array
    isActive: boolean;
    createdAt: string;
  }>>('/admin/plans');
  // normaliza price a number y features a array
  return data.map(p => ({
    ...p,
    pricePerMonth: Number(p.pricePerMonth),
    features: Array.isArray(p.features) ? p.features : [],
  }));
}

export async function upsertAdminPlan(input: UpsertPlanInput) {
  const payload = {
    ...(input.id ? { id: input.id } : {}),
    name: input.name,
    pricePerMonth: input.pricePerMonth,
    currency: input.currency,
    featuresCsv: toCsv(input.features),
    isActive: input.isActive,
    ...(input.type ? { type: input.type } : {}),
  };
  const { data } = await api.post('/admin/plans', payload);
  return data as AdminPlan;
}
export async function updateAdminPlan(id: string, input: Omit<UpsertPlanInput, 'id'>) {
  const payload = {
    name: input.name,
    pricePerMonth: input.pricePerMonth,
    currency: input.currency,
    featuresCsv: toCsv(input.features),
    isActive: input.isActive,
    ...(input.type ? { type: input.type } : {}),
  };
  const { data } = await api.patch(`/admin/plans/${id}`, payload);
  return data as AdminPlan;
}
export async function toggleAdminPlan(id: string) {
  const { data } = await api.patch(`/admin/plans/${id}/toggle`);
  return data as AdminPlan;
}
export async function deleteAdminPlan(id: string) {
  const { data } = await api.delete(`/admin/plans/${id}`);
  return data as { success: true };
}
