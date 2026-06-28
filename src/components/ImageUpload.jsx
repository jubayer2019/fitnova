import { useState } from "react";
import { Input, Label } from "./ui/Input.jsx";
import { uploadToImgbb } from "../utils/upload.js";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";

export default function ImageUpload({ value, onChange, label = "Image URL" }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      const url = await uploadToImgbb(file);
      onChange(url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <div className="relative flex items-center justify-center rounded-md border border-border bg-muted px-4 hover:bg-muted/80 cursor-pointer">
          {uploading ? (
            <span className="text-xs text-muted-foreground">Uploading...</span>
          ) : (
            <>
              <UploadCloud className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Upload</span>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      </div>
      {value && (
        <div className="mt-2 h-24 w-36 overflow-hidden rounded-md border border-border bg-muted">
          <img 
            src={value} 
            alt="Preview" 
            className="h-full w-full object-cover" 
            onError={(e) => { e.target.style.display = 'none'; }}
            onLoad={(e) => { e.target.style.display = 'block'; }}
          />
        </div>
      )}
    </div>
  );
}

