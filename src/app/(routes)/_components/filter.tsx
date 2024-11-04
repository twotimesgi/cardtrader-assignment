import { Filter as FilterType } from "../../../../types/filters";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../../../components/ui/accordion";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/format";


export const Filter = ({filter, index}: {filter: FilterType, index: number}) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    
  const onClick = (filter: FilterType, value: string) => {
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
    <AccordionItem value={`${index}`}>
            <AccordionTrigger>{capitalize(filter.attributeName)}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 mt-2 min-w-[250px] overflow-hidden">
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
)
}