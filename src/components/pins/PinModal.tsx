'use client'

import { useEffect, useState } from "react";
import type { IPins } from "@/interfaces/IPins";
import { getPinById } from "@/services/pins/pins.services";
import Image from "next/image";

interface PinModalProps {
  id: string;
  onClose: () => void;
}

const PinModal: React.FC<PinModalProps> = ({ id, onClose }) => {
  const [pin, setPin] = useState<IPins | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPin = async () => {
      setLoading(true);
      const data = await getPinById(id);
      setPin(data);
      setLoading(false);
    };
    fetchPin();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">Cargando...</div>
      </div>
    );
  }

  if (!pin) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>No se encontró el pin</p>
          <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-t-xl overflow-hidden">
          <Image src={pin.image} alt="Pin photo" fill className="object-cover" />
        </div>
        <h2 className="text-xl font-bold mt-2">{pin.user}</h2>
        <p className="mt-2">{pin.description}</p>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PinModal;
