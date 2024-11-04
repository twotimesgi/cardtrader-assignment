"use client";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContentLoader from "react-loading-skeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ProductCardProps {
  id: string;
  model: string;
  brand: string;
  productImageUrls: string[];
  price: number;
}

export const ProductCardSkeleton = () => {
  const detailsVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.2 },
      transitionEnd: { display: "none" },
    },
    visible: {
      display: "block",
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="w-full block">
      <div className="w-full">
        {/* TODO: Replace all img with Image */}
        {/* <img
            className="object-cover object-center aspect-square w-full"
            src={currentImage}
            alt={`${brand} ${model}`}
          /> */}
        <Skeleton borderRadius={0} baseColor="#f7f7f7" className={"w-full aspect-square"} />
      </div>

      <div className="py-2 min-h-[110px]">
        <motion.div
          key="details"
          initial="visible"
          animate="visible"
          exit="hidden"
          variants={detailsVariants}
        >
          <div className="flex justify-between gap-[20px]">
            <div className="text-base font-semibold line-clamp-1 xl:text-lg">
              <Skeleton borderRadius={0} baseColor="#f7f7f7" width={130} />
            </div>
            <div className="text-base font-light lg:text-lg">
              <Skeleton borderRadius={0} baseColor="#f7f7f7"  width={50} />
            </div>
          </div>
          <div className="text-sm text-muted-foreground line-clamp-1 xl:text-base">
              <Skeleton borderRadius={0} baseColor="#f7f7f7"  width={100} />
            </div>          
        </motion.div>
      </div>
    </div>
  );
};
