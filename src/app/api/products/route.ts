import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/prismaErrorHandler";

const schema = z.object({
  model: z.string().min(2, { message: "Model must be 2 or more characters long" }),
  brand: z.string().min(2, { message: "Brand must be 2 or more characters long" }),
  price: z.number(),
  categoryId: z.string().uuid({ message: "categoryId must be a valid UUID" }), // Ensures categoryId is a valid UUID
});

export const POST = async (req: Request) => {
  try {

    //TODO: Authenticate request
    // Parse and validate the request body
    const body = schema.parse(await req.json());

    // Insert product into the database
    const product = await db.product.create({
        data: {
          model: body.model,
          brand: body.brand,
          price: body.price,
          categoryId: body.categoryId
        },
      });

    return NextResponse.json(product);
  } catch (error: any) {
    // Log the exact error for debugging
    console.log("POST /api/products/route.ts error:", JSON.stringify(error));

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
    return NextResponse.json({ error: error.message ?? "Internal Server Error" }, { status: 500 });
  }
};


// I decided to use server actions instead of GET api endpoints
// export const GET = async (req: Request) => {

//     //Return only products that have values for all required attributes in their category?
//     try {
//       const url = new URL(req.url);
//       const searchParams = new URLSearchParams(url.searchParams);
      
//       const skip = parseInt(searchParams.get("skip") ?? "0");
//       const categoryId = searchParams.get("categoryId");
  
//       // Parse attribute filters from query params
//       const attributeFilters: { [key: string]: string } = {};
//       searchParams.forEach((value, key) => {
//         if (key.startsWith("attribute_")) {
//           const attributeName = key.replace("attribute_", "");
//           attributeFilters[attributeName] = value;
//         }
//       });
  
//       const products = await db.product.findMany({
//         take: 10,
//         skip,
//         where: {
//           ...(categoryId && { categoryId }), // Filter by categoryId if provided
  
//           // Filter by attributes if any attribute filters were provided
//           ...(Object.keys(attributeFilters).length > 0 && {
//             productAttributes: {
//               some: {
//                 OR: Object.entries(attributeFilters).map(([name, value]) => ({
//                   attribute: {
//                     name, // Attribute name must match
//                   },
//                   value, // Attribute value must match
//                 })),
//               },
//             },
//           }),
//         },
//         include: {
//           productAttributes: {
//             include: {
//               attribute: true,
//             },
//           },
//         },
//       });
  
//       return NextResponse.json(products);
//     } catch (error: any) {
//       console.log("[GET /api/products/route.ts] Error:", JSON.stringify(error));
  
//       // Handle Prisma errors
//       if (
//         error instanceof Prisma.PrismaClientKnownRequestError ||
//         error instanceof Prisma.PrismaClientInitializationError ||
//         error instanceof Prisma.PrismaClientValidationError
//       ) {
//         return handlePrismaError(error);
//       }
  
//       // Handle unknown errors
//       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
//   };