import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

export const ourFileRouter = {
  productImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
  // Handle Authentication
    // .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
