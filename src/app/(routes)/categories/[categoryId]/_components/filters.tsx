"use client";
import { useState, useEffect } from "react";
import { useShowFilters } from "@/app/(routes)/categories/[categoryId]/_store/useShowFilters";
import {
  Accordion,
} from "../../../../../components/ui/accordion";
import { AnimatePresence, motion } from "framer-motion";
import { capitalize } from "@/lib/format";
import { Filter as FilterType } from "../../../../../../types/filters";
import { cn } from "@/lib/utils";
import { Filter } from "./filter";
import { Category } from "@prisma/client";

// Define animation variants
const filterVariants = {
  hidden: { opacity: 0, flexBasis: 0, minWidth: 0, marginRight: 0 },
  visible: { opacity: 1, flexBasis: "250px", minWidth: "250px", marginRight: "16px" },
};

interface FiltersProps {
  filters: FilterType[];
  className?: string
}

export const Filters = ({ filters, className}: FiltersProps) => {
  const [showFilters] = useShowFilters(); 
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
      setOpenItems([]); // Collapse all items
  }, [showFilters]);

  useEffect(() => {
    console.log(openItems);
  })


  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          key="filters-panel"
          className={cn("flex-shrink-0 overflow-hidden w-full", className)}
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{
            duration: 0.3,
            layout: { duration: 0.4, ease: "easeInOut" },
          }}
        >
          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
          >
            {filters.map((filter: FilterType, index: number) => (
            <Filter filter={filter} index={index} key={filter.attributeName}/>
            ))}
          </Accordion>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
