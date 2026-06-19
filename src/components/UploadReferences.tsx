import React, { useRef, useState } from "react";
import { Upload, X, Plus } from "lucide-react";

export interface RefImage {
  data: string; // Base64 data URL
  name: string;
  mimeType: string;
}

interface UploadReferencesProps {
  images: RefImage[];
  setImages: React.Dispatch<React.SetStateAction<RefImage[]>>;
  textDescription: string;
  setTextDescription: (value: string) => void;
}

export function UploadReferences({
  images,
  setImages,
  textDescription,
  setTextDescription,
}: UploadReferencesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList) => {
    const currentLength = images.length;
    const remainingSlots = 5 - currentLength;
    if (remainingSlots <= 0) return;

    const filesArray = Array.from(files).slice(0, remainingSlots);

    filesArray.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          setImages((prev) => {
            if (prev.length >= 5) return prev;
            return [
              ...prev,
              {
                data: e.target!.result as string,
                name: file.name,
                mimeType: file.type,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div id="references-step-panel" className="space-y-6">
      {/* Add image control */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileInputChange}
          multiple
          accept="image/*"
          className="hidden"
          disabled={images.length >= 5}
        />

        <div
          id="images-dropzone"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => {
            if (images.length < 5) {
              fileInputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-xl py-8 px-4 flex flex-col items-center justify-center transition-all duration-300 gap-3 cursor-pointer select-none
            ${
              dragActive
                ? "border-[#d8b043] bg-white/30"
                : "border-black/25 hover:border-black/50 bg-white/20"
            }
            ${images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-black">
            ADD IMAGE
          </span>

          {images.length > 0 && (
            <span className="font-sans text-[11px] text-black/85 mt-1">
              ({images.length}/5 added)
            </span>
          )}
        </div>
      </div>

      {/* Uploaded images thumbnail grid */}
      {images.length > 0 && (
        <div id="image-thumbnails" className="grid grid-cols-5 gap-2.5">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square border border-black/15 rounded-md overflow-hidden bg-black/5 group"
            >
              <img
                src={img.data}
                alt={img.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#8a3a5c] transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center justify-center text-center py-2 select-none">
        <span className="font-serif italic text-xs text-black/80">
          — or describe in words —
        </span>
      </div>

      {/* Free text box styled differently */}
      <div id="description-textarea-holder">
        <textarea
          id="references-text-desc"
          value={textDescription}
          onChange={(e) => setTextDescription(e.target.value)}
          placeholder="Describe the visuals that pull you in. Textures, scenes, feelings, moments. Anything that feels right, even if you can’t fully explain why."
          className="w-full h-32 rounded-xl p-4 bg-white/35 backdrop-blur-[4px] border border-black/20 text-black placeholder-black/55 focus:outline-none focus:border-[#d8b043] text-[15px] font-serif leading-relaxed resize-none transition-colors duration-200"
        />
      </div>
    </div>
  );
}

export default UploadReferences;
