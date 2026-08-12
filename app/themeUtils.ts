import { EmotionMode, ThemeMode, PersonaTheme } from "../types/types";

export function getPersonaTheme(
  emotion: EmotionMode,
  themeMode: ThemeMode = "dark"
): PersonaTheme {
  const isDark = themeMode === "dark";

  switch (emotion) {
    case "excited":
      return {
        bgGradient: isDark
          ? "from-amber-950/40 via-yellow-950/20 to-slate-950"
          : "from-amber-100 via-yellow-50 to-orange-100",
        orbGlow: "shadow-[0_0_80px_rgba(245,158,11,0.6)] bg-gradient-to-tr from-amber-500 to-yellow-300",
        accentBorder: "border-amber-500/40",
        primaryText: isDark ? "text-amber-300" : "text-amber-900",
        secondaryText: isDark ? "text-amber-200/70" : "text-amber-800/80",
        cardBg: isDark ? "bg-amber-950/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md shadow-lg",
        glow: "bg-amber-500/30",
        border: "border-amber-500/40",
        badgeBg: isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-amber-100 text-amber-900 border-amber-300",
        ring: "border-amber-500/50",
      };

    case "sarcastic":
      return {
        bgGradient: isDark
          ? "from-purple-950/40 via-fuchsia-950/20 to-slate-950"
          : "from-purple-100 via-fuchsia-50 to-pink-100",
        orbGlow: "shadow-[0_0_80px_rgba(168,85,247,0.6)] bg-gradient-to-tr from-purple-600 to-fuchsia-400",
        accentBorder: "border-purple-500/40",
        primaryText: isDark ? "text-purple-300" : "text-purple-900",
        secondaryText: isDark ? "text-purple-200/70" : "text-purple-800/80",
        cardBg: isDark ? "bg-purple-950/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md shadow-lg",
        glow: "bg-purple-500/30",
        border: "border-purple-500/40",
        badgeBg: isDark ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-purple-100 text-purple-900 border-purple-300",
        ring: "border-purple-500/50",
      };

    case "laughing":
      return {
        bgGradient: isDark
          ? "from-fuchsia-950/40 via-pink-950/20 to-slate-950"
          : "from-fuchsia-100 via-pink-50 to-purple-100",
        orbGlow: "shadow-[0_0_80px_rgba(217,70,239,0.6)] bg-gradient-to-tr from-fuchsia-500 to-pink-300",
        accentBorder: "border-fuchsia-500/40",
        primaryText: isDark ? "text-fuchsia-300" : "text-fuchsia-900",
        secondaryText: isDark ? "text-fuchsia-200/70" : "text-fuchsia-800/80",
        cardBg: isDark ? "bg-fuchsia-950/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md shadow-lg",
        glow: "bg-fuchsia-500/30",
        border: "border-fuchsia-500/40",
        badgeBg: isDark ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30" : "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300",
        ring: "border-fuchsia-500/50",
      };

    case "crying":
      return {
        bgGradient: isDark
          ? "from-blue-950/40 via-indigo-950/20 to-slate-950"
          : "from-blue-100 via-sky-50 to-indigo-100",
        orbGlow: "shadow-[0_0_80px_rgba(59,130,246,0.6)] bg-gradient-to-tr from-blue-700 to-sky-400",
        accentBorder: "border-blue-500/40",
        primaryText: isDark ? "text-blue-300" : "text-blue-900",
        secondaryText: isDark ? "text-blue-200/70" : "text-blue-800/80",
        cardBg: isDark ? "bg-blue-950/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md shadow-lg",
        glow: "bg-blue-500/30",
        border: "border-blue-500/40",
        badgeBg: isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-100 text-blue-900 border-blue-300",
        ring: "border-blue-500/50",
      };

    case "angry":
      return {
        bgGradient: isDark
          ? "from-rose-950/40 via-red-950/20 to-slate-950"
          : "from-rose-100 via-red-50 to-orange-100",
        orbGlow: "shadow-[0_0_80px_rgba(244,63,94,0.7)] bg-gradient-to-tr from-rose-600 to-red-500 animate-pulse",
        accentBorder: "border-rose-500/40",
        primaryText: isDark ? "text-rose-300" : "text-rose-900",
        secondaryText: isDark ? "text-rose-200/70" : "text-rose-800/80",
        cardBg: isDark ? "bg-rose-950/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md shadow-lg",
        glow: "bg-rose-500/30",
        border: "border-rose-500/40",
        badgeBg: isDark ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "bg-rose-100 text-rose-900 border-rose-300",
        ring: "border-rose-500/50",
      };

    case "flirty":
      return {
        bgGradient: isDark
          ? "from-pink-950/40 via-rose-950/20 to-slate-950"
          : "from-pink-100 via-rose-50 to-red-100",
        orbGlow: "shadow-[0_0_80px_rgba(236,72,153,0.6)] bg-gradient-to-tr from-pink-500 to-rose-300",
        accentBorder: "border-pink-500/40",
        primaryText: isDark ? "text-pink-300" : "text-pink-900",
        secondaryText: isDark ? "text-pink-200/70" : "text-pink-800/80",
        cardBg: isDark ? "bg-pink-950/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md shadow-lg",
        glow: "bg-pink-500/30",
        border: "border-pink-500/40",
        badgeBg: isDark ? "bg-pink-500/20 text-pink-300 border-pink-500/30" : "bg-pink-100 text-pink-900 border-pink-300",
        ring: "border-pink-500/50",
      };

    case "stress":
      return {
        bgGradient: isDark
          ? "from-emerald-950/40 via-teal-950/20 to-slate-950"
          : "from-emerald-100 via-teal-50 to-cyan-100",
        orbGlow: "shadow-[0_0_80px_rgba(16,185,129,0.5)] bg-gradient-to-tr from-emerald-600 to-teal-400",
        accentBorder: "border-emerald-500/40",
        primaryText: isDark ? "text-emerald-300" : "text-emerald-900",
        secondaryText: isDark ? "text-emerald-200/70" : "text-emerald-800/80",
        cardBg: isDark ? "bg-emerald-950/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md shadow-lg",
        glow: "bg-emerald-500/30",
        border: "border-emerald-500/40",
        badgeBg: isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-100 text-emerald-900 border-emerald-300",
        ring: "border-emerald-500/50",
      };

    default: // neutral
      return {
        bgGradient: isDark
          ? "from-cyan-950/30 via-slate-950 to-black"
          : "from-slate-100 via-sky-50 to-cyan-100",
        orbGlow: "shadow-[0_0_80px_rgba(6,182,212,0.5)] bg-gradient-to-tr from-cyan-500 to-blue-500",
        accentBorder: "border-cyan-500/40",
        primaryText: isDark ? "text-cyan-300" : "text-cyan-900",
        secondaryText: isDark ? "text-slate-300" : "text-slate-700",
        cardBg: isDark ? "bg-slate-900/40 backdrop-blur-md" : "bg-white/80 backdrop-blur-md shadow-lg",
        glow: "bg-cyan-500/30",
        border: "border-cyan-500/40",
        badgeBg: isDark ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-cyan-100 text-cyan-900 border-cyan-300",
        ring: "border-cyan-500/50",
      };
  }
}