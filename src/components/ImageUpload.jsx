import { useState } from "react";
import { uploadToCloudinary } from "../utils/upload.js";
import { Input, Label } from "./ui/Input.jsx";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ImageUpload({ value, onChange, label = "Image" }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      onChange(url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="flex-1"
        />
        {isUploading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
      </div>
      {value && (
        <div className="mt-2 h-20 w-32 overflow-hidden rounded-md border border-border">
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
