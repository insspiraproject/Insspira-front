'use client'

import PinsList from "@/components/pins/PinsList";
import { useSearch } from "@/context/Search/SearchContext";

const Home = () => {
  const { results, loading, error } = useSearch();

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <PinsList searchResults={results} />
    </div>
  );
}

export default Home;