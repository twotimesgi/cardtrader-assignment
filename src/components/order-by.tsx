"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";

export const OrderBy = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orderBy, setOrderBy] = useState<string | undefined>(undefined); // Default to undefined for placeholder

  const handleChange = (value: string) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    // Set the new `order_by` parameter based on selected value
    const updatedParams = {
      ...currentParams,
      order_by: value,
    };

    setOrderBy(value);

    // Build the new URL with updated parameters
    const url = qs.stringifyUrl(
      { url: pathname, query: updatedParams },
      { skipNull: true, skipEmptyString: true }
    );

    // Push the new URL to the router
    router.push(url);
  };

  useEffect(() => {
    if (searchParams) {
      const params = Object.fromEntries(searchParams.entries());
      if (params["order_by"]) {
        setOrderBy(params["order_by"]);
      } else {
        setOrderBy("newest"); // Fallback to default value if not present
      }
    }
  }, [searchParams]);

  return (
    <Select onValueChange={handleChange} value={orderBy}>
      <SelectTrigger className="rounded-none shadow-none w-1/2 md:w-auto min-w-[160px]">
        <SelectValue placeholder="Order by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest arrivals</SelectItem>
        <SelectItem value="low_to_high">Price: Low to high</SelectItem>
        <SelectItem value="high_to_low">Price: High to low</SelectItem>
      </SelectContent>
    </Select>
  );
};
