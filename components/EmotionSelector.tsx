"use client";

import React from "react";
import { Smile, HeartHandshake, Flame, Bot } from "lucide-react";
import { EmotionMode } from "../types/types";

interface EmotionSelectorProps {
  currentEmotion: EmotionMode;
  onSelectEmotion: (mode: EmotionMode) => void;
  disabled?: boolean;
}

const MODES: { id: EmotionMode; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "neutral", label: "Neutral", icon: <Bot className="w-3.5 h-3.5" />, color: "hover:border-cyan-500 hover:text-cyan-400" },
  { id: "stress", label: "Calm/Support", icon: <HeartHandshake className="w-3.5 h-3.5" />, color: "hover:border-emerald-500 hover:text-emerald-400" },
  { id: "excited", label: "Hype Mode", icon: <Flame className="w-3.5 h-3.5" />, color: "hover:border-orange-500 hover:text-orange-400" },
  { id: "sarcastic", label: "Sarcastic", icon: <Smile className="w-3.5 h-3.5" />, color: "hover:border-pink-500 hover:text-pink-400" },
];

/**
 * Interactive Toolbar allowing users to manually switch Viji's active persona mode.
 */
export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  currentEmotion,
  onSelectEmotion,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 my-3 z-10 w-full max-w-lg p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      <span className="text-[10px] font-mono uppercase text-slate-500 w-full sm:w-auto text-center sm:text-left px-2">
        Select Mode:
      </span>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {MODES.map((mode) => {
          const isActive = currentEmotion === mode.id;
          return (
            <button
              key={mode.id}
              disabled={disabled}
              onClick={() => onSelectEmotion(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 ${
                isActive
                  ? "bg-slate-800 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 font-bold scale-105"
                  : `bg-slate-900/60 border-slate-800 text-slate-400 ${mode.color}`
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};