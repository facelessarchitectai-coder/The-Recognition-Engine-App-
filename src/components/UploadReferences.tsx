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
  activeMode: "visual" | "signature" | "fingerprints" | "color";
}

export function UploadReferences({
  images,
  setImages,
  textDescription,
  setTextDescription,
  activeMode,
}: UploadReferencesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const isWithImages = activeMode === "visual" || activeMode === "signature";

  const getPlaceholder = () => {
    switch (activeMode) {
      case "color":
        return `Colors I will use are these -\n* Deep charcoal or ink black for structural text\n* Soft warm linen / cream for layouts\n\nColors I will not use are these-\n* High-saturation neon purple\n* Artificial sterile cold blues`;
      case "fingerprints":
        return `🐦🔥 ⭕️ 🪞 ❤️🔥\n\nor whatever you naturally type.`;
      case "visual":
        return `* mirrors\n* clocks\n* architecture\n* portals\n* flowers\n* glass\n* technology`;
      case "signature":
        return `* circles\n* maps\n* systems\n* pink\n* phoenix\n* worldbuilding`;
      default:
        return "Type anything you want...";
    }
  };

  const getFocusColorClass = () => {
    switch (activeMode) {
      case "visual":
        return "focus:border-[#3a9d92]";
      case "signature":
        return "focus:border-[#8a3a5c]";
      case "fingerprints":
        return "focus:border-[#F3A9C8]";
      case "color":
        return "focus:border-[#F4CCD8]";
      default:
        return "focus:border-[#d8b043]";
    }
  };

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

  const getEmojiCount = () => {
    try {
      const regex = /\p{Extended_Pictographic}/gu;
      return (textDescription.match(regex) || []).length;
    } catch (e) {
      const fallbackRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{27BF}]/gu;
      return (textDescription.match(fallbackRegex) || []).length;
    }
  };

  return (
    <div id="references-step-panel" className="space-y-6">
      {isWithImages && (
        <>
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
            <span className="font-sans font-black text-xs text-black">
              — AND/OR DESCRIBE IN WORDS —
            </span>
          </div>
        </>
      )}

      {/* Free text box styled differently */}
      <div id="description-textarea-holder" className="space-y-2">
        {activeMode === "fingerprints" && (
          <div className="flex items-center justify-between font-sans text-xs font-black tracking-wider text-black select-none pb-1">
            <span>PRIMARY EMOJI SET (4–8)</span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${getEmojiCount() >= 4 && getEmojiCount() <= 8 ? "bg-black text-white" : "bg-red-600 text-white"}`}>
              {getEmojiCount() === 0 ? "Empty" : `${getEmojiCount()} Emojis`}
            </span>
          </div>
        )}
        <textarea
          id="references-text-desc"
          value={textDescription}
          onChange={(e) => setTextDescription(e.target.value)}
          placeholder={getPlaceholder()}
          className={`w-full h-44 rounded-xl p-4 bg-white/35 backdrop-blur-[4px] border-2 border-black text-black placeholder-black/60 focus:outline-none ${getFocusColorClass()} text-[15px] font-sans font-black leading-relaxed resize-none transition-colors duration-200`}
        />
        {activeMode === "visual" && (
          <div className="flex flex-col gap-1 text-[12px] font-sans text-black select-none pt-1">
            <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-black text-xs">
              Visual Guide: <span className="bg-black text-white px-2.5 py-0.5 rounded font-black text-[10px]">Aesthetic Objects</span>
            </span>
            <span className="font-extrabold block mt-1 text-black">
              List things, colors, lighting styles, or overall moods that keep appearing in your saved images.
            </span>
          </div>
        )}
        {activeMode === "signature" && (
          <div className="flex flex-col gap-1 text-[12px] font-sans text-black select-none pt-1">
            <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-black text-xs">
              Signature Guide: <span className="bg-black text-white px-2.5 py-0.5 rounded font-black text-[10px]">Association Elements</span>
            </span>
            <span className="font-extrabold block mt-1 text-black">
              Identify phrases, symbols, themes or recurring ideas that evoke your style.
            </span>
          </div>
        )}
        {activeMode === "fingerprints" && (
          <div className="flex flex-col gap-1 text-[12px] font-sans text-black select-none pt-1">
            <span className="flex items-center gap-1.5 font-black uppercase tracking-wider text-black text-xs">
              Input Rule: <span className="bg-black text-white px-2.5 py-0.5 rounded font-black text-[10px]">Min 4, Max 8 Emojis</span>
            </span>
            <span className="font-extrabold block mt-1 text-black">
              Example Set: 🐦🔥 ⭕️ 🪞 ❤️🔥 🌙 🕯️
            </span>
          </div>
        )}
        {activeMode === "color" && (
          <div className="flex flex-col gap-1.5 text-[12px] font-sans text-black select-none pt-2.5 border-t-2 border-black mt-2">
            <span className="flex items-center gap-1.5 font-sans font-black uppercase tracking-wider text-black">
              ⚠️ MUST USE EXACT FORMAT: <span className="bg-black text-white px-2.5 py-0.5 rounded text-[11px] font-black">CRITICAL TEMPLATE</span>
            </span>
            <p className="leading-relaxed text-[12.5px] text-black font-extrabold">
              You must copy/paste or write your response exactly with these headers (otherwise the system will treat everything as colors you want to use):
            </p>
            <div className="p-3.5 rounded-[14px] bg-neutral-100 border-2 border-black space-y-2 text-[12px] font-mono text-black leading-relaxed font-bold">
              <div><span className="font-sans font-black text-black select-all bg-yellow-200/85 px-1">Colors I will use are these -</span> [list your chosen colors here]</div>
              <div><span className="font-sans font-black text-black select-all bg-yellow-200/85 px-1">Colors I will not use are these-</span> [list colors you absolutely avoid]</div>
            </div>
            <p className="font-sans font-black text-[11.5px] text-black leading-tight">
              Be extremely specific in both sections about what you will use in almost everything and what you will never touch.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadReferences;
