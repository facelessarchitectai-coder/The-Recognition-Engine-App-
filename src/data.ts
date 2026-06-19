export interface Question {
  id: string; // feel, space, color, light, energy, exclude, essence, symbol, form, placement
  stepName: string; // FEEL, SPACE, COLOR, etc. All Caps
  title: string;
  subtitle: string;
  options: string[];
}

export const VISUAL_DIRECTION_STEPS = ["FEEL", "SPACE", "COLOR", "LIGHT", "ENERGY", "EXCLUDE", "REFERENCES"];
export const SIGNATURE_MARK_STEPS = ["ESSENCE", "SYMBOL", "FORM", "PLACEMENT", "EXCLUDE", "REFERENCES"];
export const FINGERPRINTS_STEPS = ["ESSENCE", "ENERGY", "SYMBOLS", "EXCLUDE"];

export const VISUAL_DIRECTION_QUESTIONS: Question[] = [
  {
    id: "feel",
    stepName: "FEEL",
    title: "How does this world feel before anyone can name it?",
    subtitle: "Not the aesthetic. The feeling underneath it.",
    options: [
      "Calm. Still. Like nothing is rushing.",
      "Controlled. Intentional. Everything placed with purpose.",
      "Tense. Like something is about to shift.",
      "Nostalgic. Like a memory you can’t fully place.",
      "Cinematic. Like you’re watching something unfold.",
      "Dark. Heavy. Emotionally layered.",
      "Sharp. Clean. Minimal.",
      "Surreal. Like reality is slightly off."
    ]
  },
  {
    id: "space",
    stepName: "SPACE",
    title: "What kind of space does this world live inside?",
    subtitle: "The architecture your content would exist in, if it were real.",
    options: [
      "Candlelit. Interiors that hold their breath.",
      "Sun-drenched. Light pouring through every window.",
      "Minimal. A studio with nothing extra in it.",
      "Archival. Old libraries, paper, dust in the light.",
      "Wild. Nature that hasn’t been arranged for anyone.",
      "Industrial. Concrete and steel left exposed.",
      "Coastal. Air and horizon with nothing in between.",
      "Nocturnal. A city that only wakes up at night."
    ]
  },
  {
    id: "color",
    stepName: "COLOR",
    title: "How does color move through this world?",
    subtitle: "Not your palette. How color behaves once it’s there.",
    options: [
      "Saturated. Jewel tones that don’t apologize.",
      "Muted. Earth tones worn soft with time.",
      "Monochrome. Black and white with nothing between.",
      "Pastel. Color washed almost to memory.",
      "Iridescent. Metal and shimmer catching the light.",
      "Restrained. One color allowed to speak.",
      "Sepia. Warmth that feels decades old.",
      "Desaturated. Cool tones pulled back from full color."
    ]
  },
  {
    id: "light",
    stepName: "LIGHT",
    title: "How does light move through this world?",
    subtitle: "The light source that would shape everything else.",
    options: [
      "Golden. The hour everything looks forgiven.",
      "Harsh. Shadows cut clean and deliberate.",
      "Diffused. Haze that softens every edge.",
      "Flickering. Candlelight that never sits still.",
      "Lunar. Cool blue light with no warmth in it.",
      "Clinical. Bright and even, nothing hidden.",
      "Dappled. Light broken apart by leaves or lattice.",
      "Electric. Neon that hums against the dark."
    ]
  },
  {
    id: "energy",
    stepName: "ENERGY",
    title: "How much does this world move?",
    subtitle: "Stillness and motion both say something.",
    options: [
      "Frozen. Nothing in the frame is allowed to move.",
      "Unhurried. Motion so slow it reads as stillness.",
      "Coiled. Tension right before something happens.",
      "Restless. A quiet hum of constant small motion.",
      "Explosive. Energy that breaks the frame open.",
      "Fluid. Everything moving like water finds a path.",
      "Staccato. Sharp, broken, deliberate motion.",
      "Weightless. Drifting like gravity is optional."
    ]
  },
  {
    id: "exclude",
    stepName: "EXCLUDE",
    title: "What should this never feel like?",
    subtitle: "What you eliminate keeps it from blending into everyone else’s.",
    options: [
      "Corporate. Sterile enough to be anyone’s.",
      "Trend-chasing. Trying too hard to be current.",
      "Cute. Soft to the point of childish.",
      "Cluttered. Too much competing for attention.",
      "Cold. Polished until it stops feeling human.",
      "Generic. Indistinguishable from any stock photo.",
      "Loud. Chaotic without meaning to be.",
      "Heavy. Sad in a way that drains the room."
    ]
  }
];

