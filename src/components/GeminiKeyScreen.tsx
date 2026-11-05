import React, { useState } from "react";
import { User } from "firebase/auth";
import { KeyRound, Eye, EyeOff, ExternalLink, ShieldCheck, AlertCircle, RefreshCw, LogOut, Sparkles } from "lucide-react";
import GemsAndPearls from "./GemsAndPearls";

// Shared Firebase key that must be strictly rejected
const SHARED_FIREBASE_KEY = "AIzaSyAaWjVnHjYN2qtSInlgX6y8xXgngzzbym0";

interface GeminiKeyScreenProps {
  user: User;
  onKeyValidated: (key: string) => void;
  onSignOut: () => void;
  initialError?: string;
}

export default function GeminiKeyScreen({
  user,
  onKeyValidated,
  onSignOut,
  initialError,
}: GeminiKeyScreenProps) {
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialError || "");

  const handleValidateAndContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = keyInput.trim();

    if (!trimmed) {
      setErrorMessage("Please enter your Gemini API key to continue.");
      return;
    }

    // Explicit rejection of shared Firebase configuration key
    if (trimmed === SHARED_FIREBASE_KEY) {
      setErrorMessage(
        "This is the shared Firebase project key, not your personal Gemini API key. Please generate a Gemini key at https://aistudio.google.com/apikey."
      );
      return;
    }

    if (!trimmed.startsWith("AIzaSy")) {
      setErrorMessage("Gemini API keys typically start with 'AIzaSy'. Please verify your key.");
      return;
    }

    setIsValidating(true);
    setErrorMessage("");

    try {
      // Obtain fresh Firebase ID Token for session verification
      const idToken = await user.getIdToken(true);

      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
          "x-gemini-api-key": trimmed,
        },
        body: JSON.stringify({
          geminiKey: trimmed,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorText = data?.error || `Key validation failed (Status ${response.status}).`;
        setErrorMessage(errorText);
        setIsValidating(false);
        return;
      }

      // Successful live validation! Pass verified key to parent
      onKeyValidated(trimmed);
    } catch (err: any) {
      console.error("Key validation error:", err);
      setErrorMessage(
        err.message || "Unable to validate Gemini key with the server. Please check your network and try again."
      );
      setIsValidating(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-center items-center select-none overflow-x-hidden p-4 sm:p-6"
      style={{
        background: "linear-gradient(135deg, #f0c2cd 0%, #dfa0ab 100%)",
      }}
    >
      {/* Decorative Fixed Gems & Pearls */}
      <GemsAndPearls screen="home" />

      {/* Main Mandatory Key Container */}
      <div className="w-full max-w-[430px] z-10 flex flex-col items-center text-center animate-fade-in relative">
        
        {/* Soft radial backdrop behind form */}
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[140%] h-[380px] pointer-events-none rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(15, 10, 12, 0.45) 0%, rgba(15, 10, 12, 0.15) 60%, rgba(0, 0, 0, 0) 85%)",
          }}
        />

        {/* Eyebrow */}
        <span 
          className="font-sans text-[10.5px] font-extrabold tracking-[0.26em] text-white uppercase select-none z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          world within method recognition-engine<sup className="text-[9px] ml-0.5 font-bold text-[#4fa89a]">™</sup>
        </span>

        {/* Signed In Account Pill */}
        <div className="mt-3.5 mb-2 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 text-white/90 text-xs backdrop-blur-[6px] shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#4fa89a] animate-pulse" />
          <span className="font-sans text-[11px] font-medium truncate max-w-[200px]">
            {user.email}
          </span>
          <span className="text-white/40">•</span>
          <span className="font-sans text-[10px] text-[#caa28f] uppercase tracking-wider font-bold">
            Step 2 of 2
          </span>
        </div>

        {/* Card */}
        <div className="w-full mt-4 p-6 sm:p-7 rounded-[28px] bg-black/75 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-[14px] text-left relative overflow-hidden z-20">
          
          {/* Header Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#caa28f]/30 via-[#4fa89a] to-[#caa28f]/30" />

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4fa89a]/20 border border-[#4fa89a]/40 flex items-center justify-center text-[#4fa89a] shadow-[0_0_12px_rgba(79,168,154,0.3)]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl text-white font-medium drop-shadow-sm leading-tight">
                Gemini Key Required
              </h1>
              <p className="font-sans text-[11px] text-white/70 font-medium">
                Mandatory step to unlock AI synthesis & generation
              </p>
            </div>
          </div>

          <p className="font-serif italic text-[13px] text-white/90 leading-relaxed mb-4">
            To generate visual direction search phrases, emoji signatures, and custom color palettes, provide your own Gemini API key.
          </p>

          {/* Error Banner */}
          {errorMessage && (
            <div 
              id="gemini-key-error-banner"
              className="mb-4 p-3.5 rounded-[16px] bg-red-950/80 border border-red-500/60 text-red-100 text-xs flex items-start gap-2.5 animate-shake shadow-inner"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-red-200 block text-[11px] uppercase tracking-wider">
                  Validation Error
                </span>
                <p className="leading-snug text-white/95">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleValidateAndContinue} className="space-y-4">
            <div>
              <label 
                htmlFor="gemini-api-key-input"
                className="block font-sans text-[11px] font-bold text-neutral-200 uppercase tracking-wider mb-1.5"
              >
                Your Gemini API Key
              </label>

              <div className="relative">
                <input
                  id="gemini-api-key-input"
                  type={showKey ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="AIzaSy..."
                  autoComplete="off"
                  spellCheck="false"
                  disabled={isValidating}
                  className="w-full py-2.5 pl-3.5 pr-11 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/25 focus:border-[#4fa89a] text-white font-mono text-sm placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-[#4fa89a]/50 transition-all"
                />

                <button
                  type="button"
                  id="toggle-key-visibility"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
                  title={showKey ? "Hide key" : "Show key"}
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* AI Studio Key Link */}
            <div className="flex items-center justify-between text-[11.5px] pt-0.5">
              <span className="text-white/60 font-sans">Need a Gemini key?</span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#4fa89a] hover:text-[#7fd4c7] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
              >
                <span>Get a key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Usage & Privacy Notice */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 text-[#caa28f] font-sans font-bold text-[10px] tracking-wider uppercase">
                <ShieldCheck className="w-3 h-3" />
                <span>Usage & Account Isolation</span>
              </div>
              <p>
                • Your key provides your own Gemini usage allowance and any applicable paid usage under your own Google project.
              </p>
              <p>
                • No unlimited free usage is promised. We never fall back to shared or server credentials.
              </p>
              <p>
                • Your key stays in active session memory, isolated strictly to your account, and is cleared completely on sign out.
              </p>
            </div>

            {/* Primary Action: Validate & Continue */}
            <button
              type="submit"
              id="validate-gemini-key-btn"
              disabled={isValidating || !keyInput.trim()}
              className="w-full py-3 px-4 rounded-full font-sans font-black text-xs tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(79,168,154,0.35)] flex items-center justify-center gap-2 border-0
                disabled:opacity-40 disabled:cursor-not-allowed
                bg-gradient-to-r from-[#4fa89a] to-[#3a9d92] hover:brightness-110 active:scale-[0.99] text-black"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Validating Key with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Validate key and continue</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Sign-out action */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-white/60">
              Not your account?
            </span>
            <button
              type="button"
              id="key-screen-sign-out-btn"
              onClick={onSignOut}
              disabled={isValidating}
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-red-300 text-xs font-semibold transition-colors cursor-pointer bg-transparent border-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
