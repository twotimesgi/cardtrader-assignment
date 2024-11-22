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
import { postCategory } from "../_helpers/postCategory";
import { updateCategory } from "../_helpers/updateCategory";
import { deleteCategory } from "../_helpers/deleteCategory";
import { Attribute, Category } from "@prisma/client";
import { AttributeFields } from "./attribute-fields";
import { CategoryAndAttributes } from "../../../../../types/filters";
import { useConfirm } from "@/app/hooks/useConfirm";

// Validation schema
const schema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  attributes: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, { message: "Attribute name is required" }),
      required: z.boolean(),
      type: z.enum(["NUMBER", "STRING", "BOOLEAN"], {
        errorMap: () => ({ message: "Invalid attribute type" }),
      }),
      isNew: z.boolean().optional(), // Added to track new attributes
    })
  ),
});

export type FormValues = z.infer<typeof schema>;

export const CategoryForm = ({ existingCategory }: { existingCategory?: CategoryAndAttributes }) => {
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Category",
    "Are you sure you want to delete this category? This action cannot be undone."
  );

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: existingCategory
      ? {
          name: existingCategory.name,
          attributes: existingCategory.attributes.map((attr: Attribute) => ({
            id: attr.id,
            name: attr.name,
            required: attr.required,
            type: attr.type as "NUMBER" | "STRING" | "BOOLEAN",
            isNew: false, // Existing attributes
          })),
        }
      : {
          name: "",
          attributes: [{ name: "", required: false, type: "STRING", isNew: true }], // New attributes
        },
  });

  const { control, register, handleSubmit, formState } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  // Mutation for creating a category
  const createMutation = useMutation({
    mutationFn: postCategory,
    onSuccess: (category: Category) => {
      toast.success("Category created successfully.");
      router.push(`/categories/${category.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "An error occurred. Please try again.");
    },
  });

  // Mutation for updating a category
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: (category: Category) => {
      toast.success("Category updated successfully.");
      router.push(`/categories/${category.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "An error occurred. Please try again.");
    },
  });

  // Mutation for deleting a category
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully.");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "An error occurred while deleting.");
    },
  });

  // Submit handler for create or update
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (existingCategory) {
      updateMutation.mutate({ id: existingCategory.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Handler for deleting a category
  const onRemove = async () => {
    const ok = await confirmDelete();
    if (ok && existingCategory) {
      deleteMutation.mutate(existingCategory.id);
    }
  };

  return (
    <>
      <DeleteDialog />
      <div>
        <h1 className="text-2xl mb-4">
          {existingCategory ? "Edit Category" : "Create Category"}
        </h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput
              label="Category Name"
              placeholder="e.g., 'T-shirts'"
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
                      append({ name: "", required: false, type: "STRING", isNew: true }); // New attributes
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

            <div className="flex items-center justify-end gap-3">
              {existingCategory && (
                <Button
                  onClick={onRemove}
                  type="button"
                  variant="destructive"
                  disabled={deleteMutation.status === "pending"}
                >
                  {deleteMutation.status === "pending"
                    ? "Deleting..."
                    : "Delete Category"}
                </Button>
              )}
              <Button
                type="submit"
                disabled={
                  createMutation.status === "pending" ||
                  updateMutation.status === "pending" ||
                  !formState.isValid
                }
              >
                {createMutation.status === "pending" || updateMutation.status === "pending"
                  ? existingCategory
                    ? "Updating..."
                    : "Creating..."
                  : existingCategory
                  ? "Update Category"
                  : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
