'use client'

import { useEffect, useState } from "react";
import type { IPins } from "@/interfaces/IPins";
import { getPinById } from "@/services/pins/pins.services";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import insspira from "../../../public/Insspira.png";
import { AiOutlineEye } from "react-icons/ai";

interface PinModalProps {
  id: string;
  onClose: () => void;
}

interface PinModal {
  name: string;
  image: string;
  description?: string | null;
  likes: number;
  comment: number;
  views: number;
}

const PinModal: React.FC<PinModalProps> = ({ id, onClose }) => {
  const [pin, setPin] = useState<PinModal | null>(null);
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
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">Cargando...</div>
      </div>
    );
  }

  if (!pin) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>No se encontró el pin</p>
          <button onClick={onClose} className="mt-4 bg-[] text-white px-4 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gradient-to-r from-[#0E172B]/90 to-[#1B273B] rounded-lg flex h-[550px] w-auto">
        {/* Container izquierda: Imagen */}
        <div className="relative w-auto h-full flex-shrink-0">
          <Image
            src={pin.image}
            alt="Pin photo"
            width={300}
            height={550}
            className="object-cover h-full rounded-l-lg"
          />
        </div>
  
        {/* Container derecha: Contenido */}
        <div className="w-[350px] p-6 flex flex-col h-full relative">
          
          {/* Botón cerrar */}
            <IoClose className="absolute top-4 right-4"
            size={40} color="white"
            onClick={onClose}/>
  
          {/* Contenido principal */}
          <div className="mt-2 text-[var(--color-blanco)]">
            {/* <h3>{pin.userame}</h3> */}
            <div className="flex justify-baseline items-center">
              <Image
              className="bg-red-500 w-[30px] h-[30px] rounded-full"
                src={insspira}
                alt="User photo"
                />
                <h3 className="font-[montserrat] text-lg ml-2">
                  {pin.name}
                </h3>
            </div>
            <p className="mt-2">{pin.description}</p>
          </div>
          {/*Comentarios */}
          
          <div className="w-[95%] h-[85%] border-[var(--color-gris)] border-2 rounded-t-lg mt-2">
            
          </div>
          <div className="w-[95%] h-[35px] border-[var(--color-gris)] border-2 rounded-b-lg">
              <input className="text-[var(--color-blanco)] w-full h-full pl-2 rounded-b-lg"
              type="text" placeholder="Make a comment"/>
            </div>

          <div className="flex justify-baseline items-center text-white">
            <div className="flex justify-baseline items-center">
              <FcLike/>
              <span className="ml-1">{pin.likes}</span>
            </div>
            <div className="flex justify-baseline items-center ml-2">
              <AiOutlineEye/>
              <span className="ml-1">{pin.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default PinModal;
