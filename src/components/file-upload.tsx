"use client"
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import Compressor from "compressorjs";

interface FileUploadProps {
  onChange: (url?: string[]) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
  onChange,
  endpoint,
}: FileUploadProps) => {

  const compressFiles = async (files: File[]): Promise<File[]> => {
    return await Promise.all(
      files.map((file) => {
        return new Promise<File>((resolve, reject) => {
          new Compressor(file, {
            quality: 0.5,
            success(result) {
              resolve(result as File);
            },
            error(err) {
              console.error("Compression error:", err);
              reject(err);
            },
          });
        });
      })
    );
  };

  return (
    <UploadDropzone
      endpoint={endpoint}
      appearance={{
        button:
          "ut-ready:bg-foreground rounded-none ut-uploading:cursor-not-allowed bg-foreground text-sm font-medium after:bg-orange-400 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2",
        container: "w-full rounded-none",
      }}
      onClientUploadComplete={(res) => {
        const urls = res?.map((file) => file.url) || [];
        onChange(urls);
      }}
      onBeforeUploadBegin={async (files) => {
        try {
          const compressedFiles = await compressFiles(files); 
          return compressedFiles;
        } catch (error) {
          console.error("Compression failed:", error);
          toast.error("Failed to compress files. Try again.");
          return files; // Fallback to original files if compression fails
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message || "Something went wrong. Try again."}`);
      }}
    />
  );
};
