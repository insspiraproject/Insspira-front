'use client'

import { useEffect, useState } from "react";
import getAllPins from "@/services/pins/pins.services";
import PinsCard from "@/components/PinsCard";
import type { IPins } from "@/interfaces/IPins";

const normalizePin = (pin: IPins): IPins => ({
  ...pin,
  image:
    typeof pin.image === "string" && pin.image.trim()
      ? pin.image
      : "/architecture.jpg",
});

const PinsList = () => {
  const [pins, setPins] = useState<IPins[]>([]);

  useEffect(() => {
    const fetchPins = async () => {
      const data = await getAllPins();
      setPins(data || []);
    };
    fetchPins();
  }, []);

  return (
    <div className="flex justify-center h-auto bg-gradient-to-tr to-slate-300 from-slate-500 py-3 px-4">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10">
        {pins.map((pin) => (
          <PinsCard key={pin.id} pin={normalizePin(pin)} />
        ))}
      </div>
    </div>
  );
};

export default PinsList;
