import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImagePreviewsProps {
  imageUrls: string[];
  removeImage: (index: number) => void;
}

// Animation variants for image previews
const previewVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

export const ImagePreviews = ({ imageUrls, removeImage }: ImagePreviewsProps) => {
  return (
    <div className="mt-4">
      <Label className="block mb-4">Image Previews</Label>
      <AnimatePresence mode="wait">
        {imageUrls.length === 0 && (
          <motion.div
            key="no-images"
            className="text-xs text-muted-foreground flex items-center justify-center w-full min-h-[200px] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No images uploaded yet.
          </motion.div>
        )}
        {imageUrls.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 min-h-[200px]">
          {imageUrls.map((url, index) => (
            <motion.div
              key={`${url}-${index}`} // Unique key combining url and index
              variants={previewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={previewVariants.transition}
              className="relative group max-h-[200px]"
            >
              <div className="aspect-square overflow-hidden rounded-lg max-h-[200px]">
                <Image
                  priority={true}
                  src={url}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover max-h-[200px]"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove image ${index + 1}`}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </div>}
      </AnimatePresence>
    </div>
  );
};
