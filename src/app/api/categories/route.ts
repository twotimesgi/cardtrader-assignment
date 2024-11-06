import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-error-handler";

const schema = z.object({
  name: z.string().min(2, { message: "Category name must be 2 or more characters long" }).trim(),
  attributes: z.array(
    z.object({
      name: z.string().min(1, { message: "Attribute name cannot be empty" }).trim(),
      required: z.boolean(),
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
