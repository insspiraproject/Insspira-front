// src/mocks/adminMocks.ts
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "superadmin" | "admin";
  since: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  status: "active" | "suspended";
  createdAt: string;
  posts: number;
  plan: "Free" | "Pro" | "Business" | "Plus";
}

export interface Report {
  id: string;
  postId: string;
  reportedBy: string;
  reason: "spam" | "violence" | "copyright" | "other";
  details?: string;
  createdAt: string;
  status: "open" | "resolved" | "dismissed";
}

export interface AdminSubscription {
  id: string;
  userId: string;
  plan: "Free" | "Pro" | "Business" | "Plus";
  status: "active" | "canceled" | "past_due" | "trialing";
  startedAt: string;
  renewsAt?: string;
  pricePerMonth: number;
  currency: "USD" | "COP";
}

export interface AdminPayment {
  id: string;
  userId: string;
  date: string;
  amount: number;
  currency: "USD" | "COP";
  method: "CARD" | "PSE" | "NEQUI" | "CASH";
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  description: string;
}

export interface Plan {
  id: string;
  name: "Free" | "Pro" | "Plus" | "Business";
  pricePerMonth: number;
  currency: "USD" | "COP";
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export const adminProfile: AdminProfile = {
  id: "admin_001",
  name: "Admin Insspira",
  email: "admin@insspira.app",
  avatar:
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop",
  role: "superadmin",
  since: "2023-11-15",
};

export const managedUsers: ManagedUser[] = [
  {
    id: "u_001",
    name: "Fabian Romero",
    username: "facu.dev",
    email: "facu@example.com",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop",
    status: "active",
    createdAt: "2024-02-10",
    posts: 18,
    plan: "Pro",
  },
  {
    id: "u_002",
    name: "Ana López",
    username: "analpz",
    email: "ana@example.com",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    status: "active",
    createdAt: "2024-06-21",
    posts: 7,
    plan: "Free",
  },
  {
    id: "u_003",
    name: "Carlos Pérez",
    username: "cperez",
    email: "carlos@example.com",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop",
    status: "suspended",
    createdAt: "2025-01-03",
    posts: 3,
    plan: "Pro",
  },
];

export const reports: Report[] = [
  {
    id: "r_001",
    postId: "p_003",
    reportedBy: "u_002",
    reason: "copyright",
    details: "Posible uso no autorizado de imagen.",
    createdAt: "2025-08-20",
    status: "open",
  },
  {
    id: "r_002",
    postId: "lp_102",
    reportedBy: "u_003",
    reason: "spam",
    createdAt: "2025-09-02",
    status: "open",
  },
  {
    id: "r_003",
    postId: "p_001",
    reportedBy: "u_002",
    reason: "other",
    details: "Contenido fuera de temática.",
    createdAt: "2025-07-11",
    status: "resolved",
  },
];

export const adminSubscriptions: AdminSubscription[] = [
  {
    id: "s_001",
    userId: "u_001",
    plan: "Pro",
    status: "active",
    startedAt: "2024-03-01",
    renewsAt: "2025-10-01",
    pricePerMonth: 9.99,
    currency: "USD",
  },
  {
    id: "s_002",
    userId: "u_002",
    plan: "Free",
    status: "active",
    startedAt: "2024-06-21",
    pricePerMonth: 0,
    currency: "USD",
  },
  {
    id: "s_003",
    userId: "u_003",
    plan: "Pro",
    status: "past_due",
    startedAt: "2025-01-03",
    renewsAt: "2025-09-01",
    pricePerMonth: 9.99,
    currency: "USD",
  },
];

export const adminPayments: AdminPayment[] = [
  {
    id: "ap_001",
    userId: "u_001",
    date: "2025-09-01",
    amount: 9.99,
    currency: "USD",
    method: "CARD",
    status: "PAID",
    description: "Renovación Pro (sept)",
  },
  {
    id: "ap_002",
    userId: "u_003",
    date: "2025-09-01",
    amount: 9.99,
    currency: "USD",
    method: "CARD",
    status: "FAILED",
    description: "Renovación Pro (sept)",
  },
  {
    id: "ap_003",
    userId: "u_001",
    date: "2025-08-01",
    amount: 9.99,
    currency: "USD",
    method: "CARD",
    status: "PAID",
    description: "Renovación Pro (ago)",
  },
  {
    id: "ap_004",
    userId: "u_001",
    date: "2025-07-01",
    amount: 9.99,
    currency: "USD",
    method: "CARD",
    status: "PAID",
    description: "Renovación Pro (jul)",
  },
];

export const adminPlans: Plan[] = [
  {
    id: "pl_free",
    name: "Free",
    pricePerMonth: 0,
    currency: "USD",
    features: ["Subidas limitadas", "Perfil público"],
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "pl_pro",
    name: "Pro",
    pricePerMonth: 9.99,
    currency: "USD",
    features: ["Subidas ilimitadas", "Analíticas básicas", "Carpetas privadas"],
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "pl_plus",
    name: "Plus",
    pricePerMonth: 14.99,
    currency: "USD",
    features: ["Todo Pro", "Analíticas avanzadas", "Prioridad en descubrimiento"],
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    id: "pl_business",
    name: "Business",
    pricePerMonth: 29.99,
    currency: "USD",
    features: ["Equipos", "SSO", "Soporte dedicado"],
    isActive: false,
    createdAt: "2025-06-01",
  },
];
