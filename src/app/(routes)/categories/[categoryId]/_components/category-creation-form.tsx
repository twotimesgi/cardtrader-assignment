"use client";

import * as z from "zod";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextInput from "@/components/text-input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { postCategory } from "../../create/_api/postCategory";
import { Category } from "@prisma/client";
import { AttributeFields } from "./attribute-fields";

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

export type FormValues = z.infer<typeof schema>;

export const CategoryForm = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      attributes: [{ name: "", required: false }],
    },
  });

  const { control, register, handleSubmit, formState } = form;
  const { fields, append, remove } = useFieldArray({
    control,
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

  return (
    <div>
      <h1 className="text-2xl mb-4">Create Category</h1>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="Category Name"
            placeholder="e.g. 'T-shirts'"
            required
            registration={register("name")}
          />

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
            <AttributeFields fields={fields} control={control} remove={remove} />
          </div>

          <div className="flex items-center justify-end">
            <Button type="submit" disabled={mutation.status === "pending" || !formState.isValid}>
              {mutation.status === "pending" ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
