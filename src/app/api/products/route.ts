import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-error-handler";

const schema = z.object({
  model: z.string().min(2, { message: "Model must be 2 or more characters long" }),
  brand: z.string().min(2, { message: "Brand must be 2 or more characters long" }),
  price: z.number(),
  categoryId: z.string().uuid({ message: "categoryId must be a valid UUID" }),
});

export const POST = async (req: Request) => {
  try {
    const body = schema.parse(await req.json());

    const product = await db.product.create({
      data: {
        model: body.model,
        brand: body.brand,
        price: body.price,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.log("POST /api/products/route.ts error:", JSON.stringify(error));

    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
   
    if (error instanceof Prisma.PrismaClientKnownRequestError || 
        error instanceof Prisma.PrismaClientInitializationError || 
        error instanceof Prisma.PrismaClientValidationError) {
      return handlePrismaError(error);
    }

    return NextResponse.json({ error: error.message ?? "Internal Server Error" }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const skip = parseInt(searchParams.get("skip") ?? "0");
    const take = parseInt(searchParams.get("take") ?? "10");
    const categoryId = searchParams.get("categoryId");

    const attributes: { [attributeName: string]: string[] } = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("attribute_")) {
        const attributeName = key.replace("attribute_", "");
        attributes[attributeName] = value.split(","); // Store multiple values for each attribute
      }
    });

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

    const attributeFilters = Object.entries(attributes).map(([attributeName, values]) => ({
      productAttributes: {
        some: {
          attribute: { name: attributeName },
          value: { in: values },
        },
      },
    }));

    const count = await db.product.count({
      where: {
        AND: [
          baseFilter,
          ...(categoryId ? [{ categoryId }] : []),
          ...attributeFilters,
        ],
      },
    });

    const products = await db.product.findMany({
      take,
      skip,
      where: {
        AND: [
          baseFilter,
          ...(categoryId ? [{ categoryId }] : []),
          ...attributeFilters,
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

    return NextResponse.json({products: products, count: count});
  } catch (error: any) {
    console.log("[GET /api/products/route.ts] Error:", JSON.stringify(error));

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return handlePrismaError(error);
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
