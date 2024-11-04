"use client";

import { formatPrice } from "@/lib/format";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AddToFavorites } from "./add-to-favorites";
import { LiaImage } from "react-icons/lia";

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
  const detailsVariants = {
    hidden: { opacity: 0, display: "none", transition: { duration: 0.2 } },
    visible: { opacity: 1, display: "block", transition: { duration: 0.2 } },
  };

  return (
    <Link href={`/products/${id}`} className="block w-full h-auto">
      <div className="relative w-full">
        {/* TODO: replace with Image component fron next*/}
        {productImageUrls[0] ? (
          <Image
            src={productImageUrls[0]}
            alt={`${brand} ${model}`}
            width={400}
            height={400}
            className="object-cover object-center aspect-square w-full"
          />
        ) : (
          <div className="object-cover object-center aspect-square w-full bg-muted-foreground/10 flex items-center justify-center">
            <LiaImage size={50} className="text-muted-foreground/50" />
          </div>
        )}
        <AddToFavorites id={id} />
      </div>

      <motion.div
        key={id}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={detailsVariants}
        className="py-2"
      >
        <div className="flex justify-between">
          <h3 className="text-xs md:text-base xl:text-lg font-semibold line-clamp-1">
            {model}
          </h3>
          <span className="text-xs md:text-base lg:text-lg font-light">
            {formatPrice(price)}
          </span>
        </div>
        <p className="text-xs md:text-sm xl:text-base text-muted-foreground line-clamp-1">
          {brand}
        </p>
      </motion.div>
    </Link>
  );
};
