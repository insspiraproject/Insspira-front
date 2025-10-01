// src/types/ui.ts
export type UISubscriptionPlan = "Free" | "Pro" | "Business" | "Plus";
export type UISubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

export type UISubscription = {
  plan: UISubscriptionPlan;
  status: UISubscriptionStatus;
  startedAt: string;       // ISO
  renewsAt?: string;       // ISO
  pricePerMonth: number;
  currency: "USD" | "ARS";
  features: string[];
};

export type UIPaymentMethod = "CARD" | "PSE" | "NEQUI" | "CASH";
export type UIPaymentStatus = "paid" | "cancelled" | "expired" | "pending";

export type UIPayment = {
  id: string;
  date: string;          // ISO
  description: string;
  method: UIPaymentMethod;
  status: UIPaymentStatus;
  amount: number;
  currency: "USD" | "ARS";
};

export type Post = {
  id: string;
  title: string;
  imageUrl: string;
  stats: { likes: number; views: number };
  createdAt: string; // ISO
  tags: string[];
};

export type UserProfile = {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  avatar: string;
  bio?: string | null;
  joinDate: string;    // ISO
  postsCount: number;
  subscription: UISubscription;
  payments: UIPayment[];
};
