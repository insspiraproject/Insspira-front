import { IPins } from "@/interfaces/IPins";
import { FaCommentDots } from "react-icons/fa";
import SafeImage from "../others/SafeImage";
import { addLike} from "@/services/pins.services";

import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { FiHeart } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";

interface PinsCardProps {
  pin: IPins;
  likesState: {
    likeView: boolean;
    likesCount: number;
  };
  setLikesState: (newState: { likeView: boolean; likesCount: number }) => void;
  onOpenModal: () => void;
}

const PinsCard: React.FC<PinsCardProps> = ({ pin, likesState, setLikesState, onOpenModal }) => {
  if (!pin) return null;

  const comments = typeof pin.commentsCount === "number" ? pin.commentsCount : 0;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // evita abrir el modal
  
    try {
      if (likesState.likeView) {
        // Ya tiene like → quitar
        await addLike(pin.id);
        setLikesState({
          likeView: false,
          likesCount: likesState.likesCount - 1,
        });
      } else {
        // No tiene like → agregar
        await addLike(pin.id);
        setLikesState({
          likeView: true,
          likesCount: likesState.likesCount + 1,
        });
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 403) {
        toast.error("You have reached your daily like limit.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className="w-full sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px] h-auto mt-6 flex flex-col"
      onClick={onOpenModal}
    >
      <SafeImage
        width={500}
        height={500}
        src={pin.image}
        alt={pin.description ?? ""}
        className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover opacity-80 rounded-t-xl hover:opacity-100 hover:shadow-xl hover:shadow-gray-500"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
      />

      <div className="flex flex-col text-xs md:text-sm bg-[var(--color-rosa)] p-2 rounded-b-xl mb-6">
        <div className="flex items-center mb-2">
          <p className="mr-2">{pin.user}</p>

          {/* Likes */}
          <div className="flex items-center mr-4">
            <button onClick={handleLike}>
              {likesState.likeView ? (
                <GoHeartFill size={20} color="red" />
              ) : (
                <FiHeart size={20} />
              )}
            </button>
            <span className="ml-1">{likesState.likesCount}</span>
          </div>

          {/* Comments */}
          <div className="flex items-center">
            <FaCommentDots size={18} className="md:size-[20px]" />
            <span className="ml-1">{comments}</span>
          </div>
        </div>

        <span className="font-semibold">{pin.description ?? ""}</span>
      </div>
    </div>
  );
};

export default PinsCard;
