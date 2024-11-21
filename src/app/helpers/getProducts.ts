import { ReadonlyURLSearchParams } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import { PAGE_SIZE } from "../../../const";

export const getProducts = async ({
  searchParams,
  skip,
  categoryId,
  take,
  search, // Add search as a direct parameter
}: {
  searchParams: ReadonlyURLSearchParams;
  skip: number;
  categoryId?: string;
  take: number;
  search: string; // Explicitly define search as a parameter
}) => {
  try {
    // Convert searchParams to a regular object
    const currentParams = Object.fromEntries(searchParams.entries());

    // Build the query object
    const query: Record<string, any> = {
      ...currentParams,
      categoryId,
      skip,
      take,
    };

    // Conditionally add `search` parameter if it’s not empty
    if (search) {
      query.search = search;
    }

    // Convert query object to a query string
    const queryString = qs.stringify(query);

    // Make the API request
    const { data } = await axios.get(`/api/products?${queryString}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      throw new Error(response?.data?.error || "Failed to fetch products");
    } else {
      throw new Error("An unknown error occurred while fetching products.");
    }
  }
};
