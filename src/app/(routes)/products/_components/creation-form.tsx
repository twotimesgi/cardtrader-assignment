"use client";

import * as z from "zod";
import { useForm, useFieldArray, SubmitHandler, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Category, Product, Attribute } from "@prisma/client";
import { getAttributes } from "../_api/getAttributes";
import { postProduct } from "../_api/postProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import CategorySelector from "./category-selector";
import TextInput from "./text-input";
import FileUploader from "./file-uploader";
import AttributeInput from "./attribute-input";
import Image from "next/image";
import { ImagePreviews } from "./image-previews";

const baseSchema = z.object({
  model: z.string().min(1, { message: "Model is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  price: z.number().min(0.01, { message: "Price must be a positive number" }),
  categoryId: z.string().min(1, "Select a category."),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type FormValues = z.infer<typeof baseSchema> & {
  attributes: { attributeId: string; value: string }[];
};

export const CreationForm = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const { data: attributes = [], isLoading } = useQuery({
    queryKey: ["attributes", selectedCategoryId],
    queryFn: () => getAttributes({ categoryId: selectedCategoryId as string }),
    enabled: !!selectedCategoryId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(
      baseSchema.extend({
        attributes: z
          .array(
            z.object({
              attributeId: z.string(),
              value: z.string().optional(),
            })
          )
          .superRefine((attributeValues, ctx) => {
            attributeValues.forEach((attr, index) => {
              const attribute = attributes.find(
                (a: Attribute) => a.id === attr.attributeId
              );
              if (attribute?.required && !attr.value) {
                ctx.addIssue({
                  code: "custom",
                  path: ["attributes", index, "value"],
                  message: `${attribute.name} is required`,
                });
              }
            });
          }),
      })
    ),
    defaultValues: {
      model: "",
      brand: "",
      price: 0,
      categoryId: "",
      attributes: [],
      images: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  // Watch fields to trigger re-render on change
  const watchedFields = form.watch(); // Watch all fields

  useEffect(() => {
    if (selectedCategoryId && attributes.length) {
      form.setValue(
        "attributes",
        attributes.map((attr: Attribute) => ({
          attributeId: attr.id,
          value: "",
        }))
      );
    }
  }, [attributes, selectedCategoryId]);

  const mutation = useMutation<Product, Error, FormValues>({
    mutationFn: (productData) => postProduct(productData),
    onSuccess: (response) => {
      router.push(`/products/${response.id}`);
      toast.success("Product created.");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Try again.");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate({ ...values, images: imageUrls });
  };

  const isMutationLoading = mutation.status === "pending";

  const removeImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
    form.setValue("images", newImageUrls);
    form.trigger("images");
  };

  return (
    <div className="max-w-[600px] w-full m-auto md:items-center md:justify-center h-full p-6">
      <h1 className="text-2xl mb-4">Create product</h1>
      <FileUploader
        imageUrls={imageUrls}
        setImageUrls={(urls) => {
          setImageUrls(urls);
          form.setValue("images", urls);
          form.trigger("images"); // Validate the images field after updating
        }}
        
        form={form}
      />

      <ImagePreviews imageUrls={imageUrls} removeImage={removeImage}/>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-8">
          <CategorySelector
            categories={categories}
            value={form.getValues("categoryId")}
            onChange={(value: string) => {
              setSelectedCategoryId(value);
              form.setValue("categoryId", value);
              form.trigger("categoryId"); // Trigger validation for categoryId
              form.trigger("attributes");
            }}
          />

          <TextInput
            label="Brand"
            placeholder="e.g. 'Nike'"
            required
            registration={form.register("brand")}
          />

          <TextInput
            label="Model"
            placeholder="e.g. 'Air Max 90'"
            required
            registration={form.register("model")}
          />

          <TextInput
            label="Price"
            type="number"
            placeholder="e.g. '100'"
            required
            registration={form.register("price", { valueAsNumber: true })}
          />

          {isLoading ? (
            <div className="flex justify-center items-center w-full p-5">
              <Loader size="20" className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            attributes.length > 0 && (
              <AnimatePresence>
                <AttributeInput
                  form={form}
                  attributes={attributes}
                  isMutationLoading={isMutationLoading}
                  fields={fields}
                />
              </AnimatePresence>
            )
          )}

          <div className="flex items-center justify-end">
            <Button
              className="mt-10"
             
              type="submit"
              disabled={!form.formState.isValid || isMutationLoading}
            >
              {isMutationLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};