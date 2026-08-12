import { EmotionMode, PersonaTheme } from "../types/types";

/**
 * Returns dynamic UI theme styling based on Viji's current emotional persona.
 */
export const getPersonaTheme = (currentEmotion: EmotionMode): PersonaTheme => {
  switch (currentEmotion) {
    case "stress":
      return {
        glow: "from-emerald-500/40 via-teal-500/30 to-blue-600/40",
        border: "border-emerald-500/50 shadow-emerald-500/30",
        badgeBg: "bg-emerald-950/80 border-emerald-700/60 text-emerald-300",
        ring: "border-emerald-500/40",
      };
    case "excited":
      return {
        glow: "from-amber-500/50 via-orange-500/40 to-red-600/50",
        border: "border-orange-400 shadow-orange-500/50",
        badgeBg: "bg-orange-950/80 border-orange-700/60 text-orange-300",
        ring: "border-orange-500/40",
      };
    case "sarcastic":
      return {
        glow: "from-fuchsia-600/50 via-purple-500/40 to-pink-600/50",
        border: "border-pink-400 shadow-pink-500/40",
        badgeBg: "bg-pink-950/80 border-pink-700/60 text-pink-300",
        ring: "border-pink-500/40",
      };
    default:
      return {
        glow: "from-indigo-600/40 via-purple-600/30 to-cyan-500/40",
        border: "border-indigo-500/40 shadow-indigo-500/30",
        badgeBg: "bg-indigo-950/80 border-indigo-700/60 text-indigo-300",
        ring: "border-cyan-500/40",
      };
  }
};