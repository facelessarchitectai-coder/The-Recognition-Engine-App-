import React, { useState } from "react";
import { 
  VISUAL_DIRECTION_QUESTIONS, 
  SIGNATURE_MARK_QUESTIONS, 
  FINGERPRINTS_QUESTIONS, 
  COLOR_WORLD_QUESTIONS,
  VISUAL_DIRECTION_STEPS, 
  SIGNATURE_MARK_STEPS, 
  FINGERPRINTS_STEPS, 
  COLOR_WORLD_STEPS,
  Question 
} from "./data";
import GemsAndPearls from "./components/GemsAndPearls";
import AnswerOption from "./components/AnswerOption";
import UploadReferences, { RefImage } from "./components/UploadReferences";
import { ArrowLeft, Check, AlertTriangle, RefreshCw, Sparkles, ExternalLink } from "lucide-react";
import { generateFallbackResult, FallbackData } from "./utils/fallbackGenerator";

// Real-world high-fidelity generated jewelry photography assets
import brilliantDiamondImg from "./assets/images/brilliant_diamond_1781750876333.jpg";
import roseGemstoneImg from "./assets/images/rose_gemstone_1781750892234.jpg";
import pearlNecklaceImg from "./assets/images/pearl_necklace_1781750905009.jpg";
import globePocketWatchImg from "./assets/images/heirloom_globe_watch_1781836941406.jpg";

