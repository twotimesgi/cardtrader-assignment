"use client";
import { ProductCard } from "@/components/product-card";
import { MotionDiv } from "@/components/motion-div";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { SearchBar } from "./search-bar";
import { getProducts } from "../api/getProducts";

interface ProductsContainerProps {
  categoryId: string;
  categoryName: string;
}

export const ProductsContainer = ({
  categoryId,
  categoryName,
}: ProductsContainerProps) => {
  const PAGE_SIZE = 10;
  const searchParams = useSearchParams(); // Read URL search params
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    refetch();
  }, [searchParams]);

  // Fetch data with useQuery and refetch on parameter change
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", categoryId, skip, searchParams.toString()],
    queryFn: () =>
      getProducts({
        searchParams: searchParams,
        skip: skip,
        categoryId: categoryId,
      }),
  });

  if (error) {
    return (<>
      <SearchBar categoryName={categoryName} />
      <div className="flex items-center justify-center flex-col text-muted-foreground gap-2">
        <ExclamationTriangleIcon className="size-4" />
        <span className="text-sm">Error</span>
      </div>
      </>
    );
  }

  if (isLoading) {
    return (<>
      <SearchBar categoryName={categoryName} />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4 w-full">
        {[...Array(10)].map((item, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
      </>
    );
  }

  return (
    <>
      <SearchBar categoryName={categoryName} />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4 w-full">
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
    </>
  );
};
