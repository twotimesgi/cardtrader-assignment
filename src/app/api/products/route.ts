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
  attributes: z.array(
    z.object({
      attributeId: z.string().uuid({ message: "attributeId must be a valid UUID" }),
      value: z.string(), // Allow empty strings but validate later
    })
  ),
  images: z.array(z.string().url({ message: "Each image must be a valid URL" })),
});

export const POST = async (req: Request) => {
  try {
    const body = schema.parse(await req.json());

    console.log(body)
    // Step 1: Fetch attributes from the database
    const attributeIds = body.attributes.map((attr) => attr.attributeId);
    const dbAttributes = await db.attribute.findMany({
      where: { id: { in: attributeIds } },
      select: { id: true, name: true, required: true },
    });

    // Step 2: Check for required attributes and ensure they have non-empty values
    const requiredAttributes = dbAttributes.filter((attr) => attr.required);
    const missingOrEmptyRequiredAttributes = requiredAttributes.filter((reqAttr) => {
      const providedAttribute = body.attributes.find((attr) => attr.attributeId === reqAttr.id);
      return !providedAttribute || providedAttribute.value.trim() === ""; // Missing or empty required attribute
    });

    if (missingOrEmptyRequiredAttributes.length > 0) {
      return NextResponse.json(
        {
          error: "Missing or empty required attributes",
          missingAttributes: missingOrEmptyRequiredAttributes.map((attr) => attr.name),
        },
        { status: 400 }
      );
    }

    // Step 3: Filter attributes - include required attributes and non-required attributes only if they have values
    const attributesToInsert = body.attributes.filter((attr) => {
      const dbAttribute = dbAttributes.find((dbAttr) => dbAttr.id === attr.attributeId);
      return dbAttribute && (dbAttribute.required || attr.value.trim() !== "");
    });

    // Step 4: Create the product and its relations
    const product = await db.product.create({
      data: {
        model: body.model,
        brand: body.brand,
        price: body.price,
        categoryId: body.categoryId,
        productAttributes: {
          create: attributesToInsert.map((attribute) => ({
            attributeId: attribute.attributeId,
            value: attribute.value,
          })),
        },
        productImages: {
          create: body.images.map((url) => ({ url })),
        },
      },
      include: {
        productAttributes: true,
        productImages: true,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.log("POST /api/products error:", JSON.stringify(error));

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
    const orderByParam = searchParams.get("order_by");
    const search = searchParams.get("search")?.trim() || ""; 

    const searchFilter = search
  ? {
      OR: [
        { model: { contains: search } },
        { brand: { contains: search } },
      ],
    }: {}
    

    // Parse attribute filters from query params
    const attributes: { [attributeName: string]: string[] } = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("attribute_")) {
        const attributeName = key.replace("attribute_", "");
        attributes[attributeName] = value.split(",");
      }
    });

    // Fetch required attributes
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

    // Base filter for required attributes
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

    // Generate attribute filters based on query params
    const attributeFilters = Object.entries(attributes).map(([attributeName, values]) => ({
      productAttributes: {
        some: {
          attribute: { name: attributeName },
          value: { in: values },
        },
      },
    }));

    // Define orderBy condition based on the orderByParam
    let orderBy: Prisma.ProductOrderByWithRelationInput | undefined = undefined;
    switch (orderByParam) {
      case "low_to_high":
        orderBy = { price: "asc" };
        break;
      case "high_to_low":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = undefined; // No ordering if orderByParam is not specified or invalid
    }

    // Count the total matching products
    const count = await db.product.count({
      where: {
        AND: [
          baseFilter,
          searchFilter,
          ...(categoryId ? [{ categoryId }] : []),
          ...attributeFilters,
        ],
      },
    });

    // Fetch the products with filtering, ordering, and pagination
    const products = await db.product.findMany({
      ...(orderBy ? { orderBy } : {}), // Apply orderBy only if it's defined
      take,
      skip,
      where: {
        AND: [
          baseFilter,
          searchFilter,
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
        productImages: {
          select: {
            url: true,
          },
        },
      },
    });

    return NextResponse.json({ products, count });
  } catch (error: any) {
    console.log("[GET /api/products] Error:", JSON.stringify(error));

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
