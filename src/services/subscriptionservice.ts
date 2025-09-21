import axios from "axios";

export async function createSubscription(plan: "monthly" | "annual", email: string, userId?: string) {
  const response = await axios.post("http://localhost:3001/mercadopago/subscription", {
    plan,
    email,
    userId,
  });

  return response.data; // acá viene { success, id, init_point, ... }
}