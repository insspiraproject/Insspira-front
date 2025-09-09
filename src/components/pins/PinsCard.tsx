import { IPins } from "@/interfaces/IPins";
import { FcLike } from "react-icons/fc";
import { FaCommentDots } from "react-icons/fa";
import SafeImage from "@/components/others/SafeImage";

interface PinsCardProps {
  pin: IPins | null | undefined;
}

const isNonEmpty = (v?: string | null): v is string =>
  typeof v === "string" && v.trim().length > 0;

const PinsCard: React.FC<PinsCardProps> = ({ pin }) => {
  if (!pin) return null;

  const likes = typeof pin.likesCount === "number" ? pin.likesCount : 0;
  const comments = typeof pin.commentsCount === "number" ? pin.commentsCount : 0;
  const user = isNonEmpty(pin.user) ? pin.user : "";

  return (
    <div
      className="w-full sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px] 
                 h-auto mt-6 flex flex-col"
    >
      <SafeImage
        width={500}
        height={500}
        src={pin.image}
        alt={isNonEmpty(pin.description) ? pin.description : null}
        className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] 
                   object-cover opacity-80 rounded-t-xl 
                   hover:opacity-100 hover:shadow-xl hover:shadow-gray-500"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
      />

      <div className="flex flex-col text-xs md:text-sm bg-[var(--color-rosa)] p-2 rounded-b-xl mb-6">
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-4">
            <FcLike size={18} className="md:size-[20px]" />
            <span className="ml-1">{likes}</span>
          </div>
          <div className="flex items-center">
            <FaCommentDots size={18} className="md:size-[20px]" />
            <span className="ml-1">{comments}</span>
          </div>
        </div>
        <p className="font-bold">{user}</p>
        <span className="font-semibold">
          {isNonEmpty(pin.description) ? pin.description : ""}
        </span>
      </div>
    </div>
  );
};

export default PinsCard;
