import { db } from "@/lib/db";

interface GetProductsParameters {
  skip?: number | undefined;
  take?: number | undefined;
  categoryId?: string;
  attributes?: { [attributeName: string]: string[] }; // Supports multiple values per attribute
}


export const getProducts = async ({
  skip,
  take = 10,
  categoryId,
  attributes,
}: GetProductsParameters) => {
  try {
    // Fetch required attributes for the specified category
    const requiredAttributes = await db.attribute.findMany({
      where: {
        ...(categoryId && { categoryId }),
        required: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const requiredAttributeIds = requiredAttributes.map((attr) => attr.id);

    const baseFilter = requiredAttributes.length
      ? {
          productAttributes: {
            some: {
              attributeId: {
                in: requiredAttributeIds,
              },
            },
          },
        }
      : {};

    const attributeFilters = attributes
      ? Object.entries(attributes).map(([attributeName, values]) => ({
          productAttributes: {
            some: {
              AND: [
                { attribute: { name: attributeName } }, // Match the attribute name
                { value: { in: values } }, // Match any of the selected values
              ],
            },
          },
        }))
      : [];

    const count = await db.product.count({
      where: {
        AND: [
          baseFilter, // Ensure the product has required attributes
          ...(categoryId ? [{ categoryId }] : []), // Filter by category if provided
          ...attributeFilters, // Apply each attribute filter with OR logic across values
        ],
      },
    });

    const products = await db.product.findMany({
      ...(take && { take }),
      ...(skip && { skip }),
      where: {
        AND: [
          baseFilter, // Ensure the product has required attributes
          ...(categoryId ? [{ categoryId }] : []), // Filter by category if provided
          ...attributeFilters, // Apply each attribute filter with OR logic across values
        ],
      },
      include: {
        productAttributes: {
          include: {
            attribute: true,
          },
        },
      },
    });

    // Step 3: Return both products and total count
    return { products, count };
  } catch (error: any) {
    console.log("[actions/getProducts.ts] Error: ", JSON.stringify(error));
    return { products: [], count: 0 };
  }
};