export const SIGNATURE_MARK_QUESTIONS: Question[] = [
  {
    id: "essence",
    stepName: "ESSENCE",
    title: "If your identity had one core truth, what is it?",
    subtitle: "Not your niche. The thing underneath everything you make.",
    options: [
      "Transformation. I help people become someone else.",
      "Recognition. I help people see what was already true.",
      "Discipline. I build things that last, brick by brick.",
      "Mystery. I reveal slowly, never all at once.",
      "Permanence. I create things meant to outlast a trend.",
      "Defiance. I exist outside what’s expected."
    ]
  },
  {
    id: "symbol",
    stepName: "SYMBOL",
    title: "Which object family feels like an extension of you?",
    subtitle: "This becomes the seed of your mark, not the final image.",
    options: [
      "Keys, locks, doors — access and thresholds",
      "Eyes, mirrors, lenses — seeing and being seen",
      "Hearts, veins, anatomy — what’s underneath the surface",
      "Globes, maps, compasses — worlds and direction",
      "Crowns, seals, crests — authority and ownership",
      "Knots, chains, threads — connection and binding",
      "Flames, light sources — transformation and exposure",
      "Insects, moths, wings — fragility with intention"
    ]
  },
  {
    id: "form",
    stepName: "FORM",
    title: "How should the mark behave visually?",
    subtitle: "This determines how croppable or hideable it is.",
    options: [
      "Small and repeated — scattered so no single crop removes it",
      "One bold centerpiece — impossible to miss or crop around",
      "Embedded in a corner — present but quiet",
      "Woven into the texture itself — part of the image, not on top of it",
      "Semi-transparent overlay — visible across the whole frame"
    ]
  },
  {
    id: "placement",
    stepName: "PLACEMENT",
    title: "Where does it live on your content?",
    subtitle: "Think about where a screenshot crop usually cuts.",
    options: [
      "Dead center — the part no one crops out",
      "Following the subject — wherever the focal point is",
      "Bottom third — where captions and crops usually leave intact",
      "Repeated at multiple corners — redundant on purpose",
      "Layered into the background, not the foreground"
    ]
  },
  {
    id: "exclude",
    stepName: "EXCLUDE",
    title: "What should this mark never look like?",
    subtitle: "What you eliminate keeps it from blending into everyone else’s.",
    options: [
      "A generic logo or wordmark",
      "Anything trendy or meme-coded",
      "Cartoonish or cutesy",
      "A literal initial or name reference",
      "Something easily mistaken for a filter effect",
      "Overly busy or hard to read at small sizes"
    ]
  }
];

export const FINGERPRINTS_QUESTIONS: Question[] = [
  {
    id: "essence",
    stepName: "ESSENCE",
    title: "If your identity had one core truth, what is it?",
    subtitle: "Not your niche. The thing underneath everything you make.",
    options: [
      "Transformation. I help people become someone else.",
      "Recognition. I help people see what was already true.",
      "Discipline. I build things that last, brick by brick.",
      "Mystery. I reveal slowly, never all at once.",
      "Permanence. I create things meant to outlast a trend.",
      "Defiance. I exist outside what's expected."
    ]
  },
  {
    id: "energy",
    stepName: "ENERGY",
    title: "What energy should this signature carry?",
    subtitle: "This is the feeling someone gets when they see it in your caption or bio.",
    options: [
      "Calm. Still. Quietly confident.",
      "Intense. Dramatic. Hard to ignore.",
      "Warm. Inviting. Personal.",
      "Mysterious. Withholding. Makes people lean in.",
      "Sharp. Clean. No excess.",
      "Romantic. Soft. Emotionally rich."
    ]
  },
  {
    id: "symbol",
    stepName: "SYMBOLS",
    title: "Which symbolic categories feel like you?",
    subtitle: "Your fingerprint pulls from these, not literally, but in spirit.",
    options: [
      "Fire, flame, transformation",
      "Mirrors, eyes, reflection",
      "Hearts, veins, what's underneath",
      "Keys, locks, thresholds",
      "Crowns, seals, ownership",
      "Moons, stars, night",
      "Roses, thorns, beauty with edge",
      "Smoke, mist, things that aren't fully there"
    ]
  },
  {
    id: "exclude",
    stepName: "EXCLUDE",
    title: "What should this signature never feel like?",
    subtitle: "What you eliminate keeps it from reading as generic.",
    options: [
      "Cutesy or cartoonish",
      "Overused or trendy right now",
      "Random — emojis with no connection to each other",
      "Too literal — spelling out your name or niche",
      "Too many emojis to read as one signature"
    ]
  }
];
