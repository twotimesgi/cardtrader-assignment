import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-error-handler";

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be 2 or more characters long" }),
  required: z
    .boolean({ message: "Required must be a boolean value" })
    .optional(),
});

export const POST = async (
  req: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    //TODO: Authenticate request
    // Parse and validate the request body
    const body = schema.parse(await req.json());
    const { categoryId } = params;

    // Insert product into the database
    const product = await db.attribute.create({
      data: {
        name: body.name,
        required: body.required ?? false,
        categoryId: categoryId,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    // Log the exact error for debugging
    console.log(
      "POST /api/categories/[categoryId]/attributes/route.ts error:",
      JSON.stringify(error)
    );

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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
