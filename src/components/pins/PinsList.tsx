'use client'

import PinsCard from "@/components/pins/PinsCard";
import PinModal from "./PinModal";
import { useEffect, useState } from "react";
import type { IPins } from "@/interfaces/IPins";
import { getAllPins, addView } from "@/services/pins.services";

interface PinsListProps {
  searchResults: IPins[] | null;
}



export default function PinsList({ searchResults }: PinsListProps) {
  const [allPins, setAllPins] = useState<IPins[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pinSelected, setPinSelected] = useState<string | null>(null);

  const [likesState, setLikesState] = useState<
    Record<string, { liked: boolean; likesCount: number }>
  >({});

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

  useEffect(() => {
    if (displayedPins.length === 0) return;
  
    const initialState = displayedPins.reduce((acc, pin) => {
      acc[pin.id] = {
        liked: pin.liked ?? false,  // <- aquí usamos 'liked' del backend
        likesCount: pin.likesCount
      };
      return acc;
    }, {} as Record<string, { liked: boolean; likesCount: number }>);
  
    setLikesState(initialState);
  }, [displayedPins]);
  

  useEffect(() => {
    if (pinSelected && displayedPins.every(pin => pin.id !== pinSelected)) {
      setIsOpen(false);
      setPinSelected(null);
    }
  }, [displayedPins, pinSelected]);

  const normalizePin = (pin: IPins): IPins => ({
    ...pin,
    image: pin.image?.trim() ? pin.image : "/architecture.jpg",
  });


   

  return (
    <div className="flex justify-center h-auto px-4 bg-gradient-to-r from-[#0E172B] to-[#1B273B]">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10">
        {displayedPins.map(pin => (
          <PinsCard
            key={pin.id}
            pin={normalizePin(pin)}
            likesState={likesState[pin.id] ?? { liked: false, likesCount: 0 }}
            setLikesState={(newState) =>
              setLikesState(prev => ({ ...prev, [pin.id]: newState }))
            }
          
            onOpenModal={() => {
              setPinSelected(pin.id);
              setIsOpen(true);
              addView(pin.id)
            }}
          />
        ))}
        {displayedPins.length === 0 && (
          <p className="text-white col-span-full text-center mt-4">
            No se encontraron resultados
          </p>
        )}
      </div>

      {isOpen && pinSelected && (
        <PinModal
          id={pinSelected}
          likesState={likesState[pinSelected] ?? { liked: false, likesCount: 0 }}
          setLikesState={(newState) =>
            setLikesState(prev => ({ ...prev, [pinSelected]: newState }))
          }
          onClose={() => {
            setIsOpen(false);
            setPinSelected(null);
          }}
        />
      )}
    </div>
  );
}
