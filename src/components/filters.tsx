"use client";
import { useState, useEffect } from "react";
import { useShowFilters } from "@/app/(routes)/store/useShowFilters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "./ui/button";
import { capitalize } from "@/lib/format";
import { Filter } from "../../types/filters";

// Define animation variants
const filterVariants = {
  hidden: { opacity: 0, flexBasis: 0, minWidth: 0, marginRight: 0 },
  visible: { opacity: 1, flexBasis: "200px", minWidth: "200px", marginRight: "16px" },
};

interface FiltersProps {
  filters: Filter[];
}

export const Filters = ({ filters }: FiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters] = useShowFilters(); 
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
      setOpenItems([]); // Collapse all items
  }, [showFilters]);

  useEffect(() => {
    console.log(openItems);
  })

  const onClick = (filter: Filter, value: string) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const attributeKey = `attribute_${filter.attributeName}`;
    const selectedValues = currentParams[attributeKey]?.split(",") || [];

    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    const updatedParams = {
      ...currentParams,
      [attributeKey]: updatedValues.length ? updatedValues.join(",") : undefined,
      skip: 0,
    };

    const url = qs.stringifyUrl(
      { url: pathname, query: updatedParams },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          key="filters-panel"
          className="flex-shrink-0 hidden sm:block overflow-hidden"
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
            {filters.map((filter, index) => (
              <AccordionItem value={`${index}`} key={filter.attributeName}>
                <AccordionTrigger>{capitalize(filter.attributeName)}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 mt-2 min-w-[200px] overflow-hidden">
                    {filter.possibleValues.map((value) => {
                      const attributeKey = `attribute_${filter.attributeName}`;
                      const selectedValues = searchParams.get(attributeKey)?.split(",") || [];
                      const isActive = selectedValues.includes(value);
                      return (
                        <Button
                          key={value}
                          variant={isActive ? "default" : "outline"}
                          onClick={() => onClick(filter, value)}
                        >
                          {value}
                        </Button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
