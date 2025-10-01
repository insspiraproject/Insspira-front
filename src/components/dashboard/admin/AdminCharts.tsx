// src/components/admin/AdminCharts.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { fetchAdminPayments, fetchAdminSubscriptions, fetchAdminReports, type AdminPayment, type AdminSubscription, type AdminReport } from "@/services/dashboardAdmin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactECharts: any = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function AdminCharts() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);

  useEffect(() => {
    fetchAdminPayments().then(setPayments);
    fetchAdminSubscriptions().then(setSubs);
    fetchAdminReports().then(setReports);
  }, []);

  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>(); // YYYY-MM -> sum
    payments
      .filter((p) => p.status === "PAID" && p.currency === "USD")
      .forEach((p) => {
        const key = p.date.slice(0, 7);
        map.set(key, (map.get(key) ?? 0) + p.amount);
      });
    const months = Array.from(map.keys()).sort().slice(-6);
    return { categories: months, data: months.map((m) => Number((map.get(m) ?? 0).toFixed(2))) };
  }, [payments]);

  const planDistribution = useMemo(() => {
    const map = new Map<string, number>();
    subs.forEach((s) => {
      map.set(s.plan, (map.get(s.plan) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [subs]);

  const reportsByReason = useMemo(() => {
    const map = new Map<string, number>();
    reports.forEach((r) => {
      const k = r.reason ?? "Other";
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    return { categories: Array.from(map.keys()), data: Array.from(map.values()) };
  }, [reports]);

  const newUsersByMonth = useMemo(() => {
    // Si quieres, puedes montar un endpoint /admin/users? desde … y contar createdAt
    // Aquí lo omitimos; si lo implementas, computas igual que revenueByMonth.
    return { categories: [], data: [] };
  }, []);

  return (
    <section className="grid lg:grid-cols-2 gap-6 text-white">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="mb-2 font-semibold">Revenue Last Months (USD)</div>
        <ReactECharts
          option={{
            grid: { left: 28, right: 16, top: 24, bottom: 24 },
            xAxis: { type: "category", data: revenueByMonth.categories, boundaryGap: false },
            yAxis: { type: "value" },
            tooltip: { trigger: "axis" },
            series: [{ type: "line", smooth: true, areaStyle: {}, data: revenueByMonth.data }],
          }}
          style={{ height: 260 }}
        />
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="mb-2 font-semibold">Plan Distribution</div>
        <ReactECharts
          option={{
            tooltip: { trigger: "item" },
            legend: { bottom: 0 },
            series: [{
              type: "pie",
              radius: ["35%", "70%"],
              avoidLabelOverlap: false,
              itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 1 },
              label: { show: true, formatter: "{b}: {d}%" },
              data: planDistribution,
            }],
          }}
          style={{ height: 260 }}
        />
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="mb-2 font-semibold">Reports by Reason</div>
        <ReactECharts
          option={{
            grid: { left: 28, right: 16, top: 24, bottom: 24 },
            xAxis: { type: "category", data: reportsByReason.categories },
            yAxis: { type: "value" },
            tooltip: { trigger: "axis" },
            series: [{ type: "bar", data: reportsByReason.data, barWidth: "40%" }],
          }}
          style={{ height: 260 }}
        />
      </div>

      {/* Puedes implementar New Users si traes /admin/users y cuentas por mes */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="mb-2 font-semibold">New Users</div>
        <ReactECharts
          option={{
            grid: { left: 28, right: 16, top: 24, bottom: 24 },
            xAxis: { type: "category", data: newUsersByMonth.categories, boundaryGap: false },
            yAxis: { type: "value" },
            tooltip: { trigger: "axis" },
            series: [{ type: "line", smooth: true, data: newUsersByMonth.data }],
          }}
          style={{ height: 260 }}
        />
      </div>
    </section>
  );
}
