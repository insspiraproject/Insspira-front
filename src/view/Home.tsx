'use client'


import PinsList from "@/components/pins/PinsList";
import { usePinsSearch } from "@/hooks/pins/usePinsSearch";


const Home = () => {
  const { results } = usePinsSearch();

  return (
    <div>
        <PinsList searchResults={results} />
    </div>
  );
};

export default Home;