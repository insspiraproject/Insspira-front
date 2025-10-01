'use client'

import { useEffect, useState } from "react";
import { getPinById, addLike } from "@/services/pins.services";
import { addComment } from "@/services/pins.services";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { FaRegPaperPlane } from "react-icons/fa6";

interface PinModalProps {
  id: string;
  onClose: () => void;
}

interface PinModalType {
  id: string;
  name: string;
  image: string;
  description?: string | null;
  likes: number;
  comment: number;
  views: number;
  created: string;
}

interface CommentType {
  id: string;
  text: string;
}

const PinModal: React.FC<PinModalProps> = ({ id, onClose }) => {
  const [pin, setPin] = useState<PinModalType | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPin = async () => {
      setLoading(true);
      const data = await getPinById(id);
      setPin(data);
      // Inicializamos comentarios vacíos o si el backend los devuelve, los seteamos
      setComments([]);
      setLoading(false);
    };
    fetchPin();
  }, [id]);

  const handleLike = async () => {
    if (!pin) return;

    try {
      await addLike(pin.id);
      setPin({ ...pin, likes: pin.likes + 1 });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 403) {
        toast.error("You have reached your daily like limit.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

 const handleAddComment = async () => {
  if (!pin || !newComment.trim()) return;

  try {
    const res = await addComment(pin.id, newComment);
    if (!res) return
    setComments([...comments, res.data]); 
    setNewComment("");
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 403) {
      toast.error("You have reached your daily comment limit.");
    } else {
      toast.error("Failed to add comment. Try again.");
    }
  }
};

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
          <button onClick={onClose} className="mt-4 bg-gray-700 text-white px-4 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-[#0E172B]/90 to-[#1B273B] rounded-lg 
                      flex flex-col md:flex-row w-full max-w-[900px] max-h-[90%] 
                      shadow-xl shadow-slate-800/50 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 z-10 text-white hover:text-gray-300"
        >
          <IoClose size={28} />
        </button>

        {/* Imagen */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto flex-shrink-0">
          <Image
            src={pin.image}
            alt="Pin photo"
            fill
            className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          />
        </div>

        {/* Contenido */}
        <div className="w-full md:w-1/2 p-4 flex flex-col text-white overflow-y-auto">
          <h3 className="font-[montserrat] text-lg mb-2">{pin.name}</h3>
          <p className="mb-4">{pin.description}</p>

          {/* Caja de comentarios */}
          <div className="flex-1 flex flex-col">
            <div className="w-full h-40 md:h-56 border border-gray-500 rounded-t-lg overflow-y-auto p-2">
              {comments.length === 0 ? (
                <p className="text-gray-400 text-sm">No comments yet</p>
              ) : (
                comments.map((c) => (
                  <p key={comments.id} className="text-white text-sm mb-1">{c.text}</p>
                ))
              )}
            </div>
            <div className="w-full h-10 border border-gray-500 rounded-b-lg flex">
              <input
                className="bg-transparent text-white w-full px-2 outline-none"
                type="text"
                placeholder="Add comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="px-2 bg-blue-600 text-white rounded-br"
              >
                <FaRegPaperPlane size={25}/>
              </button>
            </div>
          </div>

          {/* Likes y Views */}
          <div className="flex items-center mt-4 space-x-4">
            <button className="flex items-center hover:text-pink-500" onClick={handleLike}>
              <FcLike size={24} color="gray"/>
              <span className="ml-1">{pin.likes}</span>
            </button>
            <div className="flex items-center">
              <AiOutlineEye size={22} />
              <span className="ml-1">{pin.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
