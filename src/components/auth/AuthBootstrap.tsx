"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMe } from "@/services/authservice";

export default function AuthBootstrap() {
  const { setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("googleLogin") === "success") {
      getMe()
        .then(user => {
          if (user) setAuth(user, null); // hidrata correctamente el contexto
        })
        .catch(err => console.error("Error obteniendo usuario Google:", err));
    }
  }, [setAuth]);

  return null;
}