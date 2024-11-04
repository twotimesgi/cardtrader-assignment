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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PAGE_SIZE } from "../../../../const";

interface ProductsContainerProps {
  categoryId: string;
  categoryName: string;
}


export const ProductsContainer = ({ categoryId }: ProductsContainerProps) => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [skip, setSkip] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery<{
    products: Product[];
    count: number;
  }>({
    queryKey: ["products", categoryId, skip, searchParams.toString()],
    queryFn: () =>
      getProducts({
        searchParams: searchParams,
        skip,
        categoryId: categoryId,
      }),
  });

  useEffect(() => {
    setSkip((currentPage - 1) * PAGE_SIZE);
  }, [currentPage]);

  useEffect(() => {
    refetch();
  }, [searchParams, skip]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-2 md:gap-x-4 gap-y-4 w-full">
        {[...Array(PAGE_SIZE)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const totalPages = Math.ceil((data?.count || 0) / PAGE_SIZE);
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, currentPage + 1);

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-2  md:gap-x-4 gap-y-4 w-full">
        {data?.products.map((product: Product) => (
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
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-30" : undefined
                }
              />
            </PaginationItem>
            {startPage > 1 && (
              <PaginationItem>
                <PaginationLink href="#" onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {startPage > 2 && <PaginationEllipsis />}
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
              const pageNumber = startPage + index;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(pageNumber)}
                    aria-disabled={currentPage === pageNumber}
                    className={
                      currentPage === pageNumber
                        ? "pointer-events-none bg-primary/5"
                        : undefined
                    }
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {endPage < totalPages - 1 && <PaginationEllipsis />}
            {endPage < totalPages && (
              <PaginationItem>
                <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-30" : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};
