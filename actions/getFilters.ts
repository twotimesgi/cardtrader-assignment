import { db } from "@/lib/db";

interface GetFiltersParameters {
  categoryId?: string;
}

export const getFilters = async ({ categoryId }: GetFiltersParameters) => {
  try {
    // Fetch all attributes for the specified category and their possible values
    const attributes = await db.attribute.findMany({
      where: {
        ...(categoryId && { categoryId }), 
      },
      select: {
        id: true,
        name: true,
        type: true,
        required: true,
        ProductAttributeValue: {
          select: {
            value: true,
          },
          distinct: ['value'], // Ensure unique values for each attribute
        },
      },
    });

    const filters = attributes.map((attribute) => ({
      attributeName: attribute.name,
      attributeType: attribute.type,
      required: attribute.required,
      possibleValues: attribute.ProductAttributeValue.map((valueObj) => valueObj.value),
    }));

    return filters;
  } catch (error: any) {
    console.error("[actions/getFilters.ts] Error:", error);
    return [];
  }
};
