// src/components/admin/AdminCharts.tsx
"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { adminPayments, adminSubscriptions, managedUsers, reports } from "@/mocks/adminMocks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactECharts: any = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function AdminCharts() {
  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>(); // YYYY-MM -> sum
    adminPayments
      .filter((p) => p.status === "PAID" && p.currency === "USD")
      .forEach((p) => {
        const key = p.date.slice(0, 7);
        map.set(key, (map.get(key) ?? 0) + p.amount);
      });
    // último 6 meses (simple)
    const months = Array.from(map.keys()).sort().slice(-6);
    return {
      categories: months,
      data: months.map((m) => Number((map.get(m) ?? 0).toFixed(2))),
    };
  }, []);

  const planDistribution = useMemo(() => {
    const map = new Map<string, number>();
    adminSubscriptions.forEach((s) => {
      map.set(s.plan, (map.get(s.plan) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const reportsByReason = useMemo(() => {
    const map = new Map<string, number>();
    reports.forEach((r) => {
      map.set(r.reason, (map.get(r.reason) ?? 0) + 1);
    });
    return {
      categories: Array.from(map.keys()),
      data: Array.from(map.values()),
    };
  }, []);

  const newUsersByMonth = useMemo(() => {
    const map = new Map<string, number>();
    managedUsers.forEach((u) => {
      const key = u.createdAt.slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    const months = Array.from(map.keys()).sort().slice(-6);
    return { categories: months, data: months.map((m) => map.get(m) ?? 0) };
  }, []);

  return (
    <section className="grid lg:grid-cols-2 gap-6 text-white">
      {/* Revenue area */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="mb-2 font-semibold">Ingresos últimos meses (USD)</div>
        <ReactECharts
          option={{
            grid: { left: 28, right: 16, top: 24, bottom: 24 },
            xAxis: { type: "category", data: revenueByMonth.categories, boundaryGap: false },
            yAxis: { type: "value" },
            tooltip: { trigger: "axis" },
            series: [
              {
                type: "line",
                smooth: true,
                areaStyle: {},
                data: revenueByMonth.data,
              },
            ],
          }}
          style={{ height: 260 }}
        />
      </div>

      {/* Plan distribution */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="mb-2 font-semibold">Distribución de planes</div>
        <ReactECharts
          option={{
            tooltip: { trigger: "item" },
            legend: { bottom: 0 },
            series: [
              {
                type: "pie",
                radius: ["35%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 1 },
                label: { show: true, formatter: "{b}: {d}%" },
                data: planDistribution,
              },
            ],
          }}
          style={{ height: 260 }}
        />
      </div>

      {/* Reports by reason */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="mb-2 font-semibold">Reportes por motivo</div>
        <ReactECharts
          option={{
            grid: { left: 28, right: 16, top: 24, bottom: 24 },
            xAxis: { type: "category", data: reportsByReason.categories },
            yAxis: { type: "value" },
            tooltip: { trigger: "axis" },
            series: [
              {
                type: "bar",
                data: reportsByReason.data,
                barWidth: "40%",
              },
            ],
          }}
          style={{ height: 260 }}
        />
      </div>

      {/* Nuevos usuarios */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="mb-2 font-semibold">Altas de usuarios</div>
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
