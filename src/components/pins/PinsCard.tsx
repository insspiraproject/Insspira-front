import { IPins } from "@/interfaces/IPins";
import { FaCommentDots } from "react-icons/fa";
import SafeImage from "../others/SafeImage";
import { addLike, fetchLikeStatus } from "@/services/pins.services";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { FiHeart } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";
import { useEffect } from "react";




interface PinsCardProps {
  pin: IPins;
  likesState: {
    liked: boolean;
    likesCount: number;
  };
  setLikesState: (newState: { likesCount: number, liked: boolean }) => void;
  onOpenModal: () => void;
}

const PinsCard: React.FC<PinsCardProps> = ({ pin, likesState, setLikesState, onOpenModal }) => {
  

  const comments = typeof pin.commentsCount === "number" ? pin.commentsCount : 0;


 useEffect(() => {
  
    const loadLikeStatus = async () => {
      if (!pin) {
        return null;
      }
    try {
      const data = await fetchLikeStatus(pin.id);
      console.log(data)
      setLikesState({
        liked: data.liked, // no likesCount
        likesCount: data.likesCount || 0
      });
    } catch (error) {
      console.error("Error al obtener el estado del like:", error);
    }
  };

  loadLikeStatus();
  }, [pin.id]);


  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    try {
     addLike(pin.id);
  
      setLikesState({
        liked: !likesState.liked,
        likesCount: likesState.liked
          ? Math.max(likesState.likesCount - 1, 0)
          : likesState.likesCount + 1,
      });
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
              {likesState.likesCount ? (
                <GoHeartFill size={20} color="red" />
              ) : (
                <FiHeart size={20} />
              )}
            </button>
            <span className="ml-1">{likesState.likesCount ?? 0}</span>
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


