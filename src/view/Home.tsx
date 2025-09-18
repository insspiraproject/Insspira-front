'use client'

import { useEffect } from "react";
import PinsList from "@/components/pins/PinsList";
import { usePinsSearch } from "@/hooks/pins/usePinsSearch";
import { saveTokenFromQueryAndHydrateAuth } from "@/services/authservice";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { results } = usePinsSearch();
  const { setAuth } = useAuth();

  useEffect(() => {
    // Si vienes de Auth0 con ?token=..., lo guardamos y actualizamos el AuthContext
    saveTokenFromQueryAndHydrateAuth(setAuth);
  }, [setAuth]);

  return (
    <div>
      <PinsList searchResults={results} />
    </div>
  );
};

export default Home;
