"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "../app/hooks/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Get current query parameters and convert them into an object
        const currentParams = Object.fromEntries(searchParams.entries());

        // Merge existing parameters with the new `search` value
        const query = {
            ...currentParams,
            search: debouncedValue || undefined, // Remove `search` from query if empty
        };

        const url = qs.stringifyUrl(
            {
                url: pathname,
                query,
            },
            { skipEmptyString: true, skipNull: true }
        );

        router.push(url);
    }, [debouncedValue]);

    return (
        <div className="relative flex-grow-1">
            <SearchIcon className="h-4 w-4 absolute top-2.5 left-2 text-muted-foreground/40" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full md:w-[300px] pl-8 focus-visible:ring-white rounded-none shadow-none  "
                placeholder="Search products..." 
            />
        </div>
    );
};
