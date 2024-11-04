import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-error-handler";

const schema = z.object({
  value: z.string(),
  attributeId: z.string().uuid({ message: "attributeId must be a valid UUID" }), // Ensures categoryId is a valid UUID
});

export const POST = async (req: Request,
    { params }: { params: { productId: string }}) => {
  try {
    //TODO: Authenticate request
    // Parse and validate the request body
    const body = schema.parse(await req.json());
    const {productId} = params;

    // Insert product into the database
    const product = await db.productAttributeValue.create({
        data: {
          value: body.value,
          attributeId: body.attributeId,
          productId: productId
        },
      });

    return NextResponse.json(product);
  } catch (error: any) {
    // Log the exact error for debugging
    console.log("[POST /api/categories/[categoryId]/attributes/route.ts] Error:", JSON.stringify(error));

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
   
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError || 
        error instanceof Prisma.PrismaClientInitializationError || 
        error instanceof Prisma.PrismaClientValidationError) {
        return handlePrismaError(error);
    }

    // Handle unknown errors
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

