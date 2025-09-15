'use client'

import { useEffect, useState } from "react";
import type { IPins } from "@/interfaces/IPins";
import { getPinById } from "@/services/pins/pins.services";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { FaCommentDots } from "react-icons/fa";

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
      <div className="bg-gradient-to-r from-[#0E172B]/90 to-[#1B273B]/90 rounded-lg flex h-[550px] w-auto">
        {/* Container izquierda: Imagen */}
        <div className="relative w-auto h-full flex-shrink-0">
          <Image
            src={pin.image}
            alt="Pin photo"
            width={300}
            height={550}
            className="object-cover h-full"
          />
        </div>
  
        {/* Container derecha: Contenido */}
        <div className="w-[350px] p-6 flex flex-col h-full relative">
          {/* Botón cerrar */}
            
            <IoClose className="absolute top-4 right-4"
            size={40} color="white"
            onClick={onClose}/>
  
          {/* Contenido principal */}
          <div className="mt-2">
            <h3>{pin.user}</h3>
            <p className="mt-2">{pin.description}</p>
          </div>
          <div className="flex justify-baseline items-center">
            <FcLike />
            <span>{pin.likesCount}</span>
            <FaCommentDots />
            <span>{pin.commentsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default PinModal;
