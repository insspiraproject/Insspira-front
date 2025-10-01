// src/view/admin/AdminView.tsx
"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import AdminShell from "@/components/dashboard/admin/AdminShell";

export default function AdminView() {
  return (
    <RequireAuth role="admin" fallback={<div className="text-white p-6">Loading...</div>}>
      <AdminShell />;
    </RequireAuth>
  )
}

