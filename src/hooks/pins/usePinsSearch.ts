'use client'

import { useState } from "react";

import type { IPins } from "@/interfaces/IPins";
import { searchPins } from "@/services/pins/pins.services";

export const usePinsSearch = () => {
  const [results, setResults] = useState<IPins[] | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults(null); // sin búsqueda
      return;
    }

    try {
      const data = await searchPins(query);
      setResults(data || []);
    } catch (error) {
      console.error(error);
      setResults([]);
    }
  };

  return { results, performSearch };
};

