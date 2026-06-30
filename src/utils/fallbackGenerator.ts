// Highly detailed fallback generation engine based on user selected answers
// Returns luxurious human-curated visual direction guidelines

export interface FallbackData {
  phrases: string[];
  isFallback: boolean;
  moodSummary: string;
  palette: Array<{ name: string; hex: string; role?: string }>;
  textures: string[];
  composition: string;
  dos: string[];
  doNots: string[];
  emojis?: string[];
  explanation?: string;
  moodLine?: string;
  blueprint?: {
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
  };
}

export function generateFallbackResult(
  mode: "visual" | "signature" | "fingerprints" | "color",
  selections: Record<string, string[]>
): FallbackData {
  if (mode === "color") {
    const selectedBehaviors = selections["color_behavior"] || [];
    const selectedTones = selections["emotional_tone"] || [];
    const selectedAnchors = selections["color_anchor"] || [];
    
    let moodLine = "An unhurried sanctuary of slow-shifting color, grounded in heavy earth and ancient silence.";
    if (selectedTones.join(" ").toLowerCase().includes("dark") || selectedBehaviors.join(" ").toLowerCase().includes("deep")) {
      moodLine = "A shadowed world where heavy obsidian anchors meet warm, flickering amber low light.";
    } else if (selectedBehaviors.join(" ").toLowerCase().includes("soft") || selectedTones.join(" ").toLowerCase().includes("surreal")) {
      moodLine = "A mist-shrouded quiet dawn of pale bone grey, velvet rose, and gentle soft blush pink reflection.";
    }

    const palette = [
      { name: "Raw Obsidian", hex: "#0B0C10", role: "depth" },
      { name: "Soft Blush Pink", hex: "#F4CCD8", role: "anchor" },
      { name: "Whisper Pearl", hex: "#F3EFEC", role: "contrast" },
      { name: "Dappled Olive", hex: "#4E584A", role: "neutral" },
      { name: "Soft Blush", hex: "#E9C0B3", role: "accent" },
      { name: "Dusty Peony", hex: "#C28B9C", role: "neutral" },
      { name: "Slate Grey", hex: "#5C6B73", role: "contrast" },
      { name: "Deep Charcoal", hex: "#1F2421", role: "depth" }
    ];

    return {
      phrases: [],
      isFallback: true,
      moodSummary: moodLine,
      moodLine,
      palette,
      textures: ["Washed linen weaves", "Aged pearl finishes with soft matte cream-white edges"],
      composition: "Center-weighted flatlay framing.",
      dos: ["Allow generous negative areas", "Blend soft blush pink lowlight with heavy base neutrals"],
      doNots: ["Do not use highly saturated artificial neon gradients", "Avoid sterile corporate primary tones"]
    };
  }

  // Extract selections or set defaults
  const selectedFeels = selections["feel"] || selections["essence"] || [];
  const selectedSpaces = selections["space"] || selections["symbol"] || [];
  const selectedColors = selections["color"] || selections["form"] || [];
  const selectedLights = selections["light"] || selections["placement"] || [];
  const selectedEnergies = selections["energy"] || [];
  const selectedExcludes = selections["exclude"] || [];

  // 1. DETERMINE MOOD SUMMARY based on selected feel/essence
  let moodSummary = "A timeless archive of quiet, luxury heirloom elements with nostalgic warmth.";
  const feelStr = selectedFeels.join(" ").toLowerCase();

  if (feelStr.includes("calm") || feelStr.includes("still")) {
    moodSummary = "A serene sanctuary of slow-living, whisper-soft tones, and deliberate stillness where nothing is rushed.";
  } else if (feelStr.includes("controlled") || feelStr.includes("intentional")) {
    moodSummary = "An architecture of precision, edited symmetric composition, and high-contrast, premium balance.";
  } else if (feelStr.includes("nostalgic") || feelStr.includes("memory")) {
    moodSummary = "A wistful romantic dream of vintage grain, faded satin fabrics, and warm, delicate heirloom memories.";
  } else if (feelStr.includes("cinematic") || feelStr.includes("unfold")) {
    moodSummary = "A filmic visual narrative framed with deep letterboxing shadows, dynamic focal planes, and high emotional resonance.";
  } else if (feelStr.includes("dark") || feelStr.includes("heavy")) {
    moodSummary = "An elegant, velvet melancholia characterized by rich, heavy low-key contrast and moody, poetic shadows.";
  } else if (feelStr.includes("sharp") || feelStr.includes("minimal")) {
    moodSummary = "A pristine display of sharp physical contrasts, absolute negative space, and architectural purity.";
  } else if (feelStr.includes("mystery") || feelStr.includes("reveal")) {
    moodSummary = "An enigmatic, quiet curation that reveals details slowly through deep gradients, shadows, and subtle textures.";
  } else if (feelStr.includes("transformation")) {
    moodSummary = "A shimmering, ephemeral narrative of light play, refractive prisms, and crystalline transitions.";
  }

  // 2. GENERATE LUXURY VISUAL PALETTE based on Color or Form/Placement selections
  let palette: Array<{ name: string; hex: string }> = [
    { name: "Blush Satin", hex: "#fbf5f2" },
    { name: "Rose Gold", hex: "#E9C3CF" },
    { name: "Antique Filigree", hex: "#8A3A5C" },
    { name: "Deep Orchid shadow", hex: "#3a121d" }
  ];

  const colorStr = selectedColors.join(" ").toLowerCase();
  if (colorStr.includes("saturated") || colorStr.includes("jewel")) {
    palette = [
      { name: "Royal Plum", hex: "#3F0D16" },
      { name: "Garnet Ruby", hex: "#7E1F27" },
      { name: "Burnished Brass", hex: "#D4AF37" },
      { name: "Ink Shadow", hex: "#0F141D" }
    ];
  } else if (colorStr.includes("muted") || colorStr.includes("earth")) {
    palette = [
      { name: "Warm Ochre", hex: "#DFD3C3" },
      { name: "Rustic Linen", hex: "#C7B198" },
      { name: "Driftwood", hex: "#856046" },
      { name: "Charred Clay", hex: "#483629" }
    ];
  } else if (colorStr.includes("monochrome") || colorStr.includes("black")) {
    palette = [
      { name: "Chalk Alabaster", hex: "#f9f9f9" },
      { name: "Cool Gravel", hex: "#E4E4E7" },
      { name: "Deep Charcoal", hex: "#4B5563" },
      { name: "Velvet Obsidian", hex: "#09090B" }
    ];
  } else if (colorStr.includes("pastel") || colorStr.includes("washed")) {
    palette = [
      { name: "Washed Peony", hex: "#FFF1F2" },
      { name: "Powdered Iris", hex: "#F3E8FF" },
      { name: "Mist Glaze", hex: "#E0F2FE" },
      { name: "Soft Sage", hex: "#F0FDF4" }
    ];
  } else if (colorStr.includes("iridescent") || colorStr.includes("shimmer") || colorStr.includes("woven")) {
    palette = [
      { name: "Mother of Pearl", hex: "#FAF5F0" },
      { name: "Blush Shimmer", hex: "#F3A9C8" },
      { name: "Polished Rose Gold", hex: "#C28b9c" },
      { name: "Rich Crimson", hex: "#5C1F30" }
    ];
  } else if (colorStr.includes("sepia") || colorStr.includes("warmth")) {
    palette = [
      { name: "Faded Tea", hex: "#f1e7d0" },
      { name: "Antique Vellum", hex: "#DFC5A3" },
      { name: "Warm Ochre", hex: "#AD8463" },
      { name: "Espresso Ground", hex: "#2b1b13" }
    ];
  }

  // 3. TEXTURE AND MATERIAL DIRECTION
  let textures: string[] = ["Blush natural linen weaves", "Fine-gauge matte paper surfaces", "Soft architectural stone moldings"];
  const spaceStr = selectedSpaces.join(" ").toLowerCase();

  if (spaceStr.includes("candlelit") || spaceStr.includes("flickering")) {
    textures = ["Warm beeswax pools", "Highly tactile heavy velvet fabrics", "Aged gold leaf with hand-burnished edges"];
  } else if (spaceStr.includes("sun-drenched") || spaceStr.includes("window")) {
    textures = ["Sheer breathable washed silk", "Raw untreated white oak grain", "Cast structural concrete with subtle pitting"];
  } else if (spaceStr.includes("archival") || spaceStr.includes("old") || spaceStr.includes("libraries")) {
    textures = ["Cracked vellum and heirloom leather binding", "Atmospheric gold-flecked paper scroll", "Aged brass locks and iron keys"];
  } else if (spaceStr.includes("wild") || spaceStr.includes("nature")) {
    textures = ["Fissured slate wet with spring droplets", "Dappled moss on raw granite rock", "Wild fibrous dried root weaves"];
  } else if (spaceStr.includes("coastal") || spaceStr.includes("horizon")) {
    textures = ["Coarse wave-swept silica sand", "Brushed sea-salt encrusted teakwood", "Refractive sea-glass fragments"];
  } else if (spaceStr.includes("nocturnal") || spaceStr.includes("night")) {
    textures = ["Wet polished basalt tiles", "Gleaming smooth dark metallics", "Ribbed industrial wire glass panels"];
  } else if (mode === "signature" || mode === "fingerprints") {
    textures = ["Indented heavy cardpress paper", "Melted ruby red luxury wax seal stamp texture", "Etched rose-gold copperplate line grooves"];
  }

  // 4. COMPOSITION DIRECTION based on Energy or Placement
  let composition = "Shoot tightly from a slightly high angle to isolate key focal points with deliberate margins.";
  const energyStr = selectedEnergies.join(" ").toLowerCase();
  const placementStr = selectedLights.join(" ").toLowerCase();

  if (energyStr.includes("frozen") || energyStr.includes("stillness")) {
    composition = "Absolute static symmetry. Align keys and elements perfectly flat on a clean surface with zero perspective distortion.";
  } else if (energyStr.includes("unhurried") || energyStr.includes("slow")) {
    composition = "Extremely narrow depth of field, focused gently on a single thread or edge, allowing elements to drop into a soft blur.";
  } else if (energyStr.includes("coiled") || energyStr.includes("tension")) {
    composition = "Dynamic diagonal intersections, catching items trailing off the edge of the frame to suggest unseen narratives.";
  } else if (energyStr.includes("fluid") || energyStr.includes("water")) {
    composition = "Graceful sweeping S-curves. Arrange pearl jewelry or satin folds in cascading loops across the composition field.";
  } else if (placementStr.includes("center")) {
    composition = "Bullseye center-weighted framing. Frame the high-contrast subject completely locked in the middle of a generous empty space.";
  }

  // 5. DO / DO NOT LIST based on Exclude selections
  const excludeStr = selectedExcludes.join(" ").toLowerCase();
  let dos = ["Focus on raw physical materials with rich, touchable micro-details.", "Utilize romantic, low-diffusion ambient lighting.", "Maintain generous blank negative borders."];
  let doNots = ["Do not use modern grid dividers or neon synthetic gradients.", "Avoid flat vector renders or machine-like geometric blocks.", "Avoid default stark black-on-white text formats without custom tracking."];

  if (excludeStr.includes("corporate")) {
    dos.push("Utilize organic organic-shapes and worn, antique patinas.");
    doNots.push("Never use vector wireframes, sterile plastic surfaces, or white stock models.");
  }
  if (excludeStr.includes("cluttered")) {
    dos.push("Restrict your frame to maximum 1-2 hero artifacts surrounded by quiet, empty space.");
    doNots.push("Do not pack secondary trinkets or complex accessory collages in the corners.");
  }
  if (excludeStr.includes("cute") || excludeStr.includes("childish")) {
    dos.push("Incorporate sharp metal filigree, high-contrast shadow values, and mature, ancient typography.");
    doNots.push("Do not use saturated soft round shapes, pastel cartoons, or childish handwritten accents.");
  }
  if (excludeStr.includes("trend-chasing") || excludeStr.includes("meme")) {
    dos.push("Ground your visual concepts in centuries-old heirloom history, fine books, and classical museums.");
    doNots.push("Never adopt temporary interface fads, smartphone frames, or high-flicker digital overlays.");
  }

  // 6. GENERATE PIN_SEARCH PHRASES
  let phrases: string[] = [];
  if (mode === "visual") {
    phrases = [
      "dappled light blush satin fabrics",
      "antique rose gold pocket watch filigree",
      "vintage handheld mirror lipstick sketch",
      "luminous heirloom pearl necklace draping",
      "romantic vanity table warm candlelit haze",
      "soft luxury perfume bottle reflection",
      "historical archival papers vintage books",
      "curated flatlay dried rose petals gold",
      "nostalgic feminine bedroom photographic study",
      "polished brass jewelry drawer detail",
      "soft focused rose gold hand mirror close",
      "classical portraiture lighting soft texture"
    ];
  } else if (mode === "signature") {
    phrases = [
      "vintage wax seal stamp custom crest png",
      "antique gold ornate monogram ornament sticker",
      "fine linocut heart and roses emblem icon",
      "rose gold continuous line eye motif graphic",
      "hand drawn historical frame border elements",
      "classic heraldic shield compass stamp vector",
      "botanical moth ink illustration stamp overlay",
      "luxury brass watch face engraving mockup",
      "bohemian celestial stars ink stamp design",
      "delicate line jewelry chain emblem watermark",
      "textured gold leaf wax brand emblem",
      "minimalist vintage keys linocut block print"
    ];
  } else {
    // fingerprints
    phrases = [
      "vintage pocket watch sticker icon blush background",
      "rose gold key charm clip art png",
      "luminous single drop pearl jewelry sketch",
      "antique mirror frame line art ornament"
    ];
  }

  // 7. SPECIFIC EMOJIS FOR FINGERPRINTS fallback
  let emojis = ["🕯️", "🪞", "🗝️", "🌹", "📜"];
  let explanation = "Your fingerprint is a locked gate of nostalgic secrets. The candle illuminates hidden chambers while the mirror reflects true desire, sealed with a classic velvet rose.";

  const symStr = selectedSpaces.join(" ").toLowerCase();
  
  if (symStr.includes("fire") || symStr.includes("flame")) {
    emojis = ["🔥", "🕯️", "✨", "❤️"];
    explanation = "A blazing beacon of continuous internal transformation, drawing seekers in like moths to an ancient warm hearth.";
  } else if (symStr.includes("mirror") || symStr.includes("eye")) {
    emojis = ["🪞", "👁️", "✨", "🦢"];
    explanation = "An absolute reflective lens of recognition. Clear, uncluttered, seeing truth beneath surface styling.";
  } else if (symStr.includes("heart") || symStr.includes("vein")) {
    emojis = ["❤️", "🥀", "🩸", "🏛️"];
    explanation = "Raw, beautiful emotional courage. Heavy organic undertones paired with ancient structural security.";
  } else if (symStr.includes("key") || symStr.includes("lock")) {
    emojis = ["🗝️", "🔒", "📜", "🕰️"];
    explanation = "Custodian of centuries-old knowledge. Classic thresholds locked to passing trends, open only to intent.";
  } else if (symStr.includes("moon") || symStr.includes("star")) {
    emojis = ["🌙", "🌌", "✨", "🔮"];
    explanation = "Nocturnal quiet magic. A lunar presence that pulls the tides of memory without demanding focus.";
  } else if (symStr.includes("rose") || symStr.includes("thorn")) {
    emojis = ["🌹", "🥀", "⚜️", "✉️"];
    explanation = "A romantic double-edged truth. Beautiful visual harmony guarded by extremely sharp boundaries.";
  } else if (symStr.includes("smoke") || symStr.includes("mist")) {
    emojis = ["💨", "🌫️", "🍂", "🕯️"];
    explanation = "The quiet hum of ephemeral dust. Present but fading into mist, leaving only a lingering sensory mark.";
  }

  // 8. CONSTRUCT FALLBACK CURATION BLUEPRINT FOR PORTFOLIO DISPLAY
  let dirType = "grounded";
  let dirMeaning = "A world that feels solid, real, textured, and deeply tangible. Controls: natural elements, organic textures (wood, stone, coarse fabric), physical weight, raw materials.";
  let dirExists = "Pristine physical artifacts, rough wooden boards, worn iron keys, linen cloth, natural cast shadows.";
  let dirNotBelong = "Digital interfaces, clean geometric lines, highly polished plastics, vector drawings, bright light leaks.";
  const feelLower = feelStr;
  
  if (feelLower.includes("calm") || feelLower.includes("still")) {
    dirType = "minimal";
    dirMeaning = "A world stripped of excess, focusing purely on empty space, structure, and singular elements. Controls: high negative space, clean lines, singular subjects, high focus, silence.";
    dirExists = "Singular central object, vast empty cream backgrounds, quiet direct sunlight, soft cast shadow.";
    dirNotBelong = "Complex collages, multiple conflicting textures, heavy dark gradients, decorative borders.";
  } else if (feelLower.includes("controlled") || feelLower.includes("intentional")) {
    dirType = "controlled";
    dirMeaning = "A world where everything is strictly composed, deliberate, and geometrically aligned. Controls: symmetry, order, pristine placement, zero random elements.";
    dirExists = "Symmetrical placements, centered items, micro-focused macro lenses, clean metal bezels, matching color roles.";
    dirNotBelong = "Draped random folds, messy spills, tilted text, hand-drawn scribbles, uneven lighting.";
  } else if (feelLower.includes("surreal") || feelLower.includes("off")) {
    dirType = "surreal";
    dirMeaning = "A world where reality is altered, magical, dreamlike, or slightly distorted. Controls: impossible physics, uncanny light source, symbolic objects in unusual contexts, dream states.";
    dirExists = "Prism light refractions, floating dust particles, mirrors showing impossible angles, double-exposure shadows.";
    dirNotBelong = "Stark real-world stock environments, flat clinical lighting, boring everyday kitchen setups.";
  } else if (feelLower.includes("nostalgic") || feelLower.includes("memory") || feelLower.includes("romantic")) {
    dirType = "nostalgic";
    dirMeaning = "A world that feels like a specific memory, decades past, or faded warmth. Controls: grain, sepia tones, light leaks, soft focus, retro objects, vintage warmth.";
    dirExists = "Dust motes in light beams, faded satin, aged brass filigree, tea-stained book edges, warm candle glow.";
    dirNotBelong = "Fluorescent light tubes, smartphone frames, clean modern steel, crisp digital resolution.";
  }

  const blueprint = {
    worldDirection: {
      type: dirType,
      meaning: dirMeaning,
      exists: dirExists,
      doesNotBelong: dirNotBelong,
      repeats: "The repetition of a single key material (wax, metal, or raw fibers) with continuous geometry.",
      breaks: "Using bright plastic surfaces, modern digital devices, or pure high-frequency neon lights."
    },
    environment: {
      spaces: spaceStr.length > 0 ? `Spaces of type: ${spaceStr}` : "Intimate architectural alcoves, warm sunlit libraries, and quiet stone surfaces.",
      emotionalTone: feelLower.length > 0 ? `A feeling of ${feelLower}` : "Quiet, nostalgic sanctuary where everything is held in soft tension.",
      worldVsBackground: "World means the entire system of recurring objects and rules, not just a simple environment background image."
    },
    visualLanguage: {
      colorBehavior: colorStr.length > 0 ? `Color behavior is ${colorStr}` : "Restrained. Soft muted tones washed with warm candlelight or light grey.",
      tone: "Quietly emotional, deeply personal, and classical.",
      energy: energyStr.length > 0 ? `Energy moves as ${energyStr}` : "Unhurried, slow-paced stillness with delicate micro-vibrations.",
      styling: "Heirloom jewelry, fine natural textiles, soft leather, and gold engravings.",
      lighting: "Golden Hour diffusing or warm flickering candlelight casting long, soft-edged shadows.",
      repeatingColors: "Soft blush pink (#F4CCD8) paired with heavy base charcoal or antique brass gold.",
      environmentType: "Quiet interior vanity table, rustic desk, or museum alcove with stable horizons.",
      composition: composition,
      emotionalFeel: "The unified soul of an archival sanctuary that makes everything look like a saved treasure.",
      colorsThatBreak: "Artificial high-saturation neons, corporate neon cyan, and sterile plastic whites.",
      notBelongVisual: "Low-resolution memes, cartoon cliparts, stock vector templates, and modern screens."
    }
  };

  return {
    phrases,
    isFallback: true,
    moodSummary,
    palette,
    textures,
    composition,
    dos,
    doNots,
    emojis,
    explanation,
    blueprint
  };
}
