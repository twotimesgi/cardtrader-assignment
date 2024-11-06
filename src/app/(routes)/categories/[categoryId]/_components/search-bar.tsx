"use client";

import { Button } from "@/components/ui/button";
import { IoFilterSharp } from "react-icons/io5";
import { useShowFilters } from "../_store/useShowFilters";
import { MobileFilters } from "@/app/(routes)/categories/[categoryId]/_components/mobile-filters";
import { Filter } from "../../../../../../types/filters";
import { SearchInput } from "./search-input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

interface SearchBarProps {
  filters: Filter[];
}

export const SearchBar = ({ filters }: SearchBarProps) => {
  const [showFilters, setShowFilters] = useShowFilters();

  return (
    <div className="flex md:justify-between md:items-center mb-6 w-full flex-col md:flex-row justify-start gap-y-2">
      <SearchInput />
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="ghost"
          className="text-sm rounded-none hidden md:inline-flex"
        >
          <IoFilterSharp />
          {showFilters ? "Hide filters" : "Show filters"}
        </Button>

        <MobileFilters filters={filters} className="md:hidden inline-flex" />
        {/* <Select>
          <SelectTrigger className="w-[180px] rounded-none shadow-none">
            <SelectValue placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Price: Low to high</SelectItem>
            <SelectItem value="dark">Price: High to low</SelectItem>
            <SelectItem value="system">Newest arrivals</SelectItem>
          </SelectContent>
        </Select> */}
    </div>
  );
};
