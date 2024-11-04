"use client";

import { ProductCard } from "@/app/(routes)/_components/product-card";
import { MotionDiv } from "@/components/motion-div";
import { Product } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { getProducts } from "../_api/getProducts";
import { PAGE_SIZE } from "../../../../const";
import { useIntersectionObserver } from "../_hooks/useIntersectionObserver";

interface ProductsContainerProps {
  categoryId: string;
  categoryName: string;
}

// Motion variants for product cards
const productVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

// Sample product images
const SAMPLE_IMAGES = [
  "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/32c4e533-1f15-472c-bb50-28570ce5e766/ZM+VAPOR+16+ELITE+FG.png",
  "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5c191f19-9304-41b5-9a6e-aa31a18c4dcc/ZM+VAPOR+16+ELITE+FG.png",
  "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fa829b33-2547-4479-9e85-43f14e2ed593/ZM+VAPOR+16+ELITE+FG.png",
];

export const ProductsContainer = ({ categoryId, categoryName }: ProductsContainerProps) => {
  const searchParams = useSearchParams();

  const {
    data,
    isLoading,
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
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.products).length;
      return totalFetched < lastPage.count ? allPages.length : undefined;
    },
  });

  const loaderRef = useIntersectionObserver(fetchNextPage, !!hasNextPage);

  if (isError) {
    return (
      <div className="flex items-center justify-center flex-col text-muted-foreground gap-2">
        <ExclamationTriangleIcon className="size-4" />
        <span className="text-sm">Error loading products.</span>
      </div>
    );
  }

  // Combine all pages of products
  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  return (
    <div>
      <div className="text-xl mb-4">{categoryName}</div>
      
      {/* No products found or loading message */}
      {allProducts.length === 0 && !isLoading && (
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="text-sm">No products found.</span>
        </div>
      )}
      
      {/* Products grid */}
      <div className="grid lg:grid-cols-3 grid-cols-2 md:gap-x-6 gap-x-2 gap-y-4 w-full">
        {allProducts.map((product: Product) => (
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
              productImageUrls={SAMPLE_IMAGES}
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
