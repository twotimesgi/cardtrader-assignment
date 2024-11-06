import { Product } from "@prisma/client";
import axios from "axios";
// src/app/routes/products/_api/postProduct.ts

// Define the type for product data
export interface ProductData {
  model: string;
  brand: string;
  price: number;
  categoryId: string;
  attributes: { attributeId: string; value: string }[];
}


export const postProduct = async (productData: ProductData): Promise<Product> => {
  try {
    const { data } = await axios.post("/api/products", productData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      throw new Error(response?.data?.error || "Failed to create product.");
    } else {
      throw new Error("An unknown error occurred while creating the product.");
    }
  }
};
