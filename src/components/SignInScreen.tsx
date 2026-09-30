import React from "react";
import GemsAndPearls from "./GemsAndPearls";
import { Sparkles, Shield, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

interface SignInScreenProps {
  onSignIn: () => Promise<void>;
  isLoading: boolean;
  errorMessage?: string;
  onClearError?: () => void;
}

export default function SignInScreen({
  onSignIn,
  isLoading,
  errorMessage,
  onClearError,
}: SignInScreenProps) {
  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-center items-center transition-all duration-700 select-none overflow-x-hidden p-6"
      style={{
        background: "linear-gradient(135deg, #f0c2cd 0%, #dfa0ab 100%)",
      }}
    >
      <GemsAndPearls screen="home" />

      {/* Main Card Container */}
      <div className="w-full max-w-[420px] z-10 flex flex-col items-center relative animate-fade-in">
        {/* Soft dark radial backdrop */}
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-[160%] h-[420px] pointer-events-none rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(15, 10, 12, 0.52) 0%, rgba(15, 10, 12, 0.25) 50%, rgba(0, 0, 0, 0) 85%)",
          }}
        />

        {/* Top tracked eyebrow */}
        <div className="z-10 flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4fa89a] animate-pulse" />
          <span 
            className="font-sans text-[11px] font-extrabold tracking-[0.28em] text-white uppercase filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{ textShadow: "0 1.5px 3.5px rgba(0,0,0,0.6)" }}
          >
            world within method recognition-engine<sup className="text-[9px] ml-0.5 font-bold text-[#4fa89a]">™</sup>
          </span>
        </div>

        {/* Main Title */}
        <h1 
          className="font-serif text-[38px] sm:text-[42px] leading-[1.1] font-normal text-white tracking-wide text-center select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] z-10"
          style={{ textShadow: "0 2.5px 12px rgba(0,0,0,0.8)" }}
        >
          Visual Direction Generator
        </h1>

        {/* Card Box with Required Text */}
        <div 
          className="mt-8 w-full p-7 rounded-[28px] bg-black/65 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-[10px] text-center z-10 relative overflow-hidden"
          style={{
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.15), 0 12px 40px rgba(0,0,0,0.4)"
          }}
        >
          {/* Accent top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#caa28f]/20 via-[#4fa89a] to-[#caa28f]/20" />

          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#4fa89a]/15 border border-[#4fa89a]/40 flex items-center justify-center text-[#4fa89a]">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-[21px] text-white font-medium mb-3">
            Private Creative Workspace
          </h2>

          {/* User Required Exact Text:
              "Sign in with your Google email to save your work and pick up where you left off." */}
          <p className="font-serif italic text-[15px] leading-relaxed text-[#f4d1dc] mb-7 px-1">
            “Sign in with your Google email to save your work and pick up where you left off.”
          </p>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-[14px] bg-red-950/70 border border-red-500/40 text-red-200 text-left text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Sign-in issue:</span>
                <span>{errorMessage}</span>
                {onClearError && (
                  <button 
                    onClick={onClearError}
                    className="block text-[10px] font-sans font-bold text-red-300 underline mt-1 cursor-pointer"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}

          {/* "Continue with Google" button */}
          <button
            id="continue-with-google-btn"
            onClick={onSignIn}
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-full font-sans font-extrabold text-[12px] tracking-[0.16em] uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg
              ${
                isLoading 
                  ? "bg-white/40 text-neutral-800 cursor-wait opacity-80" 
                  : "bg-white hover:bg-[#faf7f5] text-neutral-900 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(255,255,255,0.25)]"
              }
            `}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-neutral-800" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                {/* Clean SVG Google Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.27 6.58l4.01 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Privacy badge note */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-white/60 text-[11px] font-sans">
            <Shield className="w-3.5 h-3.5 text-[#4fa89a]" />
            <span>Private, encrypted account-based database</span>
          </div>
        </div>

        {/* Feature summary beneath */}
        <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-[380px] text-center text-[10.5px] font-sans font-bold text-white/85">
          <div className="p-2.5 rounded-[16px] bg-black/40 border border-white/10 backdrop-blur-sm">
            <span>✨ Persistent Cloud Saves</span>
          </div>
          <div className="p-2.5 rounded-[16px] bg-black/40 border border-white/10 backdrop-blur-sm">
            <span>🔒 Isolated Private Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
