'use client'

import PinsList from "@/components/pins/PinsList";
import { useSearchContext } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { saveTokenFromQueryAndHydrateAuth } from "@/services/authservice";

export default function Home() {
  const { results } = useSearchContext();
  const { setAuth } = useAuth();

  useEffect(() => {
    saveTokenFromQueryAndHydrateAuth(setAuth);
  }, [setAuth]);

  return (
    <div>
      <PinsList searchResults={results} />
    </div>
  );
}
