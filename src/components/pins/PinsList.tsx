'use client'

import PinsCard from "@/components/pins/PinsCard";
import { useEffect, useState } from "react";

import type { IPins } from "@/interfaces/IPins";
import {getAllPins} from "@/services/pins.services";
interface PinsListProps {
  searchResults: IPins[] | null;
}

const PinsList: React.FC<PinsListProps> = ({ searchResults }) => {
  const [allPins, setAllPins] = useState<IPins[]>([]);

  useEffect(() => {
    if (searchResults === null) { // solo fetch si no hay búsqueda
      const fetchPins = async () => {
        const data = await getAllPins();
        setAllPins(data || []);
      };
      fetchPins();
    }
  }, [searchResults]);

  const displayedPins = searchResults !== null ? searchResults : allPins;

  const normalizePin = (pin: IPins): IPins => ({
    ...pin,
    image: pin.image?.trim() ? pin.image : "/architecture.jpg",
  });

  return (
    <div className="flex justify-center h-auto py-3 px-4 bg-gradient-to-r from-[#0E172B] to-[#1B273B]">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10">
        {displayedPins.map(pin => (
          <PinsCard key={pin.id} pin={normalizePin(pin)} />
        ))}
        {displayedPins.length === 0 && <p>No se encontraron resultados</p>}
      </div>
    </div>
  );
};

export default PinsList;