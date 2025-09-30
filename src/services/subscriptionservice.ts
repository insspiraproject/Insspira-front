import axios from "axios";


export type PlanType = "monthly" | "annual";

export async function createSubscription(
  plan: PlanType,
  email: string,
  userId?: string
): Promise<{ init_point: string }> {
  if (!email) throw new Error("Email del usuario requerido");

  const endpoint = `https://api-latest-ejkf.onrender.com/subscriptions/${plan}`;

  const res = await axios.post(endpoint, { email, userId });

  const init_point = res.data.init_point;
  if (!init_point) {
    throw new Error("No se encontró sandbox_init_point en la respuesta del backend");
  }

  return { init_point };
}