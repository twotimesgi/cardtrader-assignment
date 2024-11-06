import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormRegisterReturn } from "react-hook-form";

type TextInputProps = {
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  registration: UseFormRegisterReturn; 
  type?: "text" | "number";
};

const TextInput = ({ label, placeholder, required = false, disabled, registration, type="text" }: TextInputProps) => (
  <FormItem>
    <FormLabel className="w-full flex justify-between">
      <span>{label}</span>
      {required && <span className="text-xs text-red-600">Required</span>}
    </FormLabel>
    <FormControl>
      <Input className="shadow-none rounded-none" placeholder={placeholder} disabled={disabled} {...registration} />
    </FormControl>
    <FormMessage />
  </FormItem>
);

export default TextInput;
