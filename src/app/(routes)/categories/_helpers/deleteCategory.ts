import axios from "axios";

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await axios.delete("/api/categories", {
      data: { categoryId }, // Pass the `categoryId` in the request body
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      throw new Error(response?.data?.error || "Failed to delete category.");
    } else {
      throw new Error("An unknown error occurred while deleting the category.");
    }
  }
};
