import axios from "axios";

export const getAttributes = async ({
  categoryId,
}: {
  categoryId: string;
}) => {
    try{
    const { data } = await axios.get(`/api/categories/${categoryId}/attributes`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      throw new Error(response?.data?.error || "Failed to fetch attributes.");
    } else {
      throw new Error("An unknown error occurred while fetching products.");
    }
  }
};
