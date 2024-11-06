import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Controller, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Attribute } from "@prisma/client";

type AttributeInputProps = {
  form: any;
  attributes: Attribute[];
  isMutationLoading: boolean;
  fields: ReturnType<typeof useFieldArray>["fields"];
};

const AttributeInput = ({ form, attributes, isMutationLoading, fields }: AttributeInputProps) => (
  <motion.div className="space-y-3">
    {fields.map((field, index) => {
      const attribute = attributes[index];
      if (!attribute) return null;

      return (
        <motion.div key={field.id}>
          <FormItem>
            <FormLabel className="w-full flex justify-between">
              <span>{attribute.name}</span>
              {attribute.required && <span className="text-xs text-red-600">Required</span>}
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name={`attributes.${index}.value`}
                render={({ field }) => (
                  <Input className="shadow-none rounded-none" placeholder={attribute.name} {...field} disabled={isMutationLoading} />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </motion.div>
      );
    })}
  </motion.div>
);

export default AttributeInput;
