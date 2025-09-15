// 'use client'

// import PinsList from "@/components/pins/PinsList";
// import { useSearch } from "@/context/Search/SearchContext";

// const Home = () => {
//   const { results, loading, error } = useSearch();

//   return (
//     <div>
//       {loading && <p>Cargando...</p>}
//       {error && <p>{error}</p>}
//       <PinsList searchResults={results} />
//     </div>
//   );
// }

// export default Home;

'use client'

import { useEffect } from "react";
import PinsList from "@/components/pins/PinsList";
import { useSearch } from "@/context/Search/SearchContext";
import { saveTokenFromQuery } from "@/services/authservice";

const Home = () => {
  const { results, loading, error } = useSearch();

  useEffect(() => {
    // Extrae token de la URL si viene de Auth0 y lo guarda en localStorage
    saveTokenFromQuery();
  }, []);

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <PinsList searchResults={results} />
    </div>
  );
}

export default Home;
