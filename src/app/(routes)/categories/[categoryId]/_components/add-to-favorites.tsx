import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../../components/ui/tooltip";
import { useState, MouseEvent } from "react";
import { PiHeartStraight, PiHeartStraightFill } from "react-icons/pi";
import { toast } from "sonner";

interface AddToFavoritesProps {
  id: string;
}

export const AddToFavorites = ({ id }: AddToFavoritesProps): JSX.Element => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const toggleFavorite = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setIsFavorite((prevIsFavorite: boolean) => !prevIsFavorite);
    toast.success(`Product has been ${isFavorite ? "removed from" : "added to"} favorites`);
  };

  return (
    <div className="absolute top-2 right-2 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={toggleFavorite} className="bg-white p-2" aria-label="Toggle favorite">
            {isFavorite ? <PiHeartStraightFill size={20} /> : <PiHeartStraight size={20} />}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
