"use client";

import * as z from "zod";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextInput from "@/components/text-input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { postCategory } from "../_api/postCategory";
import { Category } from "@prisma/client";

// Define schema for validation
const schema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  attributes: z.array(
    z.object({
      name: z.string().min(1, { message: "Attribute name is required" }),
      required: z.boolean(),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

export const CategoryForm = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      attributes: [{ name: "", required: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  // Mutation setup using react-query
  const mutation = useMutation({
    mutationFn: postCategory,
    onSuccess: (res: Category) => {
      toast.success("Category created successfully.");
      router.push(`/categories/${res.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "An error occurred. Please try again.");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate(values);
  };

  const attributeVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Create Category</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="Category Name"
            placeholder="e.g. 'T-shirts'"
            required
            registration={form.register("name")}
          />

          {/* Dynamic Attributes */}
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-lg">Attributes</h2>
              <Button
                type="button"
                onClick={() => {
                  if (fields.length < 6) {
                    append({ name: "", required: false });
                  } else {
                    toast.error("Maximum of 6 attributes allowed.");
                  }
                }}
                variant="outline"
              >
                <PlusCircle />
                Add Attribute
              </Button>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
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
                        label={`Attribute`}
                        placeholder={`Attribute name`}
                        registration={form.register(
                          `attributes.${index}.name` as const
                        )}
                      />
                      <div className="flex items-center gap-1 w-full">
                        <input
                          type="checkbox"
                          {...form.register(
                            `attributes.${index}.required` as const
                          )}
                          className="h-4 w-4"
                        />
                        <label className="text-xs">Required</label>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      className="px-3 rounded-none"
                      size="icon"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                      aria-label="Remove attribute"
                    >
                      <Trash size={16} />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button type="submit" disabled={mutation.status === "pending"  || !form.formState.isValid}>
              {mutation.status === "pending" ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
