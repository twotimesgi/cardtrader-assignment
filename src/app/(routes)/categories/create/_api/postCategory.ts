import { Category } from "@prisma/client";
import axios from "axios";

export interface CategoryData {
  name: string;
  attributes: { name: string; required: boolean, type: string }[];
}

export const postCategory = async (categoryData: CategoryData): Promise<Category> => {
  try {
    categoryData = {
      ...categoryData,
      attributes: categoryData.attributes.filter((attr) => attr.name.trim() !== ""),
    };
    const { data } = await axios.post("/api/categories", categoryData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      throw new Error(response?.data?.error || "Failed to create category.");
    } else {
      throw new Error("An unknown error occurred while creating the category.");
    }
  }
};
