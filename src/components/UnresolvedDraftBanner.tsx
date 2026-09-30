import React from "react";
import { AlertTriangle, Check, Trash2 } from "lucide-react";

interface UnresolvedDraftBannerProps {
  onImport: () => void;
  onDiscard: () => void;
}

export default function UnresolvedDraftBanner({
  onImport,
  onDiscard,
}: UnresolvedDraftBannerProps) {
  return (
    <div 
      id="unresolved-draft-banner"
      className="w-full max-w-[380px] mx-auto mb-4 p-4 rounded-[20px] bg-amber-950/80 border border-amber-500/40 text-left text-white shadow-lg backdrop-blur-md animate-fade-in z-20"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 flex-1">
          <span className="font-sans text-[10px] font-black tracking-wider text-amber-300 uppercase block">
            Unresolved Browser Draft Detected
          </span>
          <p className="text-[11.5px] text-white/90 font-sans leading-relaxed">
            Prior unowned work was detected in this browser. To protect privacy, it has not been automatically assigned to your account.
          </p>
          <div className="pt-1.5 flex items-center gap-2">
            <button
              onClick={onImport}
              className="px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-sans font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Import to my account</span>
            </button>
            <button
              onClick={onDiscard}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white font-sans text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Discard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
