"use client";

import { Button } from "@/components/ui/button";
import { IoFilterSharp } from "react-icons/io5";
import { useShowFilters } from "../app/store/useShowFilters";
import { MobileFilters } from "@/components/mobile-filters";
import { Filter } from "../../types/filters";
import { SearchInput } from "./search-input";
import { OrderBy } from "./order-by";
interface SearchBarProps {
  filters?: Filter[];
}

export const SearchBar = ({ filters }: SearchBarProps) => {
  const [showFilters, setShowFilters] = useShowFilters();

  return (
    <div className="flex md:justify-between md:items-center mb-6 w-full flex-col md:flex-row justify-start gap-y-2">
      <SearchInput />
      <div className="flex items-center gap-2">
        {filters && <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="ghost"
          className="text-sm rounded-none hidden lg:inline-flex w-1/2 md:w-auto"
        >
          <IoFilterSharp />
          {showFilters ? "Hide filters" : "Show filters"}
        </Button>}

        {filters && <MobileFilters filters={filters} className="lg:hidden inline-flex w-1/2 md:w-auto" />}
        <OrderBy />
        </div>
    </div>
  );
};
