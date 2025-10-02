"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGateProps {
  children: React.ReactNode;
  requireAuth?: boolean; // si true, redirige a login si no hay user
}

export default function AuthGate({ children, requireAuth = false }: AuthGateProps) {
  const { isChecking, isHydrated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isChecking && isHydrated && requireAuth && !user) {
      router.push("/login");
    }
  }, [isChecking, isHydrated, requireAuth, user, router]);

  if (!isHydrated || (requireAuth && isChecking)) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span>Cargando sesión...</span>
      </div>
    );
  }

  return <>{children}</>;
}