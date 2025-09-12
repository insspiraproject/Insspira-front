// src/app/dashboard/page.tsx
import DashboardView from "@/view/dashboard/DashboardView";

export const metadata = {
  title: "Tu Dashboard | Insspira",
};

export default function Page() {
  return (
    <main className="min-h-dvh w-full bg-[var(--color-violeta)] px-4 py-6 md:py-10">
      <DashboardView />
    </main>
  );
}
