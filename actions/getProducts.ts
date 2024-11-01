import { db } from "@/lib/db";

interface GetProductsParameters {
  skip?: number;
  take?: number;
  categoryId?: string;
  attributes?: { [attributeName: string]: string };
}

export const getProducts = async ({
  skip,
  take = 10,
  categoryId,
  attributes,
}: GetProductsParameters) => {
  try {
    //To be sure products have all the required attributes set we could also use MySql Trigger running on product insertion
    // Get all required attribute IDs for the specified category
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

    const requiredAttributeIds = requiredAttributes.map(attr => attr.id);

    // Base filter to ensure each product has ProductAttributeValues for all required attributes
    const baseFilter = {
      productAttributes: {
        some: {
          attributeId: {
            in: requiredAttributeIds, // Ensure a ProductAttributeValue exists for each required attribute
          },
        },
      },
    };

    // If additional filters are specified, apply them on top of the base filter
    const additionalFilters = [
      ...(categoryId ? [{ categoryId }] : []), // Filter by categoryId if provided
      ...(attributes && Object.keys(attributes).length > 0
        ? [
            {
              productAttributes: {
                some: {
                  AND: Object.entries(attributes).map(([attributeName, attributeValue]) => ({
                    attribute: {
                      name: attributeName,
                      required: true, // Only match required attributes
                    },
                    value: attributeValue, // Match the specified attribute value
                  })),
                },
              },
            },
          ]
        : []),
    ];

    // Execute the query with both the base filter and additional filters if provided
    const products = await db.product.findMany({
      ...(take && { take }),
      ...(skip && { skip }),
      where: {
        AND: [
          baseFilter, // Ensure the product has ProductAttributeValues for required attributes
          ...additionalFilters, // Apply categoryId and attribute filters if specified
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

    return products;
  } catch (error: any) {
    console.log("[actions/getProducts.ts] Error: ", JSON.stringify(error));
    return [];
  }
};
