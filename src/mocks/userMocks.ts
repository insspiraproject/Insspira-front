// src/mocks/userMocks.ts
export type Currency = "USD" | "COP" | "EUR";

export interface Post {
  id: string;
  imageUrl: string;
  title: string;
  tags: string[];
  stats: { likes: number; views: number };
  createdAt: string; // ISO
}

export interface Payment {
  id: string;
  date: string; // ISO
  amount: number;
  currency: Currency;
  method: "CARD" | "PSE" | "NEQUI" | "CASH";
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  description: string;
}

export interface Subscription {
  plan: "Free" | "Pro" | "Business" | "Plus";
  status: "active" | "canceled" | "past_due" | "trialing";
  startedAt: string;
  renewsAt?: string;
  pricePerMonth: number;
  currency: Currency;
  features: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  postsCount: number;
  joinDate: string;
  subscription: Subscription;
  payments: Payment[];
}

export const currentUser: UserProfile = {
  id: "u_001",
  name: "Fabian Romero",
  username: "facu.dev",
  email: "facu@example.com",
  avatar:
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&auto=format&fit=crop",
  bio: "Full-stack dev. Café, código y pines bonitos ☕️💻",
  postsCount: 18,
  joinDate: "2024-02-10",
  subscription: {
    plan: "Pro",
    status: "active",
    startedAt: "2024-03-01",
    renewsAt: "2025-10-01",
    pricePerMonth: 9.99,
    currency: "USD",
    features: [
      "Subidas ilimitadas",
      "Analíticas básicas",
      "Carpetas privadas",
      "Soporte prioritario",
    ],
  },
  payments: [
    {
      id: "pay_001",
      date: "2025-07-01",
      amount: 9.99,
      currency: "USD",
      method: "CARD",
      status: "PAID",
      description: "Renovación plan Pro (julio)",
    },
    {
      id: "pay_002",
      date: "2025-08-01",
      amount: 9.99,
      currency: "USD",
      method: "CARD",
      status: "PAID",
      description: "Renovación plan Pro (agosto)",
    },
    {
      id: "pay_003",
      date: "2025-09-01",
      amount: 9.99,
      currency: "USD",
      method: "CARD",
      status: "PAID",
      description: "Renovación plan Pro (septiembre)",
    },
  ],
};

export const currentUserPosts: Post[] = [
  {
    id: "p_001",
    imageUrl:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=900&auto=format&fit=crop",
    title: "Atardecer minimal",
    tags: ["#sunset", "#minimal", "#inspo"],
    stats: { likes: 233, views: 2140 },
    createdAt: "2025-06-10",
  },
  {
    id: "p_002",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
    title: "Paleta morada",
    tags: ["#ui", "#palette", "#tailwind"],
    stats: { likes: 178, views: 1835 },
    createdAt: "2025-05-22",
  },
  {
    id: "p_003",
    imageUrl:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=900&auto=format&fit=crop",
    title: "Diseño limpio",
    tags: ["#ux", "#clean", "#grid"],
    stats: { likes: 320, views: 2544 },
    createdAt: "2025-05-05",
  },
];

export const currentUserLikedPosts: Post[] = [
  {
    id: "lp_101",
    imageUrl:
      "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=900&auto=format&fit=crop",
    title: "Moodboard violetas",
    tags: ["#mood", "#violet", "#aesthetic"],
    stats: { likes: 540, views: 6210 },
    createdAt: "2025-04-18",
  },
  {
    id: "lp_102",
    imageUrl:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=900&auto=format&fit=crop",
    title: "Animaciones suaves",
    tags: ["#microinteractions", "#motion"],
    stats: { likes: 410, views: 4480 },
    createdAt: "2025-03-08",
  },
  {
    id: "lp_103",
    imageUrl:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=900&auto=format&fit=crop",
    title: "Tipografías top",
    tags: ["#fonts", "#typography"],
    stats: { likes: 210, views: 1990 },
    createdAt: "2025-01-25",
  },
];
