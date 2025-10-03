'use client'

import { useState } from "react";
import { createSubscription, PlanType } from "@/services/subscriptionservice";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function Subscriptions() {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
const { user } = useAuth();

  const plans = [
    {
      type: "monthly" as const,
      name: "Monthly Plan",
      price: 0.10,
      currency: "USD",
      description: "Pay month-to-month",
      features: "Unlimited pins, likes, saves, and comments"
    },
    {
      type: "annual" as const,
      name: "Annual Plan",
      price: 0.30,
      currency: "USD",
      description: "Save 20% with yearly payment",
      features: "Unlimited pins, likes, saves, and comments"
    }
  ];

    

const handleSubscribe = async (plan: PlanType) => {

    if (!user) return toast.info("Debes estar logueado para suscribirte");

    setLoadingPlan(plan);

    try {
          const res = await createSubscription(plan, user.email, user.id);
    
    const init_point = res?.init_point;
    if (!init_point) {
      return toast.error("No se pudo iniciar el pago. Intenta nuevamente.");
    }
    window.location.href = init_point;
    } catch (err: unknown) {
  console.error(err);

  const message = err instanceof Error ? err.message : "Failed to initiate the payment. Please try again.";

  toast.error(message);
}
   finally {
      setLoadingPlan(null);
    }
  };
  return (
  <div className="w-full min-h-screen flex justify-center items-center bg-[var(--color-violeta)] px-4 py-8 gap-8 flex-wrap">
    <style jsx>{`
      @property --border-angle {
        syntax: "<angle>";
        inherits: true;
        initial-value: 0deg;
      }
      @keyframes border-spin {
        100% { --border-angle: 360deg; }
      }
      .animate-border { animation: border-spin 6s linear infinite; }
    `}</style>

    {plans.map((plan) => (
      <div
        key={plan.type}
        className="relative w-80 p-[4px] rounded-2xl animate-border [background:conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,theme(colors.teal.500)_86%,theme(colors.cyan.300)_90%,theme(colors.teal.500)_94%,theme(colors.slate.600/.48))]"
      >
        <div className="bg-[var(--color-gris)] rounded-2xl shadow-md p-6 flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-2xl font-bold mb-4 text-center">{plan.name}</h2>
          <p className="text-gray-600 mb-6 text-center">{plan.description}</p>
          <p className="text-3xl font-semibold mb-6 text-center">
            {plan.currency} {plan.price} {plan.type === "annual" ? "/ year" : "/ month"}
          </p>
          
          {/* Features en una sola línea */}
          <ul className="mb-6 text-center text-gray-700">
            <li>
              ✔ {plan.features.split(",").map(f => f.trim()).join(" • ")}
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe(plan.type)}
            disabled={loadingPlan === plan.type}
            className="w-full bg-[var(--color-morado)] text-white py-2 rounded-full hover:bg-[var(--color-rosa)] transition-colors disabled:opacity-50"
          >
            {loadingPlan === plan.type ? "Redirecting..." : `Choose ${plan.name}`}
          </button>
        </div>
      </div>
    ))}
  </div>
);
}