// src/components/admin/OverviewCards.tsx
"use client";

import { adminPayments, adminSubscriptions, managedUsers, reports } from "@/mocks/adminMocks";

function sumRevenueUSD() {
  return adminPayments
    .filter((p) => p.status === "PAID" && p.currency === "USD")
    .reduce((acc, p) => acc + p.amount, 0);
}

export default function OverviewCards() {
  const totalUsers = managedUsers.length;
  const activeSubs = adminSubscriptions.filter((s) => s.status === "active").length;
  const openReports = reports.filter((r) => r.status === "open").length;
  const revenue = sumRevenueUSD();

  const card =
    "rounded-2xl bg-white/5 border border-white/10 p-4 text-white shadow";

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className={card}>
        <div className="text-sm opacity-80">Usuarios</div>
        <div className="text-2xl font-semibold">{totalUsers}</div>
      </div>
      <div className={card}>
        <div className="text-sm opacity-80">Suscripciones activas</div>
        <div className="text-2xl font-semibold">{activeSubs}</div>
      </div>
      <div className={card}>
        <div className="text-sm opacity-80">Reportes abiertos</div>
        <div className="text-2xl font-semibold">{openReports}</div>
      </div>
      <div className={card}>
        <div className="text-sm opacity-80">Ingresos (USD)</div>
        <div className="text-2xl font-semibold">${revenue.toFixed(2)}</div>
      </div>
    </div>
  );
}
