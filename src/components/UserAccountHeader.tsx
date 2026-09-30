import React from "react";
import { User } from "firebase/auth";
import { Check, RefreshCw, AlertTriangle, LogOut, Bookmark, BookOpen, ShieldCheck } from "lucide-react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UserAccountHeaderProps {
  user: User;
  saveStatus: SaveStatus;
  saveErrorMessage?: string;
  onRetrySave: () => void;
  onSignOut: () => void;
  onOpenLibrary: () => void;
  savedCount: number;
}

export default function UserAccountHeader({
  user,
  saveStatus,
  saveErrorMessage,
  onRetrySave,
  onSignOut,
  onOpenLibrary,
  savedCount,
}: UserAccountHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 py-2 bg-black/60 backdrop-blur-[12px] border-b border-white/10 shadow-md">
      <div className="max-w-[1000px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: User Account Info */}
        <div className="flex items-center gap-2 min-w-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || user.email || "Account"}
              className="w-7 h-7 rounded-full border border-white/30 object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#4fa89a]/30 border border-[#4fa89a]/50 text-white font-sans text-xs font-bold flex items-center justify-center shrink-0">
              {(user.email || "U").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <span className="text-[11.5px] font-sans font-bold text-white truncate max-w-[150px] sm:max-w-[240px]">
              {user.email}
            </span>
            <span className="text-[9px] font-sans text-[#4fa89a] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Private Google Workspace</span>
            </span>
          </div>
        </div>

        {/* Center: Real-time Save Status Indicator */}
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <div 
              id="save-status-saving"
              className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[10px] font-sans font-bold flex items-center gap-1.5 animate-pulse"
            >
              <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />
              <span>Saving...</span>
            </div>
          )}

          {saveStatus === "saved" && (
            <div 
              id="save-status-saved"
              className="px-2.5 py-1 rounded-full bg-[#4fa89a]/20 border border-[#4fa89a]/40 text-[#4fa89a] text-[10px] font-sans font-bold flex items-center gap-1.5"
            >
              <Check className="w-3 h-3 text-[#4fa89a]" />
              <span>Saved</span>
            </div>
          )}

          {saveStatus === "error" && (
            <div 
              id="save-status-error"
              className="px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-500/50 text-red-200 text-[10px] font-sans flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
              <span className="font-semibold">Save failed</span>
              <button
                onClick={onRetrySave}
                className="underline text-red-200 hover:text-white font-bold ml-1 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Right: Library & Sign-Out Controls */}
        <div className="flex items-center gap-2">
          <button
            id="open-library-btn"
            onClick={onOpenLibrary}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[10.5px] font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="View saved creations in your private library"
          >
            <BookOpen className="w-3 h-3 text-[#caa28f]" />
            <span className="hidden sm:inline">Library</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-mono">
              {savedCount}
            </span>
          </button>

          <button
            id="sign-out-btn"
            onClick={onSignOut}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-red-950/30 border border-white/15 hover:border-red-400/40 text-white/80 hover:text-red-300 text-[10.5px] font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Sign out of your Google account"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
}
