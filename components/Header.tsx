"use client";

import React from "react";
import { Sparkles, Radio, VolumeX } from "lucide-react";

interface HeaderProps {
  isSpeaking: boolean;
  isListening: boolean;
  onStopSpeaking: () => void;
  onToggleListening: () => void;
}

/**
 * Top Navigation Header containing branding and main action toggles.
 */
export const Header: React.FC<HeaderProps> = ({
  isSpeaking,
  isListening,
  onStopSpeaking,
  onToggleListening,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl z-10 gap-3 pb-2 border-b border-slate-800/80">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-5 h-5 text-white animate-spin" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            VIJI AI
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-wide">
            REASONING & EMOTION ENGINE
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono hover:bg-red-900 transition"
          >
            <VolumeX className="w-3.5 h-3.5 animate-pulse" />
            <span>Stop Voice</span>
          </button>
        )}

        <button
          onClick={onToggleListening}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 shadow-xl backdrop-blur-md ${
            isListening
              ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-emerald-500/20"
              : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isListening ? "text-emerald-400 animate-ping" : "text-slate-500"}`} />
          <span>{isListening ? "Listening Active" : "Activate Viji"}</span>
        </button>
      </div>
    </header>
  );
};