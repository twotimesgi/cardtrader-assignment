"use client"
import { Button } from "@/components/ui/button"
import { IoFilterSharp } from "react-icons/io5"
import { useShowFilters } from "../store/useShowFilters"

interface SearchBarProps{
    // numberOfResults: number,
    categoryName: string
}
export const SearchBar = ({categoryName} : SearchBarProps) => {
    const [showFilters, setShowFilters] = useShowFilters();
    const toggleFilters = () => {
        setShowFilters((prev) => !prev)
    }
    return <div className="flex justify-between mb-6 items-center w-full">
            <span className="text-xl">{categoryName} 
                {/* ({numberOfResults}) */}
                </span>
            <Button
            onClick={toggleFilters}
            variant={"ghost"}
              className="text-sm rounded-none"
            >
              <IoFilterSharp />
              {showFilters ? "Hide filters" : "Show filters"}
            </Button>
          </div>
}