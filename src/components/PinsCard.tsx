import { IPins } from "@/interface/IPins";
import { FcLike } from "react-icons/fc";
import { FaCommentDots } from "react-icons/fa";

interface PinsCardProps {
  pin: IPins;
}

const PinsCard: React.FC<PinsCardProps> = ({ pin }) => {
  return (
    <div
      className="w-full sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px] 
                 h-auto mt-6 flex flex-col"
    >
      <img
        src={pin.image}
        alt={pin.description || "Pin image"}
        className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] 
                   object-cover opacity-80 rounded-t-xl 
                   hover:opacity-100 hover:shadow-xl hover:shadow-gray-500"
      />

      <div className="flex flex-col text-xs md:text-sm bg-[var(--color-rosa)] p-2 rounded-b-xl mb-6">
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-4">
            <FcLike size={18} className="md:size-[20px]" />
            <span className="ml-1">{pin.likesCount}</span>
          </div>
          <div className="flex items-center">
            <FaCommentDots size={18} className="md:size-[20px]" />
            <span className="ml-1">{pin.commentsCount}</span>
          </div>
        </div>
        <p className="font-bold">{pin.user}</p>
        <span className="font-semibold">{pin.description}</span>
      </div>
    </div>
  );
};

export default PinsCard;
