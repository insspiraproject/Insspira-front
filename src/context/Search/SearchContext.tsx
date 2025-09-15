'use client'

import { createContext, useContext, useState, ReactNode } from "react";
import { searchPins } from "@/services/pins/pins.services"; // tu servicio de búsqueda
import type { IPins } from "@/interfaces/IPins";

interface SearchContextProps {
  results: IPins[] | null;
  loading: boolean;
  error: string | null;
  performSearch: (query: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<IPins[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await searchPins(query);
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setError("Error al buscar pines");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{ results, loading, error, performSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};