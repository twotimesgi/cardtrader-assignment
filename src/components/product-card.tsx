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

        <div className="py-2 min-h-[110px]">
          <AnimatePresence mode="wait" initial={false}>
            {showThumbnails && (
              <motion.div
              key="thumbnails"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={thumbnailsContainerVariants}
                className="grid grid-cols-5 gap-x-2" 
                onMouseLeave={() => setCurrentImage(productImageUrls[0])}
              >
                {productImageUrls.slice(0, 5).map((imageUrl) => (
                  <motion.div
                    className="shrink-0 aspect-square w-full]"
                    key={imageUrl}
                    variants={thumbnailsVariants}
                  >
                    {/* TODO: Replace all img with Image */}
                    <img
                      className="w-full h-full object-cover"
                      src={imageUrl}
                      onMouseEnter={() => setCurrentImage(imageUrl)}
                      alt={`${brand} ${model}`}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
            {!showThumbnails && (
              <motion.div
              key="details"
              initial="visible"
              animate="visible"
              exit="hidden"
              variants={detailsVariants}
               >
                <div className="flex justify-between gap-[20px]">
                  <div className="text-base font-semibold line-clamp-1 xl:text-lg">
                    {model}
                  </div>
                  <span className="text-base font-light lg:text-lg">
                    {formatPrice(price)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-1 xl:text-base">{brand}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Link>
  );
};
