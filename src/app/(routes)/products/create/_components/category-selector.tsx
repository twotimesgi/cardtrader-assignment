import { Combobox } from "@/components/ui/combo-box";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Category } from "@prisma/client";

type CategorySelectorProps = {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
};

const CategorySelector = ({ categories, value, onChange }: CategorySelectorProps) => (
  <FormItem>
    <FormLabel className="w-full flex justify-between">
      <span>Category</span>
      <span className="text-xs text-red-600">Required</span>
    </FormLabel>
    <FormControl>
      <Combobox
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
        onChange={onChange}
        value={value}
      />
    </FormControl>
    <FormMessage />
  </FormItem>
);

export default CategorySelector;
