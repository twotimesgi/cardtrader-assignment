
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

//Handling all the types https://www.prisma.io/docs/orm/reference/error-reference
export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
        return NextResponse.json(
          { error: error.message || "The value provided for a field is too long for the column." },
          { status: 400 }
        );
      case 'P2001':
        return NextResponse.json(
          { error: error.message || "Record not found for the query." },
          { status: 404 }
        );
      case 'P2002':
        return NextResponse.json(
          { error: error.message || "Unique constraint failed: A duplicate value exists for a unique field." },
          { status: 409 }
        );
      case 'P2003':
        return NextResponse.json(
          { error: error.message || "Foreign key constraint failed: The related record does not exist." },
          { status: 400 }
        );
      case 'P2004':
        return NextResponse.json(
          { error: error.message || "A constraint failed in the database." },
          { status: 400 }
        );
      case 'P2005':
        return NextResponse.json(
          { error: error.message || "An invalid value was provided for a field." },
          { status: 400 }
        );
      case 'P2006':
        return NextResponse.json(
          { error: error.message || "The provided value is of an incorrect type for the field." },
          { status: 400 }
        );
      case 'P2007':
        return NextResponse.json(
          { error: error.message || "Data validation error in the database." },
          { status: 400 }
        );
      case 'P2008':
        return NextResponse.json(
          { error: error.message || "Query parsing failed. This could be due to invalid fields or incorrect syntax." },
          { status: 400 }
        );
      case 'P2009':
        return NextResponse.json(
          { error: error.message || "Query validation failed due to invalid constraints or field names." },
          { status: 400 }
        );
      case 'P2010':
        return NextResponse.json(
          { error: error.message || "Raw query execution failed. Check the syntax and validity of your query." },
          { status: 400 }
        );
      case 'P2011':
        return NextResponse.json(
          { error: error.message || "Null constraint violation: A required field cannot be null." },
          { status: 400 }
        );
      case 'P2012':
        return NextResponse.json(
          { error: error.message || "Missing required value for a non-nullable field." },
          { status: 400 }
        );
      case 'P2013':
        return NextResponse.json(
          { error: error.message || "Missing required argument in the query." },
          { status: 400 }
        );
      case 'P2014':
        return NextResponse.json(
          { error: error.message || "Related records exist that prevent this operation." },
          { status: 400 }
        );
      case 'P2015':
        return NextResponse.json(
          { error: error.message || "A related record was not found." },
          { status: 404 }
        );
      case 'P2016':
        return NextResponse.json(
          { error: error.message || "Query interpretation failed. Please check the syntax and structure of the query." },
          { status: 400 }
        );
      case 'P2017':
        return NextResponse.json(
          { error: error.message || "Incorrect relation in the query structure." },
          { status: 400 }
        );
      case 'P2018':
        return NextResponse.json(
          { error: error.message || "Required connected records were not found." },
          { status: 400 }
        );
      case 'P2019':
        return NextResponse.json(
          { error: error.message || "Invalid input was provided to a table." },
          { status: 400 }
        );
      case 'P2020':
        return NextResponse.json(
          { error: error.message || "Value provided is out of range for the field." },
          { status: 400 }
        );
      case 'P2021':
        return NextResponse.json(
          { error: error.message || "The table being queried does not exist in the database." },
          { status: 404 }
        );
      case 'P2022':
        return NextResponse.json(
          { error: error.message || "A column being queried does not exist in the database." },
          { status: 404 }
        );
      case 'P2023':
        return NextResponse.json(
          { error: error.message || "Inconsistent data was found in the column." },
          { status: 400 }
        );
      case 'P2024':
        return NextResponse.json(
          { error: error.message || "Transaction failed due to a timeout or deadlock." },
          { status: 500 }
        );
      default:
        return NextResponse.json(
          { error: error.message || "An unknown database error occurred." },
          { status: 500 }
        );
    }
  }

  // Handle PrismaClientInitializationError (Database connection or environment issues)
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      { error: error.message || "Failed to connect to the database. Please check your connection string or database status." },
      { status: 500 }
    );
  }

  // Handle PrismaClientValidationError (Invalid query construction or arguments)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      { error: error.message || "Query validation error. Please check your query structure and arguments." },
      { status: 400 }
    );
  }
}
