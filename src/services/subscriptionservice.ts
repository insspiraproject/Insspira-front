import axios from "axios";
export async function createSubscription(plan: "monthly" | "annual", email: string, userId?: string) {
  const response = await axios.post(`https://api-latest-ejkf.onrender.com/subscriptions/${plan}`, { email, userId });
  return response.data; 
}