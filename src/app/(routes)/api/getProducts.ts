
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import qs from "query-string";
import axios from "axios";
import { PAGE_SIZE } from "../../../../const";

export const getProducts = async ({searchParams, skip, categoryId} : {searchParams: ReadonlyURLSearchParams, skip: number, categoryId: string}) => {
    try {
      // Construct the query string based on searchParams, pagination, and categoryId
      const currentParams = Object.fromEntries(searchParams.entries());

      const query = qs.stringify({
        ...currentParams,
        categoryId,
        skip,
        take: PAGE_SIZE,
      });

      const { data } = await axios.get(`/api/products?${query}`);
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