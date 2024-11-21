"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ProductCard } from "@/components/product-card";
import { MotionDiv } from "@/components/motion-div";
import { getProducts } from "../app/helpers/getProducts";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { PAGE_SIZE } from "../../const";
import { useIntersectionObserver } from "../app/hooks/useIntersectionObserver";
import { useEffect } from "react";

interface ProductsContainerProps {
  categoryId?: string ;
  categoryName?: string;
}

// Motion variants for product cards
const productVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export const ProductsContainer = ({ categoryId, categoryName }: ProductsContainerProps) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || ""; // Get the `search` parameter explicitly
  
  const {
    data,
    isLoading,
    refetch,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", categoryId, searchParams.toString()],
    queryFn: ({ pageParam = 0 }) =>
      getProducts({
        searchParams,
        skip: pageParam * PAGE_SIZE,
        take: PAGE_SIZE,
        categoryId,
        search, // Pass the search parameter explicitly to getProducts
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      const totalFetched = allPages.flatMap((page) => page.products).length;
      return totalFetched < lastPage.count ? allPages.length : undefined;
    },
  });

  const loaderRef = useIntersectionObserver(fetchNextPage, !!hasNextPage);

  if (isError) {
    return (
      <div className="flex items-center justify-center flex-col text-muted-foreground gap-2 py-[32vh]">
        <ExclamationTriangleIcon className="size-4" />
        <span className="text-sm">Error loading products.</span>
      </div>
    );
  }

  // Combine all pages of products
  const allProducts = data?.pages?.flatMap((page) => page.products) || [];

  return (
    <div>
      <h1 className="text-xl mb-4">{categoryName ?? "All Products"}</h1>

      {/* No products found*/}
      {allProducts.length === 0 && !isLoading && (
        <div className="flex items-center justify-center text-muted-foreground py-[32vh]">
          <span className="text-sm">No products found.</span>
        </div>
      )}

      {/* Products grid */}
      <div className="grid lg:grid-cols-3 grid-cols-2 md:gap-x-6 gap-x-2 gap-y-4 w-full">
        {allProducts.map((product) => (
          <MotionDiv
            key={product.id}
            variants={productVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <ProductCard
              id={product.id}
              model={product.model}
              brand={product.brand}
              productImageUrls={product.productImages}
              price={product.price}
            />
          </MotionDiv>
        ))}
      </div>

      {/* Skeleton loader cards when more results are available or is loading */}
      {(hasNextPage || isLoading) && (
        <div className="grid lg:grid-cols-3 grid-cols-2 md:gap-x-6 gap-x-2 gap-y-4 w-full">
          {[...Array(PAGE_SIZE)].map((_, index) => (
            <div ref={index === 0 ? loaderRef : null} key={index}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
