"use client";
import { ProductCard } from "@/app/(routes)/_components/product-card";
import { MotionDiv } from "@/components/motion-div";
import { Product } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { getProducts } from "../api/getProducts";
import { PAGE_SIZE } from "../../../../const";

interface ProductsContainerProps {
  categoryId: string;
  categoryName: string;
}

export const ProductsContainer = ({ categoryId }: ProductsContainerProps) => {
  const searchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Infinite Query to fetch products
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
        categoryId: categoryId,
      }),
    initialPageParam: 0, // Start with the first page
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.products).length;
      return totalFetched < lastPage.count ? allPages.length : undefined;
    },
  });

  // Intersection observer to trigger loading more data
  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isError) {
    return (
      <div className="flex items-center justify-center flex-col text-muted-foreground gap-2">
        <ExclamationTriangleIcon className="size-4" />
        <span className="text-sm">Error</span>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 md:gap-x-6 gap-x-2 gap-y-4 w-full">
        {allProducts.map((product: Product) => (
          <MotionDiv
            key={product.id}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <ProductCard
              id={product.id}
              model={product.model}
              brand={product.brand}
              productImageUrls={[
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/32c4e533-1f15-472c-bb50-28570ce5e766/ZM+VAPOR+16+ELITE+FG.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5c191f19-9304-41b5-9a6e-aa31a18c4dcc/ZM+VAPOR+16+ELITE+FG.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fa829b33-2547-4479-9e85-43f14e2ed593/ZM+VAPOR+16+ELITE+FG.png",
              ]}
              price={product.price}
            />
          </MotionDiv>
        ))}
      </div>
      {isLoading && (
      <div className="grid lg:grid-cols-3 grid-cols-2 md:gap-x-6 gap-x-2 gap-y-4 w-full">
          {[...Array(PAGE_SIZE)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}
      {/* Loader element for triggering the Intersection Observer */}
      <div ref={loaderRef} className="h-20" />
    </>
  );
};
