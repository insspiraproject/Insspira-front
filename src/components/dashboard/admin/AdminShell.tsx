// src/components/admin/AdminShell.tsx
"use client";

import { useState } from "react";
import AdminSidebar, { type AdminTabKey } from "./AdminSidebar";
import OverviewCards from "./OverviewCards";
import UsersTable from "./UsersTable";
import ReportsTable from "./ReportsTable";
import SubscriptionsTable from "./SubscriptionsTable";
import PaymentsTable from "./PaymentsTable";
import AdminProfileCard from "./AdminProfileCard";
import AdminCharts from "./AdminCharts";
import PlansTable from "./PlansTable";

export default function AdminShell() {
  const [active, setActive] = useState<AdminTabKey>("overview");

  return (
    <div className="mx-auto w-full max-w-7xl grid md:grid-cols-[260px_1fr] items-start gap-6">
      <AdminSidebar active={active} onChange={setActive} />
      <section className="space-y-6">
        {active === "overview" && (
          <>
            <OverviewCards />
            <AdminCharts />
          </>
        )}
        {active === "users" && <UsersTable />}
        {active === "reports" && <ReportsTable />}
        {active === "subscriptions" && <SubscriptionsTable />}
        {active === "payments" && <PaymentsTable />}
        {active === "plans" && <PlansTable />}
        {active === "profile" && <AdminProfileCard />}
      </section>
    </div>
  );
}