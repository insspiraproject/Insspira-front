'use client'

import PinsCard from "@/components/pins/PinsCard";
import { useEffect, useState } from "react";
import type { IPins } from "@/interfaces/IPins";
import { getAllPins } from "@/services/pins/pins.services";
import PinModal from "./PinModal";
interface PinsListProps {
  searchResults: IPins[] | null;
}

const PinsList: React.FC<PinsListProps> = ({ searchResults }) => {
  const [allPins, setAllPins] = useState<IPins[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pinSelected, setPinSelected] = useState<string | null>(null);

  useEffect(() => {
    if (searchResults === null) {
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
      <div className="flex justify-center h-auto px-4 bg-gradient-to-r from-[#0E172B] to-[#1B273B]">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10">
        {displayedPins.map(pin => (
          <div key={pin.id} onClick={() => {
            setPinSelected(pin.id);
            setIsOpen(true);
          }}
          >
            <PinsCard pin={normalizePin(pin)} />
          </div>
        ))}
        {displayedPins.length === 0 && <p>No se encontraron resultados</p>}
      </div>
      {isOpen && pinSelected && (
  <PinModal
    id={pinSelected}
    onClose={() => {
      setIsOpen(false);
      setPinSelected(null);
    }}
  />
)}
    </div>
  );
};

export default PinsList;