// src/hooks/user/Auth0.tsx (rama funcional)
import { useEffect, useState } from "react";
import { getMe } from "@/services/authservice";
import { AuthUser } from "@/services/authservice";

export const useUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
};