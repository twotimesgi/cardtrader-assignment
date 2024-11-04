"use client"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoFilterSharp } from "react-icons/io5";
import { Button } from "../../../components/ui/button";
import { Filters } from "./filters";
import { Filter } from "../../../../types/filters";
import { useShowFilters } from "@/app/(routes)/store/useShowFilters";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden"
import { cn } from "@/lib/utils";
interface MobileFilterProps{
  filters: Filter[], 
  className?: string
}
export const MobileFilters = ({ filters, className }: MobileFilterProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
      <Button
            variant={"ghost"}
            className={cn(className, "text-sm rounded-none")}
            >
              <IoFilterSharp />
              Show filters
            </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
            <SheetTitle>
            Filters
          </SheetTitle>
          <Filters filters={filters} />
      </SheetContent>
    </Sheet>
  );
};
