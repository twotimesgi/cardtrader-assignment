import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Controller, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Attribute, AttributeType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
              <span>{attribute.name} ({attribute.type.toLowerCase()})</span>
              {attribute.required && <span className="text-xs text-red-600">Required</span>}
            </FormLabel>
            <FormControl className="w-full">
              <Controller
                control={form.control}
                name={`attributes.${index}.value`}
                render={({ field }) => {
                  if(attribute.type != AttributeType.BOOLEAN){
                    return <Input className="shadow-none rounded-none" type={attribute.type === "NUMBER" ? "number" : "text"}placeholder={attribute.name} {...field} disabled={isMutationLoading} />
                  }else{
                    return <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="min-w-full rounded-none shadow-none md:w-auto">
                    <SelectValue placeholder="Boolean"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>

                  }
                }}
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
