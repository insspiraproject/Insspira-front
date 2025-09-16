// src/components/dashboard/SubscriptionModal.tsx
"use client";

import { Subscription, Payment } from "@/mocks/userMocks";
import { FiX } from "react-icons/fi";

export default function SubscriptionModal({
  open,
  onClose,
  subscription,
  payments,
}: {
  open: boolean;
  onClose: () => void;
  subscription: Subscription;
  payments: Payment[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-[var(--color-violeta)] text-white border border-white/10 shadow-2xl">
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg font-semibold">Subscription Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="p-5 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h3 className="font-semibold mb-2">Plan</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <strong>Plan:</strong> {subscription.plan}
              </li>
              <li>
                <strong>Status:</strong> {subscription.status}
              </li>
              <li>
                <strong>Start:</strong>{" "}
                {new Date(subscription.startedAt).toLocaleDateString()}
              </li>
              {subscription.renewsAt && (
                <li>
                  <strong>Renews:</strong>{" "}
                  {new Date(subscription.renewsAt).toLocaleDateString()}
                </li>
              )}
              <li>
                <strong>Price:</strong> {subscription.pricePerMonth}{" "}
                {subscription.currency}/month
              </li>
            </ul>
            <h4 className="font-semibold mt-4 mb-1">Benefits</h4>
            <ul className="list-disc list-inside text-sm text-white/90">
              {subscription.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h3 className="font-semibold mb-2">Payments</h3>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b border-white/10">
                  <tr className="[&>th]:py-2">
                    <th>Date</th>
                    <th>Description</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody className="[&>tr>td]:py-2">
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-white/5">
                      <td>{new Date(p.date).toLocaleDateString()}</td>
                      <td className="pr-2">{p.description}</td>
                      <td>{p.method}</td>
                      <td>{p.status}</td>
                      <td className="whitespace-nowrap">
                        {p.amount} {p.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}