export function App() {
  // Mode selection state: 'visual' or 'signature' or 'fingerprints' or 'color'
  const [activeMode, setActiveMode] = useState<"visual" | "signature" | "fingerprints" | "color">("visual");

  // Router-style state: 'home' | 'quiz' | 'results' | 'error'
  const [screen, setScreen] = useState<"home" | "quiz" | "results" | "error">("home");

  // In-progress quiz state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Selected options state: key is step ID, value is array of selected options
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  // Reference materials state
  const [refImages, setRefImages] = useState<RefImage[]>([]);
  const [refText, setRefText] = useState("");

  // Results & Loading/Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [generatedPhrases, setGeneratedPhrases] = useState<string[]>([]);
  const [generatedFingerprint, setGeneratedFingerprint] = useState<{
    emojis: string[];
    explanation: string;
    analysis?: {
      repetition: string;
      themes: string;
      emotionalTone: string;
      visualConsistency: string;
      strongestCombination: string;
    } | null;
  } | null>(null);
  const [generatedColorWorld, setGeneratedColorWorld] = useState<{ palette: { name: string; hex: string; role: string }[]; moodLine: string } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedColorIndex, setCopiedColorIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isFacelessCreator, setIsFacelessCreator] = useState(false);
  const [showAdvisory, setShowAdvisory] = useState(true);
  const [fallbackData, setFallbackData] = useState<FallbackData | null>(null);
  const [fallbackErrorMessage, setFallbackErrorMessage] = useState<string>("");
  const [generatedBlueprint, setGeneratedBlueprint] = useState<{
    worldDirection: {
      type: string;
      meaning: string;
      exists: string;
      doesNotBelong: string;
      repeats: string;
      breaks: string;
    };
    environment: {
      spaces: string;
      emotionalTone: string;
      worldVsBackground: string;
    };
    visualLanguage: {
      colorBehavior: string;
      tone: string;
      energy: string;
      styling: string;
      lighting: string;
      repeatingColors: string;
      environmentType: string;
      composition: string;
      emotionalFeel: string;
      colorsThatBreak: string;
      notBelongVisual: string;
    };
  } | null>(null);

  // Mode settings
  const modeAccentColor = activeMode === "visual"
    ? "#3a9d92"
    : activeMode === "signature"
    ? "#8a3a5c"
    : activeMode === "fingerprints"
    ? "#F3A9C8"
    : "#F4CCD8"; // Soft Blush Pink
  const modeAccentBg = activeMode === "visual"
    ? "bg-[#3a9d92]"
    : activeMode === "signature"
    ? "bg-[#8a3a5c]"
    : activeMode === "fingerprints"
    ? "bg-[#F3A9C8]"
    : "bg-[#F4CCD8]";
  const modeTextLight = activeMode === "visual"
    ? "text-[#3a9d92]"
    : activeMode === "signature"
    ? "text-[#8a3a5c]"
    : activeMode === "fingerprints"
    ? "text-[#F3A9C8]"
    : "text-[#F4CCD8]";

  const getButtonBg = () => {
    return activeMode === "color"
      ? (isContinueEnabled()
          ? "linear-gradient(135deg, rgba(244, 204, 216, 0.95) 0%, rgba(234, 184, 198, 0.85) 100%)"
          : "rgba(244, 204, 216, 0.25)")
      : (isContinueEnabled()
          ? "linear-gradient(135deg, rgba(135, 70, 85, 0.85) 0%, rgba(108, 54, 66, 0.75) 100%)"
          : "rgba(108, 54, 66, 0.3)");
  };

  const getButtonShadow = () => {
    return activeMode === "color"
      ? (isContinueEnabled()
          ? "inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 4px 14px rgba(244, 204, 216, 0.15)"
          : "none")
      : (isContinueEnabled()
          ? "inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 4px 14px rgba(110, 30, 45, 0.14)"
          : "none");
  };

  // Steps configuration depending on mode (simplified to a single high-integrity open-ended input step per mode)
  const currentSteps = ["INPUT"];
  const currentQuestions: Question[] = [];

  // Start the quiz
  const handleBegin = () => {
    setSelections({});
    setRefImages([]);
    setRefText("");
    setCurrentStepIndex(0);
    setScreen("quiz");
  };

  // Helper to check if current step is References
  const isReferencesStep = true;

  // Get current active question (if during quiz and not the last step)
  const currentQuestion = undefined;

  // Toggle selection on an option
  const handleToggleOption = (option: string) => {};

  // Check if "Continue" can be clicked for the current step
  const isContinueEnabled = () => {
    if (activeMode === "fingerprints") {
      try {
        const regex = /\p{Extended_Pictographic}/gu;
        const count = (refText.match(regex) || []).length;
        return count >= 4 && count <= 8;
      } catch (e) {
        const fallbackRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{27BF}]/gu;
        const count = (refText.match(fallbackRegex) || []).length;
        return count >= 4 && count <= 8;
      }
    }
    return refText.trim().length > 0 || refImages.length > 0;
  };

  // Process Next Step / Generate Results
  const handleNext = async () => {
    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Trigger API Generation
      await generateResults();
    }
  };

  // Process Prev Step
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      setScreen("home");
    }
  };

  // call local Node server API
  const generateResults = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setFallbackErrorMessage("");

    try {
      // Compile answer objects from the open-ended typing to handle on backend
      const answersPayload = [
        {
          questionStep: "INPUT",
          questionTitle: activeMode === "visual" 
            ? "Images I Keep Saving"
            : activeMode === "signature"
            ? "Things People Associate With Me"
            : activeMode === "fingerprints"
            ? "Emojis I Naturally Use"
            : "Colors I Keep Returning To",
          selections: [refText],
        }
      ];

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: activeMode,
          answers: answersPayload,
          referencesText: refText,
          refImages: (activeMode === "visual" || activeMode === "signature") 
            ? refImages.map((img) => ({
                data: img.data,
                mimeType: img.mimeType,
              }))
            : [],
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFallbackData(null);
        setFallbackErrorMessage("");
        if (activeMode === "fingerprints") {
          setGeneratedFingerprint({
            emojis: data.emojis || [],
            explanation: data.explanation || "",
            analysis: data.analysis || null,
          });
          setGeneratedBlueprint(null);
          setScreen("results");
        } else if (activeMode === "color") {
          setGeneratedColorWorld({
            palette: data.palette || [],
            moodLine: data.moodLine || "",
          });
          setGeneratedBlueprint(null);
          setScreen("results");
        } else {
          setGeneratedPhrases(data.phrases);
          setGeneratedBlueprint(data.blueprint || null);
          setScreen("results");
        }
      } else {
        // High demand, model error or timeout, generate local fallback
        setFallbackErrorMessage(data.error || "The AI service is currently busy. Please try again in a few moments.");
        const fallback = generateFallbackResult(activeMode, selections);
        setFallbackData(fallback);
        if (activeMode === "fingerprints") {
          setGeneratedFingerprint({
            emojis: fallback.emojis || [],
            explanation: fallback.explanation || "",
          });
          setGeneratedBlueprint(null);
        } else if (activeMode === "color") {
          setGeneratedColorWorld({
            palette: (fallback.palette as any) || [],
            moodLine: fallback.moodLine || "",
          });
          setGeneratedBlueprint(null);
        } else {
          setGeneratedPhrases(fallback.phrases);
          setGeneratedBlueprint((fallback.blueprint as any) || null);
        }
        setScreen("results");
      }
    } catch (err: any) {
      // Fallback on request/network error as well
      setFallbackErrorMessage("The AI service is currently busy. Please try again in a few moments.");
      const fallback = generateFallbackResult(activeMode, selections);
      setFallbackData(fallback);
      if (activeMode === "fingerprints") {
        setGeneratedFingerprint({
          emojis: fallback.emojis || [],
          explanation: fallback.explanation || "",
        });
        setGeneratedBlueprint(null);
      } else if (activeMode === "color") {
        setGeneratedColorWorld({
          palette: (fallback.palette as any) || [],
          moodLine: fallback.moodLine || "",
        });
        setGeneratedBlueprint(null);
      } else {
        setGeneratedPhrases(fallback.phrases);
        setGeneratedBlueprint((fallback.blueprint as any) || null);
      }
      setScreen("results");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset & Start Over
  const handleStartOver = () => {
    setSelections({});
    setRefImages([]);
    setRefText("");
    setCurrentStepIndex(0);
    setGeneratedFingerprint(null);
    setGeneratedColorWorld(null);
    setGeneratedBlueprint(null);
    setCopiedFingerprint(false);
    setFallbackData(null);
    setFallbackErrorMessage("");
    setScreen("home");
  };

  // Copy color hex to Clipboard
  const handleCopyColorHex = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedColorIndex(index);
    setTimeout(() => {
      setCopiedColorIndex(null);
    }, 1500);
  };

  // Copy unique copyable pill to Clipboard
  const handleCopySingle = (phrase: string, index: number) => {
    navigator.clipboard.writeText(phrase);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  // Copy all 12 phrases
  const handleCopyAll = () => {
    const allPhrases = generatedPhrases.join("\n");
    navigator.clipboard.writeText(allPhrases);
    setCopiedAll(true);
    setTimeout(() => {
      setCopiedAll(false);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-start items-center transition-all duration-700 select-none overflow-x-hidden pb-12 pt-8 px-4"
      style={{
        background: "linear-gradient(135deg, #f0c2cd 0%, #dfa0ab 100%)",
      }}
    >
      {/* Decorative Fixed Gems & Pearls Background Elements */}
      <GemsAndPearls screen={screen} />

      {/* Main Container: Mobile-first container boundary */}
      <main id="app-window-boundary" className="w-full max-w-[400px] z-10 flex flex-col gap-6 relative mt-16 sm:mt-24 px-6">
        
        {/* =======================================================
            STATE A: HOME SCREEN
           ======================================================= */}
        {screen === "home" && (
          <div className="flex flex-col items-center text-center select-none w-full animate-fade-in relative px-1 py-1">
            {/* A very soft dark radial gradient behind the headline area only to enhance contrast of floating text */}
            <div 
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-[160%] h-[420px] pointer-events-none rounded-full"
              style={{
                background: "radial-gradient(ellipse at center, rgba(15, 10, 12, 0.48) 0%, rgba(15, 10, 12, 0.22) 50%, rgba(0, 0, 0, 0) 85%)",
              }}
            />

            {/* Top Empty Space to lower all contents */}
            <div className="h-4 w-full z-10" />

            {/* Advisory setup warning banner */}
            {showAdvisory && (
              <div 
                id="advisory-banner"
                className="w-full max-w-[380px] mb-6 p-5 rounded-[22px] bg-black/75 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-[8px] text-left animate-fade-in z-25 relative overflow-hidden"
              >
                {/* Accent glow line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#caa28f]/20 via-[#4fa89a]/75 to-[#caa28f]/20" />
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-full bg-[#4fa89a]/25 border border-[#4fa89a]/50 text-[#4fa89a]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-2.5">
                    <span className="font-sans text-[9px] font-black tracking-widest text-[#caa28f] uppercase block">
                      Identity Pre-requisite Note
                    </span>
                    <p className="font-serif italic text-[12.5px] leading-relaxed text-white/95">
                      "For best results, complete the <span className="font-sans not-italic font-extrabold text-[#4fa89a]">World Within Method™</span> and <span className="font-sans not-italic font-extrabold text-[#4fa89a]">World Within App™</span> before using the Recognition Engine™. This tool works best when your identity foundation is already defined."
                    </p>
                    <p className="font-sans text-[10.5px] text-neutral-300 font-bold leading-normal">
                      We want you to explore freely! Dismiss this note below to access and experiment with all four generation engines.
                    </p>
                    
                    <div className="pt-1.5 flex items-center gap-3">
                      <button
                        id="dismiss-advisory-got-it"
                        onClick={() => setShowAdvisory(false)}
                        className="px-4 py-1.5 rounded-full bg-[#4fa89a] hover:bg-[#3a9d92] text-black font-sans font-black text-[9.5px] tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(79,168,154,0.3)]"
                      >
                        Got it
                      </button>
                      <button
                        id="dismiss-advisory-continue"
                        onClick={() => setShowAdvisory(false)}
                        className="px-3 py-1 text-white/60 hover:text-white font-sans text-[9px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer underline underline-offset-2 bg-transparent border-0"
                      >
                        Continue anyway
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Centered Tracked eyebrow label */}
            <span 
              className="font-sans text-[11px] font-extrabold tracking-[0.28em] text-white uppercase select-none z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ textShadow: "0 1.5px 3.5px rgba(0,0,0,0.6)" }}
            >
              world within method recognition-engine<sup className="text-[9px] ml-0.5 font-bold" style={{ color: modeAccentColor }}>™</sup>
            </span>

            {/* Faceless Creator Toggle Button */}
            <div className="mt-5 mb-1 z-20">
              <button
                id="faceless-creator-toggle"
                onClick={() => setIsFacelessCreator(!isFacelessCreator)}
                className={`px-5 py-2 rounded-full border text-[10.5px] tracking-widest transition-all duration-350 font-sans font-black uppercase cursor-pointer select-none bg-transparent
                  ${
                    isFacelessCreator
                      ? "border-[#4fa89a] text-[#4fa89a] bg-[#4fa89a]/10 shadow-[0_0_15px_rgba(79,168,154,0.45)]"
                      : "border-white/40 text-white/95 hover:border-white/70 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {isFacelessCreator ? "✨ Faceless Creator (Active)" : "I don't have a character (Faceless Creator)"}
              </button>
            </div>

            {/* 2. Centered side-by-side Toggle Pill Tabs */}
            <div className="flex flex-wrap gap-2 w-full max-w-[380px] justify-center mt-6 z-10">
              <button
                id="tab-visual"
                onClick={() => setActiveMode("visual")}
                className={`flex-1 py-1.5 px-2 rounded-full text-[10px] tracking-wider transition-all duration-300 font-sans font-bold uppercase select-none border cursor-pointer text-center
                  ${
                    activeMode === "visual"
                      ? "bg-[#3a9d92] text-white border-transparent"
                      : "border-white/20 bg-black/35 backdrop-blur-[4px] text-white/85 hover:border-white/40 hover:bg-black/55 hover:text-white"
                  }
                  ${
                    isFacelessCreator
                      ? "border-[#4fa89a]/70 shadow-[0_0_12px_rgba(79,168,154,0.5)]"
                      : ""
                  }
                `}
              >
                Visual Direction
              </button>
              <button
                id="tab-signature"
                onClick={() => setActiveMode("signature")}
                className={`flex-1 py-1.5 px-2 rounded-full text-[10px] tracking-wider transition-all duration-300 font-sans font-bold uppercase select-none border cursor-pointer text-center
                  ${
                    activeMode === "signature"
                      ? "bg-[#8a3a5c] text-white border-transparent"
                      : "border-white/20 bg-black/35 backdrop-blur-[4px] text-white/85 hover:border-white/40 hover:bg-black/55 hover:text-white"
                  }
                  ${
                    isFacelessCreator
                      ? "border-[#4fa89a]/70 shadow-[0_0_12px_rgba(79,168,154,0.5)]"
                      : ""
                  }
                `}
              >
                Signature Mark
              </button>
              <button
                id="tab-fingerprints"
                onClick={() => setActiveMode("fingerprints")}
                className={`flex-1 py-1.5 px-2 rounded-full text-[10px] tracking-wider transition-all duration-300 font-sans font-bold uppercase select-none border cursor-pointer text-center
                  ${
                    activeMode === "fingerprints"
                      ? "bg-[#F3A9C8] text-neutral-950 border-transparent"
                      : "border-white/20 bg-black/35 backdrop-blur-[4px] text-white/85 hover:border-white/40 hover:bg-black/55 hover:text-white"
                  }
                  ${
                    isFacelessCreator
                      ? "border-[#4fa89a]/70 shadow-[0_0_12px_rgba(79,168,154,0.5)]"
                      : ""
                  }
                `}
              >
                Emoji Archive
              </button>
              <button
                id="tab-color-world"
                onClick={() => setActiveMode("color")}
                className={`flex-1 py-1.5 px-2 rounded-full text-[10px] tracking-wider transition-all duration-300 font-sans font-bold uppercase select-none border cursor-pointer text-center
                  ${
                    activeMode === "color"
                      ? "bg-[#F4CCD8] text-[#1F2421] border-transparent"
                      : "border-white/20 bg-black/35 backdrop-blur-[4px] text-white/85 hover:border-white/40 hover:bg-black/55 hover:text-white"
                  }
                  ${
                    isFacelessCreator
                      ? "border-[#4fa89a]/70 shadow-[0_0_12px_rgba(79,168,154,0.5)]"
                      : ""
                  }
                `}
              >
                Color World
              </button>
            </div>

            {/* Faceless Creator Alignment Map Card */}
            {isFacelessCreator && (
              <div 
                className="mt-4 mx-auto w-full max-w-[380px] p-4 rounded-[20px] bg-black/60 border border-[#4fa89a]/45 shadow-[0_0_15px_rgba(79,168,154,0.3)] backdrop-blur-[6px] text-left text-white space-y-2 animate-fade-in z-10"
              >
                <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4fa89a] animate-pulse" />
                  <span className="font-sans text-[10px] font-black tracking-widest text-[#4fa89a] uppercase">
                    Faceless Creator Alignment Map
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] font-medium text-white/90">
                  <p className="flex items-start gap-1.5">
                    <span className="text-[#4fa89a] font-bold">✓</span>
                    <span><strong className="text-white">Visual Direction:</strong> Fully applies. Defines architectural spaces, horizons, and photography style.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-[#4fa89a] font-bold">⚬</span>
                    <span><strong className="text-white">Signature Mark:</strong> Applies but reframed to visual symbols, overlays, and stickers (no characters).</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-[#4fa89a] font-bold">✓</span>
                    <span><strong className="text-white">Emoji Archive:</strong> Fully applies. Forms a cohesive symbolic fingerprint for text captions.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-[#4fa89a] font-bold">✓</span>
                    <span><strong className="text-white">Color World:</strong> Fully applies. Establishes the core adaptive palette and color behavior.</span>
                  </p>
                </div>
              </div>
            )}
 
             {/* 3. Centered Large Elegant Serif Title */}
             <div className="mt-14 w-full z-10">
               <h1 
                 id="mode-showcase-title" 
                 className="font-serif text-[42px] leading-[1.1] font-normal text-white tracking-wide select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)]"
                 style={{ textShadow: "0 2.5px 12px rgba(0,0,0,0.8)" }}
               >
                 {activeMode === "visual" ? "Visual Direction" : (activeMode === "signature" ? "Signature Mark" : (activeMode === "fingerprints" ? "Emoji Fingerprint" : "Color World"))}
               </h1>
               {/* Subtitle placed on its own darker overlay layer */}
               <div 
                 className="mt-6 mx-auto max-w-[340px] py-4 px-6 rounded-[24px] bg-black/65 border border-white/10 shadow-lg backdrop-blur-[6px] relative overflow-hidden"
                 style={{
                   boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08), 0 4px 18px rgba(0,0,0,0.35)"
                 }}
               >
                 <p 
                   id="mode-showcase-tagline" 
                   className="font-serif italic text-[15.5px] font-semibold text-white select-none leading-relaxed text-center"
                   style={{ 
                     opacity: 1.0,
                     textShadow: "0 1px 3px rgba(0,0,0,0.6)"
                   }}
                 >
                   {activeMode === "visual" && "Before you open Pinterest. Before you search anything."}
                   {activeMode === "signature" && "A mark that’s yours. Even when they screenshot it."}
                   {activeMode === "fingerprints" && "The 4–8 emojis you use most naturally, analyzed for true system-based identity."}
                   {activeMode === "color" && "A living range of colors that shift and adapt over time."}
                 </p>
               </div>
             </div>
 
             {/* 4. BEGIN button under the subtitle */}
             <div className="w-full flex justify-center mt-12 z-10">
               <button
                 id="begin-btn"
                 onClick={handleBegin}
                 className={`px-10 py-2.5 rounded-full font-sans font-bold text-[10px] tracking-[0.25em] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer uppercase select-none border-0 shadow-md ${
                   (activeMode === "fingerprints" || activeMode === "color") ? "text-neutral-900 font-extrabold" : "text-white"
                 }`}
                 style={{
                   backgroundColor: modeAccentColor,
                 }}
               >
                 BEGIN
               </button>
             </div>
          </div>
        )}

        {/* =======================================================
            STATE B: QUIZ STEPS
           ======================================================= */}
        {screen === "quiz" && (
          <div className="flex flex-col gap-6 w-full animate-fade-in relative z-10">
            {/* 1. Step Navigation Header Row */}
            <div className="w-full">
              <div
                id="quiz-step-navbar"
                className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 w-full select-none"
              >
                <span
                  className="text-[10px] font-sans font-extrabold tracking-widest shrink-0 uppercase select-none text-black scale-105"
                >
                  {activeMode === "visual"
                    ? "VISUAL DIRECTION"
                    : activeMode === "signature"
                    ? "SIGNATURE MARK"
                    : activeMode === "fingerprints"
                    ? "EMOJI ARCHIVE"
                    : "COLOR WORLD"}
                </span>
              </div>
              {/* Thin mode-specific horizontal accent divider */}
              <div 
                className="w-full h-[1.5px] mt-1 opacity-70 transition-colors duration-300"
                style={{ backgroundColor: modeAccentColor }}
              />
            </div>

            {/* 2. Step Label / Current Step Info */}
            <div className="space-y-4 text-left select-none">
              <span id="quiz-short-breadcrumb" className="font-sans text-[11px] font-extrabold tracking-[0.2em] text-black uppercase">
                {activeMode === "visual"
                  ? "Visual Direction"
                  : activeMode === "signature"
                  ? "Signature Mark"
                  : activeMode === "fingerprints"
                  ? "Emoji Archive"
                  : "Color World"}
              </span>

              <h2 id="quiz-question-title" className="font-serif text-[28px] leading-tight text-black font-medium">
                {activeMode === "visual" && "Images I Keep Saving"}
                {activeMode === "signature" && "Things People Associate With Me"}
                {activeMode === "fingerprints" && "Emoji Fingerprint"}
                {activeMode === "color" && "Colors I Keep Returning To"}
              </h2>
              <p id="quiz-question-subtitle" className="font-sans text-[15px] text-black font-black leading-relaxed not-italic">
                {activeMode === "visual" && "List objects, environments, aesthetics, or visuals that repeatedly appear in your saves."}
                {activeMode === "signature" && "Add symbols, phrases, colors, themes, objects, or ideas that people already connect to you."}
                {activeMode === "fingerprints" && "Add the 4–8 emojis you use most naturally. These should be emojis that already appear in your captions, stories, comments, notes, or messages."}
                {activeMode === "color" && (
                  <span className="text-black font-black block my-1">
                    ⚠️ CRITICAL REQUIREMENT: You must explicitly write <span className="underline decoration-black font-black">"Colors I will use are these -"</span> and <span className="underline decoration-black font-black">"Colors I will not use are these-"</span>. Otherwise, the system will assume all colors listed are meant for active use.
                  </span>
                )}
              </p>
            </div>

            {/* 4. Active input controls */}
            <UploadReferences
              images={refImages}
              setImages={setRefImages}
              textDescription={refText}
              setTextDescription={setRefText}
              activeMode={activeMode}
            />

            {/* Loading Indicator for API generating */}
            {isLoading && (
              <div id="generating-modal" className="fixed inset-0 bg-black/75 z-50 flex flex-col items-center justify-center gap-4 text-center p-6 backdrop-blur-sm">
                <div role="status" className="flex flex-col items-center">
                  {/* Ornate Rose-Gold Globe Pocket Watch heirloom container */}
                  <div className="relative w-56 h-56 mb-6 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(243,169,200,0.3)] border-2 border-[#caa28f]/60 bg-[#fbf5f2] flex items-center justify-center select-none">
                    <img 
                      src={globePocketWatchImg} 
                      alt="Ornate Globe Pocket Watch" 
                      className="w-full h-full object-contain p-2 scale-[1.05]" 
                    />
                    {/* Subtle warm luxury glow overlying */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#6c3a44]/5 via-transparent to-[#ffffff]/25 pointer-events-none" />
                    {/* Interactive glowing light refractions */}
                    <div className="absolute top-[48%] left-[50%] w-6 h-6 flex items-center justify-center pointer-events-none select-none -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute w-[24px] h-[1px] bg-white rounded-full blur-[0.2px] shadow-[0_0_8px_white] animate-[pulse_2s_infinite]" />
                      <div className="absolute w-[1px] h-[24px] bg-white rounded-full blur-[0.2px] shadow-[0_0_8px_white] animate-[pulse_2s_infinite]" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl text-white font-light tracking-wide">
                    {activeMode === "fingerprints"
                      ? "Forging Your Fingerprint"
                      : activeMode === "color"
                      ? "Formulating Your Color World"
                      : "Curation in process"}
                  </h3>
                  <p className="font-serif italic text-[#e9c3cf] text-[15px] max-w-sm mt-3 leading-relaxed">
                    {activeMode === "fingerprints"
                      ? "Assembling the perfect sequence of signature emojis based on your spirit..."
                      : activeMode === "color"
                      ? "Formulating color frequencies to paint a living sensory universe..."
                      : "Distilling your subtle inputs into exact Pinterest query coordinates..."}
                  </p>
                </div>
              </div>
            )}
 
             {/* 5. Navigation Bottom Row */}
             <div id="quiz-action-bar" className="flex items-center justify-between mt-4">
               <button
                 id="back-step-btn"
                 onClick={handleBack}
                 className="font-serif text-[17px] text-black hover:opacity-75 transition-all bg-transparent border-0 cursor-pointer py-2 pl-0 pr-4 flex items-center gap-1 select-none"
               >
                 ← Back
               </button>
 
               {currentStepIndex < currentSteps.length - 1 ? (
                 <button
                   id="continue-step-btn"
                   onClick={handleNext}
                   disabled={!isContinueEnabled()}
                   className={`py-3 px-8 rounded-[12px] text-sm tracking-wider font-sans font-bold select-none cursor-pointer transition-all border
                     ${
                       isContinueEnabled()
                         ? (activeMode === "color"
                             ? "text-[#1F2421] shadow-md hover:scale-[1.03] active:scale-95"
                             : "text-white shadow-lg backdrop-blur-md scale-[1.01] hover:scale-[1.03] active:scale-95")
                         : (activeMode === "color"
                             ? "opacity-45 cursor-not-allowed text-[#1F2421]/55"
                             : "opacity-40 cursor-not-allowed text-white/50")
                     }
                   `}
                   style={{
                     background: getButtonBg(),
                     borderColor: isContinueEnabled()
                       ? (activeMode === "color" ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.35)")
                       : (activeMode === "color" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.12)"),
                     boxShadow: getButtonShadow(),
                   }}
                 >
                   Continue →
                 </button>
               ) : (
                 <button
                   id="generate-direction-btn"
                   onClick={handleNext}
                   disabled={!isContinueEnabled()}
                   className={`py-3 px-8 rounded-[12px] text-xs tracking-widest font-sans uppercase font-extrabold select-none cursor-pointer transition-all border
                     ${
                       isContinueEnabled()
                         ? (activeMode === "color"
                             ? "text-[#1F2421] shadow-md hover:scale-[1.03] active:scale-95"
                             : "text-white shadow-lg backdrop-blur-md scale-[1.01] hover:scale-[1.03] active:scale-95")
                         : (activeMode === "color"
                             ? "opacity-45 cursor-not-allowed text-[#1F2421]/55"
                             : "opacity-40 cursor-not-allowed text-white/50")
                     }
                   `}
                   style={{
                     background: getButtonBg(),
                     borderColor: isContinueEnabled()
                       ? (activeMode === "color" ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.35)")
                       : (activeMode === "color" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.12)"),
                     boxShadow: getButtonShadow(),
                   }}
                 >
                   {activeMode === "visual"
                     ? "Generate My Direction →"
                     : activeMode === "signature"
                     ? "Generate My Mark →"
                     : activeMode === "fingerprints"
                     ? "Generate My Fingerprint →"
                     : "Generate My Color World →"}
                 </button>
               )}
            </div>
          </div>
        )}

        {/* =======================================================
            STATE C: RESULTS SCREEN
           ======================================================= */}
        {screen === "results" && (
          <div className="flex flex-col gap-6 w-full animate-fade-in text-left">
            {/* Faceless Creator Toggle Button on Results Page */}
            <div className="flex justify-center mb-1 z-15 w-full">
              <button
                id="faceless-creator-results-toggle"
                onClick={() => setIsFacelessCreator(!isFacelessCreator)}
                className={`px-5 py-2 rounded-full border text-[10.5px] tracking-widest transition-all duration-350 font-sans font-black uppercase cursor-pointer select-none bg-black/50 text-white backdrop-blur-[4px]
                  ${
                    isFacelessCreator
                      ? "border-[#4fa89a] text-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.45)] bg-[#4fa89a]/10"
                      : "border-white/30 hover:border-white/60 hover:bg-white/5"
                  }
                `}
              >
                {isFacelessCreator ? "✨ Faceless Creator (Active)" : "I don't have a character (Faceless Creator)"}
              </button>
            </div>

            {/* High-demand / Fallback Notice banner */}
            {fallbackData && (
              <div 
                className="relative w-full p-5 rounded-[20px] border border-[#ffb3c1]/35 flex flex-col gap-3 backdrop-blur-md"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 243, 245, 0.96) 0%, rgba(255, 225, 230, 0.88) 100%)",
                  boxShadow: "0 6px 20px rgba(110, 30, 45, 0.08)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1 px-[7px] rounded-full bg-rose-200/60 text-rose-700 shrink-0 mt-0.5 text-[10px] font-bold font-sans">
                    !
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-base font-bold text-[#4a0e17] select-none">Instant Hand-Curated Curation</h4>
                    <p className="font-sans text-[12.5px] text-black/80 leading-relaxed select-text font-medium text-[#4a0e17]">
                      {fallbackErrorMessage || "The AI service is currently busy. Please try again in a few moments."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-between pt-2 border-t border-[#caa28f]/20">
                  <span className="font-sans text-[10px] uppercase tracking-wider font-semibold text-[#8a3a5c] select-none">Want the deep AI model?</span>
                  <button
                    onClick={generateResults}
                    className="py-1 px-3 rounded-full bg-[#8a3a5c] text-white hover:bg-[#5c1f30] transition-colors font-sans text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 cursor-pointer border-0 shadow-sm"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Try regenerating
                  </button>
                </div>
              </div>
            )}

            {activeMode === "color" ? (
              <div className={`flex flex-col gap-5 w-full rounded-[24px] transition-all duration-500
                ${isFacelessCreator ? "p-4 bg-black/10 border border-[#4fa89a]/50 shadow-[0_0_20px_rgba(79,168,154,0.4)]" : ""}
              `}>
                {/* Header: Mode eyebrow and headline */}
                <div className="space-y-1.5 text-center">
                  <span id="results-mode-eyebrow" className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#F4CCD8] uppercase select-none opacity-100 animate-fade-in filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    Color World Results
                  </span>
                  <h2 id="results-headline" className="font-serif text-[32px] leading-tight text-white select-none font-medium animate-fade-in filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    Your Living Spectrum
                  </h2>
                </div>

                {/* Moodline in italics centered at the top */}
                {generatedColorWorld?.moodLine && (
                  <div 
                    className="py-4 px-6 rounded-[24px] bg-black/65 border border-white/10 shadow-lg backdrop-blur-[6px] mt-1 mb-3 text-center"
                    style={{
                      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08), 0 4px 18px rgba(0,0,0,0.3)"
                    }}
                  >
                    <p className="font-serif italic text-base font-semibold text-[#f7e6cf] leading-relaxed select-text" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                      "{generatedColorWorld.moodLine}"
                    </p>
                  </div>
                )}

                {/* Palette Colors as circles in a grid with name and hex below */}
                <div className="grid grid-cols-2 gap-3.5 mt-1.5">
                  {generatedColorWorld?.palette.map((color, idx) => {
                    const isCopied = copiedColorIndex === idx;
                    return (
                      <div 
                        key={idx} 
                        className="flex flex-col items-center p-4 rounded-[22px] transition-all duration-300 border border-[#caa28f]/40 relative group overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, rgba(255, 252, 250, 0.96) 0%, rgba(255, 238, 234, 0.90) 100%)",
                          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {/* Circle Swatch */}
                        <button
                          onClick={() => handleCopyColorHex(color.hex, idx)}
                          className="w-14 h-14 rounded-full border border-black/15 shadow-[0_4px_10px_rgba(0,0,0,0.12)] mb-2 relative overflow-hidden transition-all duration-300 hover:scale-[1.06] active:scale-95 cursor-pointer flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                          title={`Click to copy: ${color.hex}`}
                        >
                          <span className="opacity-0 hover:opacity-100 transition-opacity duration-200 text-[8.5px] font-mono text-white bg-black/50 px-1.5 py-0.5 rounded-full uppercase select-none">
                            Copy
                          </span>
                        </button>
                        
                        {/* Name & Role */}
                        <span className="font-serif text-[13.5px] font-bold text-neutral-900 select-all text-center leading-tight truncate w-full px-0.5">
                          {color.name}
                        </span>
                        
                        <span className="font-sans text-[8.5px] font-extrabold tracking-wider uppercase text-neutral-500 select-none mt-1">
                          {color.role || "color"}
                        </span>

                        {/* Hex displays with copy button */}
                        <button
                          onClick={() => handleCopyColorHex(color.hex, idx)}
                          className={`mt-2.5 px-3 py-1 rounded-full font-mono text-[10.5px] font-semibold transition-all duration-200 border cursor-pointer select-none flex items-center gap-1
                            ${isCopied 
                              ? "bg-green-100 text-green-800 border-green-200 scale-102" 
                              : "bg-white/90 hover:bg-white text-black border-black/15 hover:border-black/35 shadow-sm"
                            }
                          `}
                        >
                          {isCopied ? "✓ Copied" : color.hex}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Evolutionary Note Section */}
                <div className="mt-4 p-5 rounded-[22px] border border-white/10 bg-black/65 backdrop-blur-[6px] space-y-3 text-center shadow-lg">
                  <span className="font-sans text-[10px] font-bold tracking-widest text-[#F4CCD8] uppercase block select-none">
                    Evolutionary Spectrum & Personal Choice
                  </span>
                  <div className="space-y-2 text-white/90">
                    <p className="font-sans text-[13px] leading-relaxed font-semibold">
                      This palette is a living range — not every color appears in every post. Let it breathe and evolve.
                    </p>
                    <p className="font-sans italic text-[12px] text-[#F4CCD8] leading-relaxed border-t border-white/10 pt-2 font-medium">
                      If a color doesn’t resonate with you, simply pick your own and go from there or change it out.
                    </p>
                  </div>
                </div>

                {/* Primary Action Button: Start Over */}
                <div id="results-primary-nav" className="flex flex-col gap-3 mt-5 w-full">
                  <button
                    id="reset-restart-btn"
                    onClick={handleStartOver}
                    className="w-full py-3.5 rounded-[14px] font-sans text-xs tracking-[0.18em] border border-white/35 bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer text-center uppercase select-none font-bold shadow-md"
                  >
                    Start over
                  </button>
                </div>
              </div>
            ) : activeMode === "fingerprints" ? (
              <div className={`flex flex-col gap-5 w-full rounded-[24px] transition-all duration-500
                ${isFacelessCreator ? "p-4 bg-black/10 border border-[#4fa89a]/50 shadow-[0_0_20px_rgba(79,168,154,0.4)]" : ""}
              `}>
                {/* Header: Mode eyebrow and headline */}
                <div className="space-y-1.5">
                  <span id="results-mode-eyebrow" className="font-sans text-[10px] font-bold tracking-[0.25em] text-black uppercase select-none opacity-80 animate-fade-in">
                    Fingerprint Results
                  </span>
                  <h2 id="results-headline" className="font-serif text-[32px] leading-tight text-black select-none font-medium animate-fade-in">
                    Your Signature
                  </h2>
                </div>

                {/* Big decorative luxury visual container for emojis */}
                <div
                  className="relative w-full py-9 px-6 rounded-[24px] flex flex-col items-center justify-center text-center gap-2 border-[1.5px] border-[#caa28f] select-none overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 252, 250, 0.94) 0%, rgba(255, 238, 234, 0.86) 100%)",
                    boxShadow: "inset 0 1px 3px rgba(255,255,255,0.95), 0 8px 32px rgba(110,30,45,0.12)",
                  }}
                >
                  {/* Luxury Pearl/Diamond jewelry details to preserve the rich editorial photographic feels */}
                  <div className="absolute top-[-2px] left-8 pointer-events-none flex items-center gap-1 opacity-75">
                    <div className="w-[4px] h-[4px] rounded-full overflow-hidden shrink-0">
                      <img src={pearlNecklaceImg} alt="Micro Pearl" className="w-full h-full object-cover scale-[1.5]" />
                    </div>
                    <div className="w-[3px] h-[3px] rounded-full overflow-hidden shrink-0">
                      <img src={brilliantDiamondImg} alt="Dust" className="w-full h-full object-cover scale-150 rotate-[25deg]" />
                    </div>
                  </div>

                  <div className="absolute right-[12px] bottom-[-2px] pointer-events-none flex items-center justify-end w-[130px] h-full overflow-visible z-10">
                    <div className="relative w-full h-full">
                      {/* Large statement Orchid-Pink Marquise Diamond */}
                      <div className="absolute right-[50px] bottom-[10px] w-[11px] h-[11px] rounded-full overflow-hidden border-[0.4px] border-white/40 rotate-[18deg]">
                        <img src={roseGemstoneImg} alt="Rose Diamond" className="w-full h-full object-cover" />
                      </div>
                      {/* High-Luster Heirloom Pearl */}
                      <div className="absolute right-[18px] bottom-[5px] w-[15px] h-[15px] rounded-full shadow-[2.5px_3.5px_7.5px_rgba(110,30,45,0.22)] border-[0.4px] border-white/45 overflow-hidden">
                        <img src={pearlNecklaceImg} alt="Heirloom Pearl" className="w-full h-full object-cover scale-[1.3] object-center" />
                      </div>
                    </div>
                  </div>

                  {/* 4-6 Emojis Large in the Center */}
                  <div id="fingerprint-emoji-display" className="text-4xl sm:text-5xl tracking-widest font-sans select-all font-bold my-4 animate-fade-in relative z-20">
                    {generatedFingerprint?.emojis.join(" ")}
                  </div>
                </div>

                {/* Explanation in italics */}
                <p id="fingerprint-explanation" className="font-serif italic text-[16px] text-[#5c1f30] leading-relaxed select-text mt-1 text-center sm:text-left">
                  "{generatedFingerprint?.explanation}"
                </p>

                {/* Instructional Note */}
                <div className="mt-2 pt-4 border-t border-[#caa28f]/30 space-y-1 select-none text-left">
                  <span className="font-sans text-[10px] font-extrabold tracking-wider text-black/50 uppercase block">Where to use:</span>
                  <p className="font-sans text-[13px] text-black/90 leading-relaxed font-medium">
                    Use this exact combination every time. End of every Reel and carousel caption. On reposts of your own content. In your bio.
                  </p>
                </div>

                {/* 5-Category Deep Engine Analysis */}
                {generatedFingerprint?.analysis && (
                  <div className="mt-4 pt-5 border-t border-[#caa28f]/30 space-y-4 text-left select-none">
                    <span className="font-sans text-[10px] font-bold tracking-widest text-[#8a3a5c] uppercase block">
                      Engine Fingerprint Breakdown
                    </span>

                    <div className="space-y-3.5">
                      {/* Repetition */}
                      <div className="p-4 rounded-[18px] border border-[#caa28f]/20 bg-white/45 space-y-1 block">
                        <span className="font-sans text-[9px] font-extrabold tracking-wider text-[#8a3a5c] block uppercase">
                          ● Repetition & Cadence
                        </span>
                        <p className="font-serif text-[13.5px] text-neutral-900 leading-relaxed select-text font-medium italic">
                          {generatedFingerprint.analysis.repetition}
                        </p>
                      </div>

                      {/* Themes */}
                      <div className="p-4 rounded-[18px] border border-[#caa28f]/20 bg-white/45 space-y-1 block">
                        <span className="font-sans text-[9px] font-extrabold tracking-wider text-[#8a3a5c] block uppercase">
                          ● Core Themes & Symbols
                        </span>
                        <p className="font-serif text-[13.5px] text-neutral-900 leading-relaxed select-text font-medium italic">
                          {generatedFingerprint.analysis.themes}
                        </p>
                      </div>

                      {/* Emotional Tone */}
                      <div className="p-4 rounded-[18px] border border-[#caa28f]/20 bg-white/45 space-y-1 block">
                        <span className="font-sans text-[9px] font-extrabold tracking-wider text-[#8a3a5c] block uppercase">
                          ● Emotional Tone & Vibe
                        </span>
                        <p className="font-serif text-[13.5px] text-neutral-900 leading-relaxed select-text font-medium italic">
                          {generatedFingerprint.analysis.emotionalTone}
                        </p>
                      </div>

                      {/* Visual Consistency */}
                      <div className="p-4 rounded-[18px] border border-[#caa28f]/20 bg-white/45 space-y-1 block">
                        <span className="font-sans text-[9px] font-extrabold tracking-wider text-[#8a3a5c] block uppercase">
                          ● Visual Consistency & Cohesion
                        </span>
                        <p className="font-serif text-[13.5px] text-neutral-900 leading-relaxed select-text font-medium italic">
                          {generatedFingerprint.analysis.visualConsistency}
                        </p>
                      </div>

                      {/* Which emojis feel strongest together */}
                      <div className="p-4 rounded-[18px] border border-[#caa28f]/20 bg-white/45 space-y-1 block">
                        <span className="font-sans text-[9px] font-extrabold tracking-wider text-[#8a3a5c] block uppercase">
                          ● Strongest Interpersonal Resonance
                        </span>
                        <p className="font-serif text-[13.5px] text-neutral-900 leading-relaxed select-text font-medium italic">
                          {generatedFingerprint.analysis.strongestCombination}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fingerprint Fallback Visual Details */}
                {fallbackData && (
                  <div className="mt-4 pt-4 border-t border-[#caa28f]/30 space-y-4">
                    <div className="space-y-1">
                      <span className="font-sans text-[10px] font-extrabold tracking-wider text-black/50 uppercase block select-none">The Fallback Mood & Palette</span>
                      <p className="font-serif italic text-sm text-[#5c1f30] leading-relaxed">
                        "{fallbackData.moodSummary}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 select-none">
                      {fallbackData.palette.map((color, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2 bg-white/60 p-1.5 rounded-full border border-[#caa28f]/30">
                          <div 
                            className="w-6 h-6 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="min-w-0 pr-2">
                            <span className="font-serif text-[11px] text-black font-semibold truncate block leading-none">{color.name}</span>
                            <span className="font-mono text-[8.5px] text-[#8a3a5c] block leading-none mt-0.5">{color.hex}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-[18px] border border-[#caa28f]/35 bg-white/75 space-y-2 select-text">
                      <span className="font-sans text-[9px] font-extrabold tracking-[0.2em] text-black/60 uppercase block select-none font-sans">Execution Do / Do Not</span>
                      <div className="space-y-1 text-xs">
                        <p className="text-[#1e5c3e] font-semibold">✓ {fallbackData.dos[0]}</p>
                        <p className="text-[#8a3a5c] font-semibold">✗ {fallbackData.doNots[0]}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div id="results-primary-nav" className="flex flex-col gap-3.5 mt-6 w-full">
                  <button
                    id="copy-fingerprint-btn"
                    onClick={() => {
                      if (generatedFingerprint) {
                        navigator.clipboard.writeText(generatedFingerprint.emojis.join(" "));
                        setCopiedFingerprint(true);
                        setTimeout(() => setCopiedFingerprint(false), 1500);
                      }
                    }}
                    className="w-full py-4 rounded-[14px] font-sans font-extrabold text-[#1a0509] transition-all cursor-pointer text-center uppercase select-none border-0 shadow-lg text-xs tracking-[0.2em]"
                    style={{
                      backgroundColor: "#FFAFCC",
                    }}
                  >
                    {copiedFingerprint ? "✓ Fingerprint Copied!" : "Copy Fingerprint"}
                  </button>

                  <button
                    id="reset-restart-btn"
                    onClick={handleStartOver}
                    className="w-full py-3.5 rounded-[14px] font-sans text-xs tracking-[0.18em] border border-black/30 bg-transparent text-black transition-all cursor-pointer text-center hover:border-black/60 hover:bg-black/5 uppercase select-none font-semibold"
                  >
                    Start over
                  </button>
                </div>
              </div>
            ) : (
              <div className={`flex flex-col gap-6 w-full rounded-[24px] transition-all duration-500
                ${isFacelessCreator ? "p-4 bg-black/10 border border-[#4fa89a]/50 shadow-[0_0_20px_rgba(79,168,154,0.4)]" : ""}
              `}>
                {/* Header: Mode eyebrow and headline */}
                <div className="space-y-2">
                  <span id="results-mode-eyebrow" className="font-sans text-[10px] font-bold tracking-[0.25em] text-black uppercase select-none">
                    {activeMode === "visual" ? "Visual Direction Results" : "Signature Mark Results"}
                  </span>
                  <h2 id="results-headline" className="font-serif text-[34px] leading-tight text-black select-none font-medium">
                    Your Search Terms
                  </h2>
                  <p id="results-italic-instruction" className="font-serif italic text-sm text-black/85 leading-relaxed select-none">
                    Tap a phrase to copy it, or copy all and paste straight into Pinterest.
                  </p>
                </div>

                {/* Signature Mark Reframed Note */}
                {activeMode === "signature" && isFacelessCreator && (
                  <div className="p-4 rounded-[20px] bg-[#4fa89a]/10 border border-[#4fa89a]/40 shadow-[0_0_12px_rgba(79,168,154,0.2)] text-black space-y-1 animate-fade-in">
                    <span className="font-sans text-[10px] font-black tracking-widest text-[#2b6d61] uppercase block">
                      Faceless Creator Curation Note
                    </span>
                    <p className="font-sans text-xs text-neutral-800 font-bold leading-relaxed">
                      Your Signature Mark applies, but it is reframed to visual symbols, overlays, and sticker placements rather than character-centric styling.
                    </p>
                  </div>
                )}

                {/* 12 Result Phrases list */}
                <div id="results-phrases-scaffolder" className="grid grid-cols-1 gap-3 mt-2">
                  {generatedPhrases.map((phrase, idx) => {
                    const isJustCopied = copiedIndex === idx;
                    return (
                      <button
                        key={idx}
                        id={`result-phrase-${idx}`}
                        onClick={() => handleCopySingle(phrase, idx)}
                        className="relative w-full text-left py-4 px-5 rounded-[22px] transition-all duration-350 flex items-center justify-between gap-3 border-[1.5px] border-[#caa28f] hover:border-black/50 hover:scale-[1.01] select-none cursor-pointer overflow-visible group"
                        style={{
                          background: "linear-gradient(135deg, rgba(255, 252, 250, 0.94) 0%, rgba(255, 238, 234, 0.86) 100%)",
                          boxShadow: "inset 0 1px 3px rgba(255,255,255,0.95), 0 8px 24px rgba(110,30,45,0.12)",
                        }}
                      >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 rounded-[20px] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none z-0 overflow-hidden" />

                        {/* TOP MICRO EMBELLISHMENT ON CARD CORNER */}
                        <div className="absolute top-[-2px] left-8 pointer-events-none flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-[4px] h-[4px] rounded-full overflow-hidden shadow-[0.5px_0.5px_1px_rgba(92,31,48,0.2)] border-[0.2px] border-white/40 shrink-0">
                            <img src={pearlNecklaceImg} alt="Micro Pearl" className="w-full h-full object-cover scale-[1.5]" />
                          </div>
                          <div className="w-[3px] h-[3px] rounded-full overflow-hidden shrink-0">
                            <img src={brilliantDiamondImg} alt="Dust" className="w-full h-full object-cover scale-150 rotate-[25deg]" />
                          </div>
                        </div>

                         {/* SPECIAL DETAILED HEIRLOOM JEWELRY CLUSTER AT THE RIGHT CORNER */}
                        <div className="absolute right-[12px] bottom-[-2px] pointer-events-none flex items-center justify-end w-[130px] h-full overflow-visible z-10">
                          <div className="relative w-full h-full">
                            {/* 1. Large luxury statement Orchid-Pink Marquise Diamond (13px) */}
                            <div className="absolute right-[58px] bottom-[14px] w-[13px] h-[13px] rounded-full overflow-hidden shadow-[0.5px_1.5px_3.5px_rgba(0,0,0,0.15)] border-[0.4px] border-white/40 rotate-[18deg]">
                              <img src={roseGemstoneImg} alt="Statement Rose Diamond" className="w-full h-full object-cover scale-[1.45] rotate-[20deg]" />
                            </div>

                            {/* 2. Faceted Cushion-Cut Statement Diamond with light refraction (11px) */}
                            <div className="absolute right-[10px] bottom-[22px] w-[11px] h-[11px] rounded-full overflow-hidden shadow-[0.5px_1px_3px_rgba(0,0,0,0.15)] border-[0.3px] border-white/35">
                              <img src={brilliantDiamondImg} alt="Refractive Cushion Diamond" className="w-full h-full object-cover scale-[1.55] rotate-[40deg]" />
                            </div>

                            {/* 3. Draping Fine Rose Gold delicate chain connection line */}
                            <svg className="absolute inset-0 w-full h-full opacity-45" viewBox="0 0 130 60" fill="none">
                              <path d="M45,41 C68,31 102,46 122,18" stroke="#d4b053" strokeWidth="0.8" strokeDasharray="1.5 2" />
                            </svg>

                            {/* 4. Single Master High-Luster Heirloom Pearl (17px) with a fine top gold bezel attachment */}
                            <div className="absolute right-[24px] bottom-[7px] w-[17px] h-[17px] rounded-full shadow-[2.5px_3.5px_7.5px_rgba(110,30,45,0.22)] border-[0.4px] border-white/45 transition-transform duration-350 group-hover:scale-[1.05] overflow-hidden">
                              <img src={pearlNecklaceImg} alt="Heirloom Pearl" className="w-full h-full object-cover scale-[1.3] object-center" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10 pointer-events-none" />
                            </div>

                            {/* Delicate Rose Gold attachment bail cap sitting at the top point of the Pearl */}
                            <div className="absolute right-[30.5px] bottom-[21px] w-[4px] h-[3.5px] bg-[#d4b053] rounded-t-[1.5px] opacity-80 border-t-[0.2px] border-white/20 shadow-[0_0.5px_1px_rgba(0,0,0,0.1)]" />

                            {/* 5. A single precious sparkling light glint on the diamond tip */}
                            <div className="absolute right-[14px] bottom-[28px] w-[4.5px] h-[4.5px] rounded-full bg-white shadow-[0_0_5px_white] animate-[pulse_1.5s_infinite_alternate]" />
                          </div>
                        </div>

                        {/* Copy Pill indicator / check confirmation */}
                        <span className="text-[#1a0509] font-serif text-[15.5px] font-semibold leading-snug tracking-wide select-none pr-[110px] sm:pr-[120px] relative z-20">
                          {phrase}
                        </span>

                        <span className="shrink-0 flex items-center justify-center relative z-20">
                          {isJustCopied ? (
                            <span className="flex items-center gap-1 text-[#3a9d92] font-sans text-[10px] font-bold tracking-wider uppercase animate-bounce">
                              <Check className="w-4 h-4 text-[#3a9d92]" /> Copied
                            </span>
                          ) : (
                            <span className="text-[#1a0509]/50 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              copy
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* ----------------- CURATION BLUEPRINT SPECIFICATION PORTFOLIO ----------------- */}
                {generatedBlueprint && (
                  <div className="mt-6 pt-6 border-t border-[#caa28f]/40 space-y-6 text-black select-text">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="font-sans text-[11px] font-extrabold tracking-[0.25em] text-[#8a3a5c] uppercase block select-none font-black">
                        SYSTEM CURATION SPECIFICATIONS
                      </span>
                      <h3 className="font-serif text-2xl font-black text-black leading-tight">
                        Curation Blueprint Portfolio
                      </h3>
                      <p className="font-sans text-xs text-neutral-800 font-bold">
                        Phase 2 & Phase 3 authoritative specs compiled for your brand.
                      </p>
                    </div>

                    {/* Section 1: Committed World Direction */}
                    <div 
                      className={`p-5 rounded-[22px] border-[1.5px] bg-white space-y-3.5 shadow-md transition-all duration-350 hover:border-black
                        ${isFacelessCreator ? "border-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.35)]" : "border-[#caa28f]"}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8a3a5c]" />
                        <span className="font-sans text-xs font-black tracking-widest text-[#8a3a5c] uppercase">
                          Phase 2 • Committed World Direction
                        </span>
                      </div>

                      <div className="space-y-2 border-b border-[#caa28f]/20 pb-3">
                        <span className="font-sans text-[10px] font-black tracking-wider text-neutral-500 uppercase block">
                          Committed Main Axis:
                        </span>
                        <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#8a3a5c] text-white font-sans text-xs font-black tracking-widest uppercase shadow-sm">
                          {generatedBlueprint.worldDirection.type}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-sans text-[10px] font-black tracking-wider text-neutral-500 uppercase block">
                          Meaning & Curation Controls:
                        </span>
                        <p className="font-sans text-[13.5px] font-black text-black leading-relaxed">
                          {generatedBlueprint.worldDirection.meaning}
                        </p>
                      </div>
                    </div>

                    {/* Section 2: World Rules */}
                    <div 
                      className={`p-5 rounded-[22px] border-[1.5px] bg-white space-y-4 shadow-md transition-all duration-350 hover:border-black
                        ${isFacelessCreator ? "border-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.35)]" : "border-[#caa28f]"}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-black" />
                        <span className="font-sans text-xs font-black tracking-widest text-black uppercase">
                          Phase 2 • World Rules System
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-[16px] bg-[#f9f9f9] border border-black/10 space-y-1">
                          <span className="font-sans text-[9px] font-black tracking-widest text-emerald-800 uppercase block">
                            ✓ What Exists in the World
                          </span>
                          <p className="font-sans text-[13px] font-black text-black leading-relaxed">
                            {generatedBlueprint.worldDirection.exists}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-[16px] bg-[#f9f9f9] border border-black/10 space-y-1">
                          <span className="font-sans text-[9px] font-black tracking-widest text-amber-800 uppercase block">
                            ● What Consistently Repeats
                          </span>
                          <p className="font-sans text-[13px] font-black text-black leading-relaxed">
                            {generatedBlueprint.worldDirection.repeats}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-[16px] bg-[#fcf5f6] border border-rose-200 space-y-1 md:col-span-2">
                          <span className="font-sans text-[9px] font-black tracking-widest text-rose-800 uppercase block">
                            ✗ What Breaks the World / Does NOT Belong
                          </span>
                          <div className="space-y-2">
                            <p className="font-sans text-[13px] font-black text-[#5c1f30] leading-relaxed">
                              <span className="text-[#8a3a5c] font-black">Shatters Illusion:</span> {generatedBlueprint.worldDirection.breaks}
                            </p>
                            <p className="font-sans text-[13px] font-black text-[#5c1f30] border-t border-rose-100 pt-1.5 leading-relaxed">
                              <span className="text-[#8a3a5c] font-black">Does Not Belong:</span> {generatedBlueprint.worldDirection.doesNotBelong}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Environment */}
                    <div 
                      className={`p-5 rounded-[22px] border-[1.5px] bg-white space-y-3.5 shadow-md transition-all duration-350 hover:border-black
                        ${isFacelessCreator ? "border-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.35)]" : "border-[#caa28f]"}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3a9d92]" />
                        <span className="font-sans text-xs font-black tracking-widest text-[#3a9d92] uppercase">
                          Phase 2 • Environment Parameters
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[9px] font-black tracking-wider text-neutral-500 uppercase block">
                            Permitted Spaces & Background Horizons:
                          </span>
                          <p className="font-sans text-[13px] font-black text-black leading-relaxed">
                            {generatedBlueprint.environment.spaces}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-[16px] bg-[#f5fbfb] border border-[#3a9d92]/20 space-y-1">
                          <span className="font-sans text-[9px] font-black tracking-widest text-[#3a9d92] uppercase block">
                            Emotional Tone & Aesthetic Feel:
                          </span>
                          <p className="font-sans text-[13px] font-black text-black leading-relaxed">
                            {generatedBlueprint.environment.emotionalTone}
                          </p>
                        </div>

                        <div className="p-3 rounded-[14px] bg-neutral-50 border border-neutral-200 text-[11px] font-bold text-neutral-800 leading-relaxed italic">
                          <span className="font-sans font-black text-black uppercase not-italic">CRITICAL MEMO: </span>
                          {generatedBlueprint.environment.worldVsBackground}
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Visual Language Specifications */}
                    <div 
                      className={`p-5 rounded-[22px] border-[1.5px] bg-white space-y-4 shadow-md transition-all duration-350 hover:border-black
                        ${isFacelessCreator ? "border-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.35)]" : "border-[#caa28f]"}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d4b053]" />
                        <span className="font-sans text-xs font-black tracking-widest text-black uppercase">
                          Phase 3 • Visual Language Spec Dictionary
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Column 1 */}
                        <div className="space-y-3 text-left">
                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Color Behavior:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.colorBehavior}</p>
                          </div>
                          
                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Visual Tone & Feeling:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.tone}</p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Energy Pattern:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.energy}</p>
                          </div>

                           <div className={`space-y-0.5 transition-all duration-350 ${isFacelessCreator ? "opacity-35 select-none" : ""}`}>
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Styling Direction:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">
                              {isFacelessCreator ? "Not applicable (Faceless Creator)" : generatedBlueprint.visualLanguage.styling}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Lighting Behavior:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.lighting}</p>
                          </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-3 text-left">
                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Repeating Color Pairings:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.repeatingColors}</p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Environment Type & Horizon:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.environmentType}</p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Composition & Framing:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.composition}</p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-black text-neutral-500 uppercase tracking-wider block font-black">Unified Emotional Feel:</span>
                            <p className="font-sans text-[13px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.emotionalFeel}</p>
                          </div>
                        </div>

                        {/* Full Width Exclusions */}
                        <div className="sm:col-span-2 pt-3 border-t border-[#caa28f]/20 space-y-2.5">
                          <div className="space-y-0.5">
                            <span className="font-sans text-[9.5px] font-black text-rose-800 uppercase tracking-wider block font-black">Colors that Break your World (Strict Ban):</span>
                            <p className="font-sans text-[12.5px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.colorsThatBreak}</p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="font-sans text-[9.5px] font-black text-rose-800 uppercase tracking-wider block font-black">Explicit Objects / Concepts that Do NOT Belong:</span>
                            <p className="font-sans text-[12.5px] font-black text-black leading-relaxed">{generatedBlueprint.visualLanguage.notBelongVisual}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual/Signature Fallback Details */}
                {fallbackData && (
                  <div className="flex flex-col gap-5 mt-4 pt-4 border-t border-[#caa28f]/30">
                    
                    {/* Mood & Palette */}
                    <div className="space-y-3">
                      <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-black uppercase opacity-85 block">
                        The Curated Mood & Palette
                      </span>
                      
                      <div className={`p-5 rounded-[22px] border bg-white/95 space-y-4 shadow-sm transition-all duration-350
                        ${isFacelessCreator ? "border-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.35)]" : "border-[#caa28f]/40"}
                      `}>
                        <p className="font-serif italic text-sm text-[#5c1f30] leading-relaxed">
                          "{fallbackData.moodSummary}"
                        </p>
                        
                        {/* PALETTE CIRCLES ROW */}
                        <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 pt-2">
                          {fallbackData.palette.map((color, cIdx) => (
                            <div key={cIdx} className="flex flex-col items-center gap-1.5 text-center">
                              <div 
                                className="w-10 h-10 rounded-full border border-black/15 shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
                                style={{ backgroundColor: color.hex }}
                              />
                              <div className="space-y-0.5">
                                <span className="font-serif text-[11px] font-semibold text-black leading-none block">{color.name}</span>
                                <span className="font-mono text-[9px] text-[#8a3a5c] block">{color.hex}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Textures & Composition */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* TEXTURE PLACEMENT CARD */}
                      <div className={`p-4 rounded-[22px] border bg-white/95 space-y-2 transition-all duration-350
                        ${isFacelessCreator ? "border-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.35)]" : "border-[#caa28f]/40"}
                      `}>
                        <span className="font-sans text-[9px] font-extrabold tracking-[0.2em] text-black/60 uppercase block">
                          Texture & Material Direction
                        </span>
                        <ul className="space-y-1.5 list-none pl-0">
                          {fallbackData.textures.map((txt, tIdx) => (
                            <li key={tIdx} className="font-sans text-[12.5px] text-black/90 flex items-start gap-2">
                              <span className="text-[#8a3a5c] mt-0.5 font-bold">•</span>
                              <span>{txt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* COMPOSITION CARD */}
                      <div className={`p-4 rounded-[22px] border bg-white/95 space-y-2 transition-all duration-350
                        ${isFacelessCreator ? "border-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.35)]" : "border-[#caa28f]/40"}
                      `}>
                        <span className="font-sans text-[9px] font-extrabold tracking-[0.2em] text-black/60 uppercase block">
                          Composition & Framing
                        </span>
                        <p className="font-serif italic text-[13.5px] text-black/90 leading-relaxed">
                          {fallbackData.composition}
                        </p>
                      </div>

                    </div>

                    {/* execution DO / DO NOTS */}
                    <div className={`p-5 rounded-[22px] border bg-[#fffdfc] space-y-3 transition-all duration-350
                      ${isFacelessCreator ? "border-[#4fa89a] shadow-[0_0_15px_rgba(79,168,154,0.35)]" : "border-[#caa28f]/40"}
                    `}>
                      <span className="font-sans text-[9px] font-extrabold tracking-[0.2em] text-black/60 uppercase block">
                        Execution Guide
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#caa28f]/20">
                        
                        {/* DO COLUMN */}
                        <div className="space-y-2 pr-0 sm:pr-4">
                          <span className="font-sans text-[10px] font-bold text-[#1e5c3e] uppercase tracking-wider block">✓ Do</span>
                          <ul className="space-y-1.5 list-none pl-0 animate-fade-in">
                            {fallbackData.dos.map((doItem, dIdx) => (
                              <li key={dIdx} className="font-sans text-[12px] text-[#1e5c3e]/90 flex items-start gap-1.5 w-full">
                                <span className="text-[#1e5c3e] font-extrabold shrink-0">✓</span>
                                <span>{doItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* DO NOT COLUMN */}
                        <div className="space-y-2 pt-3 sm:pt-0 pl-0 sm:pl-4">
                          <span className="font-sans text-[10px] font-bold text-[#8a3a5c] uppercase tracking-wider block">✗ Do Not</span>
                          <ul className="space-y-1.5 list-none pl-0 animate-fade-in">
                            {fallbackData.doNots.map((notItem, nIdx) => (
                              <li key={nIdx} className="font-sans text-[12px] text-[#8a3a5c]/95 flex items-start gap-1.5 w-full">
                                <span className="text-[#8a3a5c] font-bold shrink-0">✗</span>
                                <span>{notItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* Sticker Creation Workflow Card for Signature Mark */}
                {activeMode === "signature" && (
                  <div className="p-5 mt-4 rounded-[22px] border border-[#caa28f]/40 bg-gradient-to-br from-[#fffdfc] to-[#fffaee] space-y-3.5 shadow-sm text-left select-none animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8a3a5c] shrink-0" />
                      <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#8a3a5c] uppercase block">
                        Sticker Creation Workflow
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="font-serif italic text-sm text-black/90 leading-relaxed font-semibold">
                        Once you run your Pinterest searches and find the exact image that resonates:
                      </p>
                      <div className="p-3.5 bg-white/65 hover:bg-white/95 rounded-[14px] border border-[#caa28f]/20 transition-all duration-200">
                        <p className="font-sans text-[12.5px] text-neutral-800 leading-relaxed font-medium">
                          Save the image to your device, then go to <a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer" className="text-[#8a3a5c] font-bold underline inline-flex items-center gap-0.5 hover:text-black transition-colors cursor-pointer">remove.bg <ExternalLink className="w-3 h-3" /></a> to make a clean digital sticker out of it from there.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Copy All & Start Over row buttons */}
                <div id="results-primary-nav" className="flex flex-col gap-3.5 mt-6 w-full">
                  <button
                    id="copy-all-btn"
                    onClick={handleCopyAll}
                    className={`w-full py-4 rounded-[14px] font-sans font-extrabold text-xs tracking-[0.2em] transition-all cursor-pointer text-center uppercase select-none border-0 shadow-lg ${
                      (activeMode === "fingerprints" || activeMode === "color") ? "text-neutral-900 font-extrabold" : "text-white"
                    }`}
                    style={{
                      backgroundColor: modeAccentColor,
                    }}
                  >
                    {copiedAll ? "✓ Copied All 12 Phrases!" : "Copy all 12"}
                  </button>

                  <button
                    id="reset-restart-btn"
                    onClick={handleStartOver}
                    className="w-full py-3.5 rounded-[14px] font-sans text-xs tracking-[0.18em] border border-black/30 bg-transparent text-black transition-all cursor-pointer text-center hover:border-black/60 hover:bg-black/5 uppercase select-none font-semibold"
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            STATE D: ERROR STATE
           ======================================================= */}
        {screen === "error" && (
          <div className="flex flex-col items-center text-center gap-6 w-full animate-fade-in py-10">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <h2 id="error-title" className="font-serif text-[28px] text-black leading-tight font-medium">
                Couldn't generate results
              </h2>
              <p id="error-message-text" className="font-serif italic text-[15px] text-black/85 max-w-sm px-4 leading-relaxed">
                {errorMsg}
              </p>
            </div>

            <div id="error-nav-actions" className="flex flex-col gap-3.5 mt-6 w-full px-8">
              <button
                id="retry-api-btn"
                onClick={generateResults}
                className="w-full py-4 rounded-[14px] bg-black text-white font-sans font-extrabold text-xs tracking-[0.2em] transition-all hover:scale-[1.01] cursor-pointer shadow-md uppercase select-none border-0"
              >
                Retry
              </button>

              <button
                id="error-restart-btn"
                onClick={handleStartOver}
                className="w-full py-3.5 rounded-[14px] border border-black/30 bg-transparent text-black font-sans text-xs tracking-[0.18em] transition-all hover:border-black/50 hover:bg-black/5 cursor-pointer uppercase select-none font-semibold"
              >
                Start over
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
