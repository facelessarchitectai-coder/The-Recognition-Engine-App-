import React from "react";

// Real-world high-fidelity jewelry photography assets
import brilliantDiamondImg from "../assets/images/brilliant_diamond_1781750876333.jpg";
import roseGemstoneImg from "../assets/images/rose_gemstone_1781750892234.jpg";
import pearlNecklaceImg from "../assets/images/pearl_necklace_1781750905009.jpg";
import luxuryJewelryEnvBg from "../assets/images/heirloom_jewelry_frame_bg_1781754016797.jpg";
import luxuryHeirloomJewelryEnvBg from "../assets/images/romantic_vanity_bg_1781836495383.jpg";

interface GemsAndPearlsProps {
  screen?: "home" | "quiz" | "results" | "error";
}

interface PearlProps {
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

// Highly realistic individual pearl element utilizing high-luster heirloom jewelry photography textures
const Pearl: React.FC<PearlProps> = ({ size, className = "", style = {} }) => {
  return (
    <div
      className={`rounded-full shadow-[1.5px_2px_4.5px_rgba(110,30,45,0.16),_inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.1)] border-[0.4px] border-white/35 overflow-hidden relative shrink-0 filter contrast-[0.80] saturate-[0.88] opacity-[0.93] ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style
      }}
    >
      <img
        src={pearlNecklaceImg}
        alt="Pearl Texture"
        className="w-full h-full object-cover scale-[1.3] object-center"
      />
      {/* 3D Pearl Sheen Glare */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/40 pointer-events-none" />
      <div className="absolute top-[12%] left-[15%] w-[30%] h-[30%] rounded-full bg-white/70 blur-[0.4px] pointer-events-none animate-[pulse_3s_infinite_alternate]" />
    </div>
  );
};

interface FacetedDiamondProps {
  size: number;
  className?: string;
  style?: React.CSSProperties;
  colorType?: "rose" | "brilliant";
  rotation?: number;
}

// Photorealistic faceted diamond crystal using high-end gemstone assets and custom CSS clipping
const FacetedDiamond: React.FC<FacetedDiamondProps> = ({
  size,
  className = "",
  style = {},
  colorType = "rose",
  rotation = 0
}) => {
  const imgSrc = colorType === "rose" ? roseGemstoneImg : brilliantDiamondImg;
  return (
    <div
      className={`relative select-none pointer-events-none overflow-hidden shrink-0 filter contrast-[0.78] saturate-[0.86] opacity-[0.92] ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        clipPath: "polygon(50% 0%, 85% 20%, 100% 50%, 85% 80%, 50% 100%, 15% 80%, 0% 50%, 15% 20%)", // Facet crystal shape
        ...style
      }}
    >
      <img
        src={imgSrc}
        alt="Faceted Jewel"
        className="w-full h-full object-cover scale-[1.12]"
      />
      {/* Dynamic light refraction glaze */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/25 mix-blend-overlay pointer-events-none" />
      {/* Sparkling lens star on facet tip */}
      <div className="absolute top-[20%] left-[20%] w-4 h-4 flex items-center justify-center pointer-events-none select-none">
        <div className="absolute w-[18px] h-[0.8px] bg-white rounded-full blur-[0.2px] shadow-[0_0_5px_white] animate-[pulse_1s_infinite_alternate]" />
        <div className="absolute w-[0.8px] h-[18px] bg-white rounded-full blur-[0.2px] shadow-[0_0_5px_white] animate-[pulse_1s_infinite_alternate]" />
      </div>
    </div>
  );
};

export function GemsAndPearls({ screen = "home" }: GemsAndPearlsProps) {
  // Generate highly controlled draping curves for responsive frame decoration

  // 1. Cascading pearl strand draping on the left edge (X from -4% to +8%)
  const leftPearlStrand = Array.from({ length: 18 }).map((_, i) => {
    const t = i / 17; // 0 to 1
    const y = t * 110 - 5; // -5% to 105%
    const xOffset = Math.sin(t * Math.PI) * 11 - 4; // curves inwards
    const size = 16 + Math.sin(t * Math.PI) * 12; // larger in the middle (up to 28px)
    const rotation = (i * 37) % 360;
    return { x: `${xOffset}%`, y: `${y}%`, size, rotation };
  });

  // 2. Cascading pearl strand draping on the right edge (X from 104% down to 90%)
  const rightPearlStrand = Array.from({ length: 16 }).map((_, i) => {
    const t = i / 15;
    const y = t * 110 - 5;
    const xOffset = 100 - (Math.sin(t * Math.PI) * 9 - 4); // curves inwards
    const size = 14 + Math.sin(t * Math.PI) * 10;
    const rotation = (i * 43) % 360;
    return { x: `${xOffset}%`, y: `${y}%`, size, rotation };
  });

  // 3. Top frame subtle arched pearl strand
  const topPearlStrand = Array.from({ length: 12 }).map((_, i) => {
    const t = i / 11;
    const x = t * 110 - 5;
    const yOffset = Math.sin(t * Math.PI) * 13 - 6; // curves downwards
    const size = 11 + Math.sin(t * Math.PI) * 5;
    const rotation = (i * 29) % 360;
    return { x: `${x}%`, y: `${yOffset}%`, size, rotation };
  });

  // 4. Bottom frame drape strand
  const bottomPearlStrand = Array.from({ length: 16 }).map((_, i) => {
    const t = i / 15;
    const x = t * 110 - 5;
    const yOffset = 100 - (Math.sin(t * Math.PI) * 16 - 4); // curves upwards
    const size = 13 + Math.sin(t * Math.PI) * 9;
    const rotation = (i * 51) % 360;
    return { x: `${x}%`, y: `${yOffset}%`, size, rotation };
  });

  // Loose micro diamond sparkle coordinates for background ambiance
  const looseSparkles = [
    { top: "15%", left: "14%", delay: "0.2s" },
    { top: "25%", left: "85%", delay: "1.1s" },
    { top: "48%", left: "93%", delay: "0.7s" },
    { top: "75%", left: "6%", delay: "1.8s" },
    { top: "88%", left: "33%", delay: "1.4s" },
    { top: "92%", left: "78%", delay: "2.3s" },
  ];

  const isHomeScreen = screen === "home";

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#f2cbd4]">
      {/* 1. Immersive Approved Luxury Editorial Image Backdrop */}
      <div className={`absolute inset-0 w-full h-full transform transition-transform duration-1000 ${
        isHomeScreen ? "scale-100" : "scale-[1.01] animate-[gentleZoom_30s_ease-in-out_infinite_alternate]"
      }`}>
        <img
          src={luxuryHeirloomJewelryEnvBg}
          alt="Luxury Jewelry Heirloom Background"
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isHomeScreen
              ? "" // 100% Pristine Image Preservation - No filters, no edits, visually identical
              : "brightness-[0.96] contrast-[0.70] saturate-[0.85]"
          }`}
        />
      </div>

      {/* 2. Soft rose gold diffuse vignette & satin glaze */}
      {!isHomeScreen && (
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-[#6c3a44]/6 via-transparent to-[#ffffff]/20 mix-blend-overlay" 
          style={{
            boxShadow: "inset 0 0 140px rgba(135,75,85,0.18)"
          }}
        />
      )}
      
      {/* 3. Smooth warm rose gold photo treatment */}
      {!isHomeScreen && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#caa28f]/4 to-[#5a3a41]/5 mix-blend-multiply" />
      )}

      {/* 4. Luxury Haze overlay - Soft focus and enhanced readability */}
      {!isHomeScreen && (
        <div 
          className="absolute inset-0 z-3 pointer-events-none transition-all duration-1000 bg-[#fff6f8]/25 backdrop-blur-[4.5px]"
          style={{
            boxShadow: "inset 0 0 120px rgba(255,248,249,0.35)"
          }}
        />
      )}

      {/* 5. Fine Rose Gold Chains & Draping Pearls: Suppressed on landing page to maintain composition pixel-for-pixel */}
      {!isHomeScreen && (
        <>
          {/* Fine Rose Gold Chains intertwined with pearls (Rendering actual SVG catenary lines) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 select-none z-1" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Left Side draped chain helper */}
            <path
              d="M -3,-2 Q 13,50 -3,102"
              fill="none"
              stroke="#e5b842"
              strokeWidth="0.32"
              strokeDasharray="0.6 1.2"
            />
            <path
              d="M -1,-2 Q 15,50 -1,102"
              fill="none"
              stroke="#df9ca8"
              strokeWidth="0.2"
            />
            {/* Right Side draped chain helper */}
            <path
              d="M 103,-2 Q 87,50 103,102"
              fill="none"
              stroke="#e5b842"
              strokeWidth="0.32"
              strokeDasharray="0.6 1.2"
            />
            <path
              d="M 101,-2 Q 85,50 101,102"
              fill="none"
              stroke="#df9ca8"
              strokeWidth="0.2"
            />
          </svg>

          {/* Draping Pearls around all screen edges */}
          <div className="absolute inset-0 z-2 overflow-hidden opacity-30">
            {/* Render Left strand */}
            {leftPearlStrand.map((p, idx) => (
              <Pearl
                key={`left-pearl-${idx}`}
                size={p.size}
                className="absolute"
                style={{
                  left: p.x,
                  top: p.y,
                  transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                }}
              />
            ))}
            {/* Render Right strand */}
            {rightPearlStrand.map((p, idx) => (
              <Pearl
                key={`right-pearl-${idx}`}
                size={p.size}
                className="absolute"
                style={{
                  left: p.x,
                  top: p.y,
                  transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* 6. Background macro jewelry dust glint lens sparkles */}
      {!isHomeScreen && (
        <div className="absolute inset-0 z-3 pointer-events-none">
          {looseSparkles.map((sparkle, i) => (
            <div
              key={`loose-sparkle-${i}`}
              className="absolute pointer-events-none mix-blend-screen opacity-0 animate-[macroFlicker_6s_ease-in-out_infinite]"
              style={{
                top: sparkle.top,
                left: sparkle.left,
                animationDelay: sparkle.delay,
                transform: "scale(0.55)",
              }}
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute w-[14px] h-[0.8px] bg-white rounded-full blur-[0.2px] shadow-[0_0_5px_white]" />
                <div className="absolute w-[0.8px] h-[14px] bg-white rounded-full blur-[0.2px] shadow-[0_0_5px_white]" />
                <div className="absolute w-[4px] h-[4px] bg-white rotate-45 transform blur-[0.2px]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GemsAndPearls;
