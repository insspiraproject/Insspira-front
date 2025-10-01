// src/services/subscriptionservice.ts
import axios, { type AxiosRequestHeaders } from "axios";

const API_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const api = axios.create({ baseURL: API_URL, withCredentials: true });

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

/**
 * Crea una suscripción.
 * - monthly: tu backend toma el usuario desde req.user (JWT). No necesita body.
 * - annual: tu backend actual pide email en el body.
 */
export async function createSubscription(
  plan: "monthly" | "annual",
  email?: string
) {
  if (plan === "monthly") {
    const { data } = await api.post("/subscriptions/monthly");
    return data;
  } else {
    if (!email) throw new Error("Email es requerido para la suscripción anual");
    const { data } = await api.post("/subscriptions/annual", { email });
    return data;
  }
}
