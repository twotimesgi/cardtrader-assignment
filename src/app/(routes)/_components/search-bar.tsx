"use client"
import { Button } from "@/components/ui/button"
import { IoFilterSharp } from "react-icons/io5"
import { useShowFilters } from "../store/useShowFilters"
import { MobileFilters } from "@/app/(routes)/_components/mobile-filters"
import { Filter } from "../../../../types/filters";

interface SearchBarProps{
    // numberOfResults: number,
    categoryName: string,
    filters: Filter[]
}
export const SearchBar = ({categoryName, filters} : SearchBarProps) => {
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
              className="text-sm rounded-none hidden md:inline-flex"
            >
              <IoFilterSharp />
              {showFilters ? "Hide filters" : "Show filters"}
            </Button>
            <MobileFilters filters={filters} className="md:hidden inline-flex"/>
          </div>
}