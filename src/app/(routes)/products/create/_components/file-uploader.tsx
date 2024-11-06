import { FileUpload } from "@/components/file-upload";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type FileUploaderProps = {
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
  form: any;
};

const FileUploader = ({ imageUrls, setImageUrls, form }: FileUploaderProps) => (
  <div className="space-y-3">
    <Label className="w-full flex justify-between">
      <span>Product Images</span>
      <span className="text-xs text-red-600">Required</span>
    </Label>
    <FileUpload
      endpoint="productImages"
      onChange={(urls) => {
        if (urls && urls.length > 0) {
          // Update image URLs with the new ones
          const newUrls = [...imageUrls, ...urls];
          setImageUrls(newUrls);
          form.setValue("images", newUrls);
          toast.success("Images uploaded successfully!");
        } else {
          toast.error("Image upload failed.");
        }
      }}
    />
  </div>
);

export default FileUploader;
