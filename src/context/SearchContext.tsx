// context/SearchContext.tsx
'use client'
import { createContext, useContext, ReactNode } from "react";
import { usePinsSearch } from "@/hooks/pins/usePinsSearch";
import type { IPins } from "@/interfaces/IPins";

interface SearchContextValue {
  results: IPins[] | null;
  performSearch: (query: string) => void;
}

export const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const { results, performSearch } = usePinsSearch();

  return (
    <SearchContext.Provider value={{ results, performSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchContext must be used within <SearchProvider>");
  return ctx;
};
