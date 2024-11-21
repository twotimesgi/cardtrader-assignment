import { db } from "@/lib/db";
import { AttributeType, Prisma } from "@prisma/client";
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
    type: z.nativeEnum(AttributeType).default(AttributeType.STRING), // Default to STRING
  });

// POST endpoint to create a new attribute
export const POST = async (
  req: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const body = schema.parse(await req.json());
    const { categoryId } = params;

    const product = await db.attribute.create({
      data: {
        name: body.name,
        required: body.required ?? false,
        categoryId: categoryId,
        type: body.type
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.log(
      "POST /api/categories/[categoryId]/attributes/route.ts error:",
      JSON.stringify(error)
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return handlePrismaError(error);
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// GET endpoint to retrieve all attributes of a specific category
export const GET = async (
  req: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const { categoryId } = await params;

    // Fetch all attributes for the given categoryId
    const attributes = await db.attribute.findMany({
      where: {
        categoryId,
      },
      select: {
        id: true,
        name: true,
        required: true,
        categoryId: true,
        type: true
      },
      orderBy: {
        required: "desc", // Optional: Order required attributes first
      },
    });

    return NextResponse.json(attributes);
  } catch (error: any) {
    console.log(
      "GET /api/categories/[categoryId]/attributes/route.ts error:",
      JSON.stringify(error)
    );

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return handlePrismaError(error);
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
