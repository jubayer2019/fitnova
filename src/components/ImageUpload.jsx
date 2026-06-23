import { Input, Label } from "./ui/Input.jsx";

export default function ImageUpload({ value, onChange, label = "Image URL" }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        type="url"
        placeholder="https://example.com/image.jpg"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
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
