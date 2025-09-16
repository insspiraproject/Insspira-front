// src/app/admin/page.tsx
import RequireAuth from "@/components/auth/RequireAuth";
import AdminView from "@/view/dashboard/admin/AdminView";

export const metadata = {
  title: "Admin | Insspira",
};

export default function Page() {
  return (
    <RequireAuth role="admin" fallback={<div className="text-white p-6">Loading...</div>}>
    <main className="min-h-dvh w-full bg-[var(--color-violeta)] px-4 py-6 md:py-10 text-white">
      <AdminView />
    </main>
    </RequireAuth>
  );
}
