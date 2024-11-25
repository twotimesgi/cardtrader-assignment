import { Category } from "@prisma/client";
import axios from "axios";

export interface CategoryData {
  id: string; 
  name: string;
  attributes: { id?: string; name: string; required: boolean; type: string }[];
}

export const updateCategory = async (categoryData: CategoryData): Promise<Category> => {
  try {
    if (!categoryData.id) {
        throw new Error("Category ID is required for updates.");
      }
    // Filter out attributes with empty names
    categoryData = {
      ...categoryData,
      attributes: categoryData.attributes.filter((attr) => attr.name.trim() !== ""),
    };

    

    // Send a PUT request to the API
    const { data } = await axios.put(`/api/categories`, categoryData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      throw new Error(response?.data?.error || "Failed to update category.");
    } else {
      throw new Error("An unknown error occurred while updating the category.");
    }
  }
};
