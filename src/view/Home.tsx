'use client'

import PinsList from "@/components/pins/PinsList";
import { useSearchContext } from "@/context/SearchContext";



export default function Home() {
  const { results } = useSearchContext();



  return (
    <div>
      <PinsList searchResults={results} />
    </div>
  );
}
