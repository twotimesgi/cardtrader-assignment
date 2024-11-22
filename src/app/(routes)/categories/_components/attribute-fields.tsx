import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextInput from "@/components/text-input";
import { FormValues } from "./category-creation-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AttributeFieldsProps {
  fields: { id: string; isNew?: boolean }[];
  control: Control<FormValues>;
  remove: UseFieldArrayRemove;
}

export const AttributeFields = ({ fields, control, remove }: AttributeFieldsProps) => {
  const attributeVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <AnimatePresence>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            variants={attributeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 w-full"
          >
            <div className="flex flex-col w-full gap-y-1">
              <TextInput
                label={`Attribute ${!field.isNew ? "(Not editable)" : ""}`}
                placeholder="Attribute name"
                registration={control.register(`attributes.${index}.name` as const)}
                disabled={!field.isNew} // Disable if not new
              />
              <div className="flex items-center gap-1 w-full">
                <input
                  type="checkbox"
                  {...control.register(`attributes.${index}.required` as const)}
                  className="h-4 w-4"
                  disabled={!field.isNew} // Disable if not new
                />
                <label className="text-xs">Required</label>
              </div>
            </div>

            <Controller
              name={`attributes.${index}.type` as const}
              control={control}
              defaultValue="STRING"
              render={({ field: selectField }) => (
                <Select
                  value={selectField.value}
                  onValueChange={selectField.onChange}
                  disabled={!field.isNew} // Disable if not new
                >
                  <SelectTrigger className="min-w-40 rounded-none shadow-none md:w-auto">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STRING">String</SelectItem>
                    <SelectItem value="NUMBER">Number</SelectItem>
                    <SelectItem value="BOOLEAN">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

              <Button
                type="button"
                variant="destructive"
                className="px-3 rounded-none"
                size="icon"
                onClick={() => remove(index)}
                aria-label="Remove attribute"
              >
                <Trash size={16} />
              </Button>
            
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
