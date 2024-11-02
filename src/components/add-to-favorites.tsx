import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useState } from "react";
import { PiHeartStraight, PiHeartStraightFill } from "react-icons/pi";
import { toast } from "sonner";

interface AddToFavoritesProps {
  id: string;
}

export const AddToFavorites = ({ id }: AddToFavoritesProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const addFav = (e :React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    //TODO: implement backend request to add to favorites
    setIsFavorite((prev) => !prev);
    toast.success(`Product has been ${isFavorite?"removed from":"added to"} favorites`)
}

  return (
    <div className="absolute top-2 right-2 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={(e) => addFav(e)} className="bg-white p-2">
            {isFavorite ? <PiHeartStraightFill size={20}/> : <PiHeartStraight size={20}/>}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to favorites</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
