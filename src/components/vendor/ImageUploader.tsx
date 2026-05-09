import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  /** Current image URL to show as preview (from existing product) */
  currentUrl?: string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUploader = ({ currentUrl, onChange, disabled }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const displayUrl = preview ?? currentUrl ?? null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {displayUrl ? (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
          <img src={displayUrl} alt="Product preview" className="w-full h-full object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`w-40 h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground transition
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary hover:text-primary"}`}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="w-7 h-7" />
              <span className="text-xs text-center px-2">Click or drag image here</span>
            </>
          )}
        </div>
      )}

      {!disabled && !displayUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="w-3.5 h-3.5 mr-1.5" />
          Upload image
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};

export default ImageUploader;
