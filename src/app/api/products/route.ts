import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prisma-error-handler";
import { ProductAndImageUrls } from "../../../../types/filters";

const schema = z.object({
  model: z
    .string()
    .min(2, { message: "Model must be 2 or more characters long" }),
  brand: z
    .string()
    .min(2, { message: "Brand must be 2 or more characters long" }),
  price: z.number(),
  categoryId: z.string().uuid({ message: "categoryId must be a valid UUID" }),
  attributes: z.array(
    z.object({
      attributeId: z
        .string()
        .uuid({ message: "attributeId must be a valid UUID" }),
      value: z.string(), // Allow empty strings but validate later
    })
  ),
  images: z.array(
    z.string().url({ message: "Each image must be a valid URL" })
  ),
});

export const POST = async (req: Request) => {
  try {
    const body = schema.parse(await req.json());

    console.log(body);
    // Step 1: Fetch attributes from the database
    const attributeIds = body.attributes.map((attr) => attr.attributeId);
    const dbAttributes = await db.attribute.findMany({
      where: { id: { in: attributeIds } },
      select: { id: true, name: true, required: true },
    });

    // Step 2: Check for required attributes and ensure they have non-empty values
    const requiredAttributes = dbAttributes.filter((attr) => attr.required);
    const missingOrEmptyRequiredAttributes = requiredAttributes.filter(
      (reqAttr) => {
        const providedAttribute = body.attributes.find(
          (attr) => attr.attributeId === reqAttr.id
        );
        return !providedAttribute || providedAttribute.value.trim() === ""; // Missing or empty required attribute
      }
    );

    if (missingOrEmptyRequiredAttributes.length > 0) {
      return NextResponse.json(
        {
          error: "Missing or empty required attributes",
          missingAttributes: missingOrEmptyRequiredAttributes.map(
            (attr) => attr.name
          ),
        },
        { status: 400 }
      );
    }

    // Step 3: Filter attributes - include required attributes and non-required attributes only if they have values
    const attributesToInsert = body.attributes.filter((attr) => {
      const dbAttribute = dbAttributes.find(
        (dbAttr) => dbAttr.id === attr.attributeId
      );
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

    return NextResponse.json(
      { error: error.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    // Pagination: Skip and Take
    const skip = parseInt(searchParams.get("skip") ?? "0");
    const take = parseInt(searchParams.get("take") ?? "12");

    // Other Filters
    const categoryId = searchParams.get("categoryId");
    const orderByParam = searchParams.get("order_by");
    const search = searchParams.get("search")?.trim() || "";

    // Where Clauses (Filters)
    const whereClauses: Prisma.Sql[] = [];

    // Always filter published products
    whereClauses.push(Prisma.sql`Product.published = true`);

    // Search filter (model or brand)
    if (search) {
      whereClauses.push(
        Prisma.sql`(model LIKE ${`%${search}%`} OR brand LIKE ${`%${search}%`})`
      );
    }

    // Category filter (if categoryId is provided) and attribute filters specific to every category
    if (categoryId) {
      whereClauses.push(Prisma.sql`categoryId = ${categoryId}`);
      const attributeFilters: Prisma.Sql[] = [];
      for (const [key, value] of searchParams.entries()) {
        if (key.startsWith("attribute_")) {
          const attributeName = key.replace("attribute_", "");

          const attribute = await db.attribute.findFirst({
            where: { name: attributeName, categoryId: categoryId },
            select: { id: true, type: true },
          });

          if (!attribute) continue; // Skip unknown attributes

          const values = value.split(",").map((v) => v.trim());
          if (attribute.type === "STRING") {
            attributeFilters.push(
              Prisma.sql`
        EXISTS (
          SELECT 1
          FROM ProductAttributeValue pav
          WHERE pav.productId = Product.id
          AND pav.attributeId = ${attribute.id}
          AND pav.value IN (${Prisma.join(values)})
        )`
            );
          } else if (attribute.type === "NUMBER" && values.length === 2) {
            const [min, max] = values.map(Number);
            attributeFilters.push(
              Prisma.sql`
        EXISTS (
          SELECT 1
          FROM ProductAttributeValue pav
          WHERE pav.productId = Product.id
          AND pav.attributeId = ${attribute.id}
          AND CAST(pav.value AS DECIMAL) BETWEEN ${min} AND ${max}
        )`
            );
          } else if (attribute.type === "BOOLEAN") {
            const booleanValue = value.toLowerCase() === "true";
            attributeFilters.push(
              Prisma.sql`
        EXISTS (
          SELECT 1
          FROM ProductAttributeValue pav
          WHERE pav.productId = Product.id
          AND pav.attributeId = ${attribute.id}
          AND pav.value = ${booleanValue.toString()}
        )`
            );
          }
        }
      }

      // Merge attribute filters with main filters
      if (attributeFilters.length > 0) {
        whereClauses.push(
          Prisma.sql`(${Prisma.join(attributeFilters, " AND ")})`
        );
      }
    }

    // Combine all filters
    const whereSQL = Prisma.sql`WHERE ${Prisma.join(whereClauses, " AND ")}`;

    // Apply ORDER BY based on orderByParam
    const orderBySQL = Prisma.raw(`
      ORDER BY ${
        orderByParam === "low_to_high"
          ? "price ASC"
          : orderByParam === "high_to_low"
          ? "price DESC"
          : "createdAt DESC, Product.id ASC"
      }
    `);

    const products = await db.$queryRaw<ProductAndImageUrls[]>(
      Prisma.sql`
        SELECT 
          Product.id,
          Product.model,
          Product.brand,
          Product.price,
          Product.categoryId,
          Product.createdAt,
          Product.updatedAt,
          Product.published,
          (
            SELECT JSON_ARRAYAGG(url)
            FROM ProductImage
            WHERE ProductImage.productId = Product.id
          ) AS imageUrls
        FROM Product
        ${whereSQL}
        ${orderBySQL}
        LIMIT ${take} OFFSET ${skip}
      `
    );

    // Count query for total results (without LIMIT or OFFSET)
    const countResult = await db.$queryRaw<{ count: string }[]>(
      Prisma.sql`
    SELECT CAST(COUNT(*) AS CHAR) AS count
    FROM Product
    ${whereSQL}
  `
    );

    const count = countResult[0]?.count || "0";

    // Return the response
    return NextResponse.json(
      {
        products: products.map((product) => ({
          ...product,
          id: product.id.toString(),
          imageUrls: product.imageUrls || [],
        })),
        count,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[GET /api/products] Error:", error);

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
