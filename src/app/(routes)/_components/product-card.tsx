"use client";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AddToFavorites } from "./add-to-favorites";

interface ProductCardProps {
  id: string;
  model: string;
  brand: string;
  productImageUrls: string[];
  price: number;
}

export const ProductCard = ({
  id,
  model,
  brand,
  productImageUrls,
  price,
}: ProductCardProps) => {
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [currentImage, setCurrentImage] = useState(productImageUrls[0]);

  // Framer animation variants
  const thumbnailsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const thumbnailsVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

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
    <Link
      className="block h-auto"
      href={`/products/${id}`}
      onMouseEnter={() => setShowThumbnails(true)}
      onMouseLeave={() => setShowThumbnails(false)}
    >
      <div className="w-full">
        <div className="w-full relative ">
          {/* TODO: Replace all img with Image */}
          <img
            className="object-cover object-center aspect-square w-full"
            src={currentImage}
            alt={`${brand} ${model}`}
          />
          <AddToFavorites id={id} />
        </div>

        <div className="py-2">
              <motion.div
              key="details"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={detailsVariants}
               >
                <div className="flex justify-between gap-[20px]">
                  <div className="md:text-base font-semibold line-clamp-1 xl:text-lg text-xs">
                    {model}
                  </div>
                  <span className="md:text-base font-light lg:text-lg text-xs">
                    {formatPrice(price)}
                  </span>
                </div>
                <div className="md:text-sm text-muted-foreground line-clamp-1 xl:text-base text-xs">{brand}</div>
              </motion.div>
        </div>
      </div>
    </Link>
  );
};
