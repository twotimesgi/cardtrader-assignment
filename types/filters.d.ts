import { AttributeType } from "@prisma/client";

export interface Filter {
    attributeName: string;
    attributeType: AttributeType;
    possibleValues: string[];
    required?: boolean;
  }