"use client";

import { Button } from "@/components/ui/button";
import { IoFilterSharp } from "react-icons/io5";
import { useShowFilters } from "../_store/useShowFilters";
import { MobileFilters } from "@/app/(routes)/_components/mobile-filters";
import { Filter } from "../../../../types/filters";
import { SearchInput } from "./search-input";

interface SearchBarProps {
    filters: Filter[];
}

export const SearchBar = ({ filters }: SearchBarProps) => {
    const [showFilters, setShowFilters] = useShowFilters();

    return (
        <div className="flex md:justify-between md:items-center mb-6 w-full flex-col md:flex-row justify-start gap-y-2">
          <SearchInput/>
            <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="ghost"
                className="text-sm rounded-none hidden md:inline-flex"
            >
                <IoFilterSharp />
                {showFilters ? "Hide filters" : "Show filters"}
            </Button>
            <MobileFilters filters={filters} className="md:hidden inline-flex" />
        </div>
    );
};
