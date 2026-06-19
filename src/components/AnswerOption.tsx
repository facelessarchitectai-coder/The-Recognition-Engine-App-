import React from "react";

// Real-world high-fidelity generated jewelry photography assets
import brilliantDiamondImg from "../assets/images/brilliant_diamond_1781750876333.jpg";
import roseGemstoneImg from "../assets/images/rose_gemstone_1781750892234.jpg";
import pearlNecklaceImg from "../assets/images/pearl_necklace_1781750905009.jpg";

export interface AnswerOptionProps {
  id: string;
  label: string;
  selected: boolean;
  onToggle: () => void;
  index?: number;
  key?: string | number;
  isColorMode?: boolean;
}

export function AnswerOption({ id, label, selected, onToggle, isColorMode = false }: AnswerOptionProps) {
  const filigreeColor = isColorMode ? "#F4CCD8" : "#d4b053";
  const prongColor = isColorMode ? "#F4CCD8" : "#e5b842";
  const highlightColor = isColorMode ? "#F4CCD8" : "#d8b043";
  const ringBorderColor = isColorMode ? "rgba(244, 204, 216, 0.75)" : "rgba(212, 176, 83, 0.7)";

  return (
    <button
      id={`option-${id}`}
      onClick={onToggle}
      className={`relative w-full text-left py-4.5 px-6 rounded-[22px] transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer select-none group backdrop-blur-[14px] overflow-visible border-0
        ${
          selected
            ? "shadow-[0_8px_24px_rgba(110,30,45,0.14)] scale-[1.01]"
            : "shadow-[0_4px_16px_rgba(110,30,45,0.03)] hover:scale-[1.002]"
        }
      `}
      style={{
        background: selected
          ? "linear-gradient(135deg, rgba(255, 248, 246, 0.94) 0%, rgba(255, 236, 232, 0.86) 100%)"
          : "linear-gradient(135deg, rgba(255, 252, 250, 0.72) 0%, rgba(255, 242, 238, 0.52) 100%)",
        boxShadow: selected
          ? `inset 0 1px 3px rgba(255,255,255,1), 0 6px 20px rgba(110,30,45,0.12), 0 0 0 1.5px ${ringBorderColor}`
          : "inset 0 1px 2px rgba(255,255,255,0.85), 0 4px 14px rgba(110,30,45,0.03), 0 0 0 1.2px rgba(255,255,255,0.65)",
      }}
    >
      {/* Premium Shimmer effect on hover */}
      <div className="absolute inset-0 rounded-[22px] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.6s_infinite] pointer-events-none z-0 overflow-hidden" />

      {/* LEFT & TOP CORNER TINY EMBELLISHMENT (very subtle micro pearl element) */}
      <div className="absolute top-[-2px] left-8 pointer-events-none flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        {/* Micro Pearl (3.5px) */}
        <div className="w-[4px] h-[4px] rounded-full overflow-hidden shadow-[0.5px_0.5px_1px_rgba(92,31,48,0.2)] border-[0.2px] border-white/40 shrink-0">
          <img src={pearlNecklaceImg} alt="Micro Pearl" className="w-full h-full object-cover scale-[1.5]" />
        </div>
        {/* Diamond Micro Sparkle */}
        <div className="w-[3px] h-[3px] rounded-full overflow-hidden shrink-0">
          <img src={brilliantDiamondImg} alt="Dust" className="w-full h-full object-cover scale-150 rotate-[25deg]" />
        </div>
      </div>

      {/* 
        HYPER-DETAILED NATURAL JEWELRY CLUSTER (Inspired by Reference Image 1)
        A highly realistic miniature jewelry composition instead of separate decorations
      */}
      <div className="absolute right-[14px] bottom-[-4px] pointer-events-none w-[110px] h-[54px] overflow-visible z-10 select-none">
        <div className="relative w-full h-full">

          {/* 1. Underlying Gold Filigree Setting Wires (Prong frameworks integrating the jewels) */}
          <svg className="absolute inset-0 w-full h-full opacity-65" viewBox="0 0 110 54" fill="none">
            {/* Fine handcast gold wires and prongs holding the cluster together */}
            <path d="M45,41 C54,34 68,36 82,24" stroke={filigreeColor} strokeWidth="0.85" />
            <path d="M68,36 C80,38 90,30 96,16" stroke={filigreeColor} strokeWidth="0.75" strokeDasharray="1.5 1" />
            
            {/* Tiny gold prongs/bezel points supporting each faceted gemstone */}
            <circle cx="58" cy="18" r="1.1" fill={prongColor} />
            <circle cx="82" cy="12" r="1.1" fill={prongColor} />
            <circle cx="92" cy="22" r="1" fill={prongColor} />
            <circle cx="70" cy="32" r="1.1" fill={prongColor} />
          </svg>
          
          {/* 2. Top-Left Faceted Marquise Pink Gemstone (Rose Emerald, 13px) */}
          {/* Overlaps gold setting wires and nestles with pearls */}
          <div 
            className="absolute right-[46px] bottom-[16px] w-[13px] h-[13px] rounded-full overflow-hidden shadow-[1px_2px_4px_rgba(110,30,45,0.22)] border-[0.4px] border-white/40"
            style={{
              transform: "rotate(28deg)",
              clipPath: "polygon(50% 0%, 90% 30%, 90% 70%, 50% 100%, 10% 70%, 10% 30%)",
            }}
          >
            <img src={roseGemstoneImg} alt="Statement Pink Diamond" className="w-full h-full object-cover scale-[1.3] rotate-[10deg]" />
          </div>

          {/* 3. Medium-Left White Luster Pearl (10px) */}
          {/* Partially overlapping the pink gem's base, adding natural depth */}
          <div 
            className="absolute right-[33px] bottom-[8px] w-[11px] h-[11px] rounded-full shadow-[1.5px_2.5px_5px_rgba(110,30,45,0.18),_inset_-1px_-1px_2.5px_rgba(0,0,0,0.1)] border-[0.4px] border-white/45 overflow-hidden"
          >
            <img src={pearlNecklaceImg} alt="Pearl Texture" className="w-full h-full object-cover scale-[1.3] object-center" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/30 pointer-events-none" />
            <div className="absolute top-[10%] left-[12%] w-[3px] h-[3px] rounded-full bg-white/70 blur-[0.2px]" />
          </div>

          {/* 4. CENTRAL MASTER STATEMENT PEARL (16px) with absolute high luxury luster */}
          {/* Overlaps the smaller pearls and the gold prongs, commanding the cluster center */}
          <div 
            className="absolute right-[18px] bottom-[5px] w-[16px] h-[16px] rounded-full shadow-[2.5px_3.5px_7.5px_rgba(110,30,45,0.26),_inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.12)] border-[0.4px] border-white/50 transition-transform duration-350 group-hover:scale-[1.04] overflow-hidden"
          >
            <img src={pearlNecklaceImg} alt="Master Heirloom Pearl" className="w-full h-full object-cover scale-[1.4] object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/35 pointer-events-none" />
            {/* Concentrated photography glint reflecting light source */}
            <div className="absolute top-[12%] left-[15%] w-[4px] h-[4px] rounded-full bg-white/80 blur-[0.3px]" />
          </div>

          {/* Gold pendant attachment bail cap holding the Central Pearl onto the wires */}
          <div 
            className="absolute right-[24px] bottom-[19px] w-[4px] h-[3px] rounded-t-[1.5px] opacity-90 border-t-[0.2px] border-white/20 shadow-[0_0.5px_1px_rgba(0,0,0,0.1)]" 
            style={{ backgroundColor: filigreeColor }}
          />

          {/* 5. Faceted Cushion-Cut Brilliant Diamond with refractive sparkles (10px) */}
          {/* Nestled on the right side, overlapping the master pearl */}
          <div 
            className="absolute right-[6px] bottom-[12px] w-[11px] h-[11px] rounded-full overflow-hidden shadow-[1px_2px_4px_rgba(0,0,0,0.18)] border-[0.3px] border-white/40"
            style={{
              transform: "rotate(38deg)",
              clipPath: "polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)", // elegant brilliant facet
            }}
          >
            <img src={brilliantDiamondImg} alt="Faceted Cushion Diamond" className="w-full h-full object-cover scale-[1.45] rotate-[20deg]" />
          </div>

          {/* 6. Realistic Sparkling Lens Flare reflecting on the cushion diamond's peak */}
          <div className="absolute right-[9px] bottom-[19px] w-4 h-4 flex items-center justify-center pointer-events-none select-none">
            <div className="absolute w-[10px] h-[0.7px] bg-white rounded-full blur-[0.2px] shadow-[0_0_4px_white] animate-[pulse_1.5s_infinite_alternate]" />
            <div className="absolute w-[0.7px] h-[10px] bg-white rounded-full blur-[0.2px] shadow-[0_0_4px_white] animate-[pulse_1.5s_infinite_alternate]" />
          </div>

        </div>
      </div>

      {/* Main content wrapper with padding protecting the text from overlapping the jewelry cluster */}
      <div className="flex items-center gap-4 w-full pr-[105px] sm:pr-[115px] relative z-20">
        {/* Custom luxury radio indicator containing a sparkling diamond inside */}
        <div
          className={`w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center transition-all duration-300 overflow-hidden
            ${selected ? `border bg-white/10` : "border-[1.5px] border-[#caa28f]/60 bg-white/30"}
          `}
          style={selected ? {
            borderColor: highlightColor,
            boxShadow: isColorMode ? "0 2px 8px rgba(244, 204, 216, 0.45)" : "0 2px 8px rgba(216, 176, 67, 0.35)"
          } : undefined}
        >
          {selected ? (
            /* Selected state displays an actual refractive cushion cut diamond */
            <img src={brilliantDiamondImg} alt="Diamond active" className="w-full h-full object-cover scale-[1.45] rotate-[15deg]" />
          ) : (
            <div className="w-[3px] h-[3px] rounded-full bg-black/15 opacity-50" />
          )}
        </div>

        {/* Label: exquisite high contrast black serif typography */}
        <span className="text-black font-serif text-[15.5px] leading-snug font-medium select-none text-left tracking-wide">
          {label}
        </span>
      </div>

      {/* Decorative tiny corner gold point (extremely subtle micro aesthetic detail) */}
      <div className="absolute right-3.5 top-3.5 pointer-events-none opacity-30 group-hover:opacity-75 transition-opacity duration-200">
        <div 
          className="w-1 h-1 rotate-45 transform" 
          style={{ backgroundColor: highlightColor }}
        />
      </div>
    </button>
  );
}

export default AnswerOption;
