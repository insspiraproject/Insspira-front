"use client";
import { useAuth } from "@/context/AuthContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isChecking, isHydrated } = useAuth();

  if (!isHydrated || isChecking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span>Cargando sesión...</span>
      </div>
    );
  }

  return <>{children}</>;
}