import { AttributeType, Category, Attribute} from "@prisma/client";

export interface Filter {
    attributeName: string;
    attributeType: AttributeType;
    possibleValues: string[];
    required?: boolean;
  }

  export interface CategoryAndAttributes extends Category {
    attributes: Attribute[]
  }
