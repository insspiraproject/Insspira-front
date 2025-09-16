// src/components/auth/RequireAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({
  children,
  role,
  fallback = null,
}: {
  children: React.ReactNode;
  role?: "admin" | "user";
  fallback?: React.ReactNode;
}) {
  const router = useRouter();
  const { isHydrated, isChecking, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isHydrated || isChecking) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (role === "admin" && !isAdmin) {
      router.replace("/home");
    }
  }, [isHydrated, isChecking, isAuthenticated, isAdmin, role, router]);

  if (!isHydrated || isChecking) return fallback;
  return <>{children}</>;
}
