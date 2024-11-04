"use client";
import { ProductCard } from "@/app/(routes)/_components/product-card";
import { MotionDiv } from "@/components/motion-div";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { getProducts } from "../api/getProducts";

interface ProductsContainerProps {
  categoryId: string;
  categoryName: string;
}

export const ProductsContainer = ({ categoryId }: ProductsContainerProps) => {
  const PAGE_SIZE = 12;
  const searchParams = useSearchParams();
  const [skip, setSkip] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery<Product[]>({
    queryKey: ["products", categoryId, skip, searchParams.toString()],
    queryFn: () =>
      getProducts({
        searchParams: searchParams,
        skip,
        categoryId: categoryId,
      }),
  });

  useEffect(() => {
    refetch();
  }, [searchParams, skip, refetch]);

  const handleNextPage = () => setSkip((prevSkip) => prevSkip + PAGE_SIZE);
  const handlePrevPage = () => setSkip((prevSkip) => Math.max(0, prevSkip - PAGE_SIZE));

  if (isError) {
    return (
      <div className="flex items-center justify-center flex-col text-muted-foreground gap-2">
        <ExclamationTriangleIcon className="size-4" />
        <span className="text-sm">Error</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-6 gap-y-4 w-full">
        {[...Array(PAGE_SIZE)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-6 gap-y-4 w-full">
        {data?.map((product: Product) => (
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

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={skip === 0}
          className="btn btn-outline"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={data && data.length < PAGE_SIZE}
          className="btn btn-outline"
        >
          Next
        </button>
      </div>
    </>
  );
};
