"use client";

import React from "react";
import { Sun, Moon, VolumeX, Mic, MicOff } from "lucide-react";
import { ThemeMode } from "../types/types";

interface HeaderProps {
  isSpeaking: boolean;
  isListening: boolean;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onStopSpeaking: () => void;
  onToggleListening: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSpeaking,
  isListening,
  themeMode,
  onToggleTheme,
  onStopSpeaking,
  onToggleListening,
}) => {
  const isDark = themeMode === "dark";

  return (
    <header className="w-full max-w-4xl flex items-center justify-between z-20 py-4 px-2 sm:px-0">
      {/* Sleek Branding Heading */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-3.5 w-3.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
          <span className={`bg-gradient-to-r ${isDark ? "from-white via-slate-200 to-slate-400" : "from-slate-900 via-slate-800 to-slate-600"} bg-clip-text text-transparent drop-shadow-sm`}>
            VIJI
          </span>
          <span className="ml-2 text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
            AI v2.0
          </span>
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Mute Button */}
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            title="Mute Viji"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition-all flex items-center gap-1.5 animate-pulse"
          >
            <VolumeX className="w-4 h-4" />
            <span className="hidden sm:inline">Mute</span>
          </button>
        )}

        {/* Mic Toggle Button */}
        <button
          onClick={onToggleListening}
          className={`p-2 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 ${
            isListening
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 animate-pulse"
              : isDark
              ? "bg-slate-900/60 text-slate-300 border-slate-700/80 hover:bg-slate-800"
              : "bg-white/80 text-slate-700 border-slate-300 hover:bg-slate-100 shadow-sm"
          }`}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          <span className="hidden sm:inline">{isListening ? "Active" : "Mic Off"}</span>
        </button>

        {/* Top-Right Premium Glassmorphism Theme Switcher */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle Theme"
          className={`relative flex items-center w-14 h-8 p-1 rounded-full border transition-all duration-300 backdrop-blur-md ${
            isDark
              ? "bg-slate-900/80 border-slate-700 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]"
              : "bg-slate-200/90 border-slate-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
          }`}
        >
          {/* Sliding Pill Indicator */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 shadow-md ${
              isDark
                ? "translate-x-6 bg-slate-800 text-amber-400 border border-slate-700"
                : "translate-x-0 bg-white text-indigo-600 border border-slate-200"
            }`}
          >
            {isDark ? <Moon className="w-3.5 h-3.5 fill-amber-400/20" /> : <Sun className="w-3.5 h-3.5 fill-yellow-400" />}
          </div>
        </button>
      </div>
    </header>
  );
};