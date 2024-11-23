import { AttributeType, Category, Attribute, Product, ProductImage} from "@prisma/client";

export interface Filter {
    attributeName: string;
    attributeType: AttributeType;
    possibleValues: string[];
    required?: boolean;
  }

  export interface CategoryAndAttributes extends Category {
    attributes: Attribute[]
  }

  export interface ProductAndImageUrls extends Product{
    imageUrls: string[]    
  }