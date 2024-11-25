import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-error-handler";
import { AttributeType } from "@prisma/client";

const schema = z.object({
  name: z.string().min(2, { message: "Category name must be 2 or more characters long" }).trim(),
  attributes: z.array(
    z.object({
      name: z.string().min(1, { message: "Attribute name cannot be empty" }).trim(),
      required: z.boolean(),
      type: z.nativeEnum(AttributeType).default(AttributeType.STRING), // Default to STRING
    })
  ),
});

export const POST = async (req: Request) => {
  try {
    // TODO: Authenticate request
    const body = schema.parse(await req.json());
    // Filter out any attributes with empty names (after trimming whitespace)
    const filteredAttributes = body.attributes.filter((attr) => attr.name !== "");

    const category = await db.category.create({
      data: {
        name: body.name,
        attributes: {
          create: filteredAttributes.map((attribute) => ({
            name: attribute.name,
            required: attribute.required,
            type: attribute.type
          })),
        },
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    // Log the exact error for debugging
    console.log("[POST /api/categories] Error:", JSON.stringify(error));

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }

    // Handle Prisma errors
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return handlePrismaError(error);
    }

    // Handle unknown errors
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

const schemaDelete = z.object({
  categoryId: z.string().uuid({ message: "Invalid category ID" }), // Ensure valid UUID for the category ID

});

export const DELETE = async (req: Request) => {
  try {
    // Parse the request body to validate the category ID
    
    const body = schemaDelete.parse(await req.json());

    // Delete the category and cascade delete its attributes
    await db.category.delete({
      where: {
        id: body.categoryId,
      },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    // Log the error for debugging
    console.log("[DELETE /api/categories] Error:", JSON.stringify(error));

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }

    // Handle Prisma errors
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return handlePrismaError(error);
    }

    // Handle unknown errors
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
// Define schema for category and attributes




const schemaPut = z.object({
  id: z.string().uuid({ message: "Invalid category ID" }), // Ensure valid UUID for the category ID
  name: z.string().min(2, { message: "Category name must be 2 or more characters long" }).trim(),
  attributes: z
    .array(
      z.object({
        id: z.string().optional(), // Optional for new attributes
        name: z.string().min(1, { message: "Attribute name cannot be empty" }).trim(),
        required: z.boolean(),
        type: z.nativeEnum(AttributeType).optional().default(AttributeType.STRING),
      })
    )
    .superRefine((attrs, ctx) => {
      const names = new Set<string>();
      attrs.forEach((attr, index) => {
        if (names.has(attr.name)) {
          ctx.addIssue({
            code: "custom", // Specify 'custom' as the issue code
            path: [index, "name"], // Point to the specific attribute in the array
            message: "Duplicate attribute names are not allowed.",
          });
        } else {
          names.add(attr.name);
        }
      });
    }),
});

export const PUT = async (req: Request) => {
  try {
    // Parse and validate the request body
    const body = schemaPut.parse(await req.json());

    // Fetch existing attributes for the category
    const existingAttributes = await db.attribute.findMany({
      where: { categoryId: body.id },
    });

    // Separate attributes into updated, new, and removed
    const updatedAttributes = body.attributes.filter((attr) => attr.id); // Attributes with IDs
    const newAttributes = body.attributes.filter((attr) => !attr.id); // Attributes without IDs
    const removedAttributeIds = existingAttributes
      .map((attr) => attr.id)
      .filter((id) => !body.attributes.some((attr) => attr.id === id)); // IDs of attributes to delete

    // Identify new or updated required attributes
    const newRequiredAttributes = newAttributes.filter((attr) => attr.required);
    const updatedToRequiredAttributes = updatedAttributes.filter((attr) => {
      const existing = existingAttributes.find((existingAttr) => existingAttr.id === attr.id);
      return existing && !existing.required && attr.required; // Was not required, now is required
    });

    // Combine all new or updated required attributes
    const allRequiredAttributes = [
      ...newRequiredAttributes.map((attr) => ({ id: attr.id, name: attr.name })),
      ...updatedToRequiredAttributes.map((attr) => ({ id: attr.id, name: attr.name })),
    ];

    // Update the database in a transaction
    const updatedCategory = await db.$transaction(async (prisma) => {
      // Update category and its attributes
      const category = await prisma.category.update({
        where: { id: body.id },
        data: {
          name: body.name,
          attributes: {
            delete: removedAttributeIds.map((id) => ({ id })), // Delete removed attributes
            create: newAttributes.map((attr) => ({
              name: attr.name,
              required: attr.required,
              type: attr.type,
            })), // Create new attributes
            update: updatedAttributes.map((attr) => ({
              where: { id: attr.id },
              data: {
                name: attr.name,
                required: attr.required,
                type: attr.type,
              },
            })), // Update existing attributes
          },
        },
      });

      // Identify products missing required attributes
      if (allRequiredAttributes.length > 0) {
        const requiredAttributeIds = allRequiredAttributes.map((attr) => attr.id);

        const productsMissingAttributes = await prisma.$queryRaw<
          { productId: string }[]
        >(Prisma.sql`
          SELECT p.id AS productId
          FROM Product p
          LEFT JOIN ProductAttributeValue pav 
          ON p.id = pav.productId AND pav.attributeId IN (${Prisma.join(requiredAttributeIds)})
          WHERE p.categoryId = ${body.id} AND p.published = true
          GROUP BY p.id
          HAVING COUNT(DISTINCT pav.attributeId) < ${requiredAttributeIds.length}
        `);

        const productIdsToUnpublish = productsMissingAttributes.map((row) => row.productId);

        // Unpublish products missing required attributes
        if (productIdsToUnpublish.length > 0) {
          await prisma.product.updateMany({
            where: { id: { in: productIdsToUnpublish } },
            data: { published: false },
          });
        }
      }

      return category;
    });

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    console.error("[PUT /api/categories] Error:", JSON.stringify(error));

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }

    // Handle Prisma errors
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return NextResponse.json({ error: "Database operation failed", details: error.message }, { status: 500 });
    }

    // Handle unknown errors
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
