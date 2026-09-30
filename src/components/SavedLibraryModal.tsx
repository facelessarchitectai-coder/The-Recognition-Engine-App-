import React from "react";
import { SavedCreationItem } from "../firebase";
import { X, Sparkles, Trash2, ArrowUpRight, Clock, Palette } from "lucide-react";

interface SavedLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  creations: SavedCreationItem[];
  onLoadCreation: (item: SavedCreationItem) => void;
  onDeleteCreation: (id: string) => Promise<void>;
  isDeletingId?: string | null;
}

export default function SavedLibraryModal({
  isOpen,
  onClose,
  creations,
  onLoadCreation,
  onDeleteCreation,
  isDeletingId,
}: SavedLibraryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[500px] max-h-[85vh] rounded-[28px] bg-[#1a1215] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-white animate-scale-up"
        style={{
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.7)"
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-[#4fa89a]/20 text-[#4fa89a]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium">Your Saved Library</h3>
              <p className="text-[11px] text-white/60 font-sans">
                {creations.length} saved {creations.length === 1 ? "creation" : "creations"} in your private database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 max-h-[60vh] no-scrollbar">
          {creations.length === 0 ? (
            <div className="py-12 text-center text-white/60 space-y-2">
              <Palette className="w-10 h-10 mx-auto text-white/30" />
              <p className="font-serif italic text-sm">No saved creations yet.</p>
              <p className="text-xs text-white/50 max-w-[280px] mx-auto">
                Generate any visual direction, signature mark, emoji archive, or color world, and save it to your permanent library!
              </p>
            </div>
          ) : (
            creations.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const badgeColor = item.mode === "visual"
                ? "bg-[#3a9d92]/20 text-[#3a9d92] border-[#3a9d92]/40"
                : item.mode === "signature"
                ? "bg-[#8a3a5c]/25 text-[#f4a0be] border-[#8a3a5c]/50"
                : item.mode === "fingerprints"
                ? "bg-[#F3A9C8]/20 text-[#F3A9C8] border-[#F3A9C8]/40"
                : "bg-[#F4CCD8]/20 text-[#F4CCD8] border-[#F4CCD8]/40";

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-[20px] bg-white/5 hover:bg-white/8 border border-white/10 transition-all flex flex-col gap-2.5 relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9.5px] font-sans font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                      {item.mode === "visual" ? "Visual Direction" : item.mode === "signature" ? "Signature Mark" : item.mode === "fingerprints" ? "Emoji Archive" : "Color World"}
                    </span>
                    <span className="text-[10px] text-white/40 font-sans flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formattedDate}
                    </span>
                  </div>

                  <h4 className="font-serif text-[15px] font-medium text-white/95 line-clamp-1">
                    {item.title}
                  </h4>

                  {item.refText && (
                    <p className="text-[11.5px] text-white/60 font-sans line-clamp-2 italic">
                      "{item.refText}"
                    </p>
                  )}

                  {/* Summary Preview */}
                  {item.mode === "fingerprints" && item.generatedFingerprint?.emojis && (
                    <div className="flex items-center gap-1 text-base py-1">
                      {item.generatedFingerprint.emojis.slice(0, 6).map((em: string, i: number) => (
                        <span key={i}>{em}</span>
                      ))}
                    </div>
                  )}

                  {item.mode === "color" && item.generatedColorWorld?.palette && (
                    <div className="flex items-center gap-1.5 py-1">
                      {item.generatedColorWorld.palette.slice(0, 6).map((col: any, i: number) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  )}

                  {item.generatedPhrases && item.generatedPhrases.length > 0 && (
                    <div className="text-[11px] text-[#caa28f] font-sans">
                      {item.generatedPhrases.length} curated search phrases
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => onLoadCreation(item)}
                      className="px-3 py-1.5 rounded-full bg-[#4fa89a] hover:bg-[#3a9d92] text-black font-sans font-bold text-[10.5px] tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Load into workspace</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteCreation(item.id)}
                      disabled={isDeletingId === item.id}
                      className="p-1.5 rounded-full text-white/40 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete from library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
