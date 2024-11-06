"use client"
import { twMerge } from 'tailwind-merge'

import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
    onChange,
    endpoint
} : FileUploadProps) => {
    return <UploadDropzone 
    endpoint={endpoint} 
    appearance={{
        button:
          "ut-ready:bg-foreground ut-uploading:cursor-not-allowed bg-foreground text-sm  font-medium after:bg-orange-400 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2",
        container: "w-full rounded-none",
      }}    
    onClientUploadComplete={
        (res) => {
            onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
            toast.error(`${error?.message || "Something went wrong. Try again"}.`)
        }}
        />
}