import { Filter as FilterType } from "../../types/filters";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/format";
import { AttributeType } from "@prisma/client";
import { DualRangeSlider } from "./ui/dual-range-slider";
import { useState, useEffect } from "react";
import { Switch } from "./ui/switch";
import { X } from "lucide-react";

interface FilterProps {
    filter: FilterType;
    index: number;
}

const useQueryParams = (pathname: string, searchParams: URLSearchParams) => {
    const router = useRouter();

    const updateParams = (key: string, value: string | undefined) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        const updatedParams = { ...currentParams, [key]: value };
        const url = qs.stringifyUrl(
            { url: pathname, query: updatedParams },
            { skipNull: true, skipEmptyString: true }
        );
        router.push(url);
    };

    return { updateParams };
};

const getRangeDefaultValue = (filter: FilterType): number[] => {
    return [
        Math.min(...filter.possibleValues.map((v) => parseFloat(v))),
        Math.max(...filter.possibleValues.map((v) => parseFloat(v))),
    ];
};

const getCurrentRangeValue = (searchParams: URLSearchParams, key: string): number[] | null => {
    const paramValue = searchParams.get(key);
    if (paramValue) {
        return paramValue.split(",").map(Number);
    }
    return null;
};

export const Filter = ({ filter, index }: FilterProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { updateParams } = useQueryParams(pathname, searchParams);
    const attributeKey = `attribute_${filter.attributeName}`;

    const [rangeValue, setRangeValue] = useState<number[]>(() =>
        filter.attributeType === AttributeType.NUMBER
            ? getCurrentRangeValue(searchParams, attributeKey) || getRangeDefaultValue(filter)
            : []
    );

    useEffect(() => {
        if (filter.attributeType === AttributeType.NUMBER) {
            const newValue = getCurrentRangeValue(searchParams, attributeKey);
            if (newValue) setRangeValue(newValue);
        }
    }, [searchParams, filter]);

    const handleBooleanChange = (checked: boolean) => {
        updateParams(attributeKey, checked.toString()); // Explicitly set "true" or "false"
    };
    

    const handleRangeChange = (value: number[]) => {
        setRangeValue(value);
        updateParams(attributeKey, value.join(","));
    };

    const handleStringChange = (value: string) => {
        const currentValues = searchParams.get(attributeKey)?.split(",") || [];
        const updatedValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];
        updateParams(attributeKey, updatedValues.length ? updatedValues.join(",") : undefined);
    };

    if(filter.attributeType === AttributeType.NUMBER && filter.possibleValues.length < 3){
        return <></>
    }

    if (filter.attributeType === AttributeType.BOOLEAN) {
        const isChecked = searchParams.get(attributeKey) === "true";

        return (
            <div className="flex justify-between items-center border-b">
                <span className="py-4 text-sm font-medium whitespace-nowrap">{filter.attributeName}</span>
                <div className="flex gap-2 items-center">
                    {searchParams.get(attributeKey) && (
                        <button onClick={() => updateParams(attributeKey, undefined)}>
                            <X size={20} className="text-black/20 hover:text-black/90" />
                        </button>
                    )}
                    <Switch checked={isChecked} onCheckedChange={handleBooleanChange} />
                </div>
            </div>
        );
    }

    return (
        <AccordionItem value={`${index}`}>
            <AccordionTrigger className="whitespace-nowrap">
                {capitalize(filter.attributeName)}
            </AccordionTrigger>
            <AccordionContent>
                <div className="flex flex-wrap gap-2 mt-2 min-w-[250px] overflow-hidden">
                    {filter.attributeType === AttributeType.STRING &&
                        filter.possibleValues.map((value) => {
                            const selectedValues = searchParams.get(attributeKey)?.split(",") || [];
                            const isActive = selectedValues.includes(value);

                            return (
                                <Button
                                    key={value}
                                    variant={isActive ? "default" : "outline"}
                                    onClick={() => handleStringChange(value)}
                                >
                                    {value}
                                </Button>
                            );
                        })}
                    {filter.attributeType === AttributeType.NUMBER && filter.possibleValues.length > 1 && (
                        <div className="w-full pt-8 pb-2 px-2">
                            <DualRangeSlider
                                label={(value) => value}
                                labelPosition="top"
                                value={rangeValue}
                                onValueChange={handleRangeChange}
                                min={Math.min(...filter.possibleValues.map((v) => parseFloat(v)))}
                                max={Math.max(...filter.possibleValues.map((v) => parseFloat(v)))}
                                step={1}
                            />
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
