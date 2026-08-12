"use client";

import React from "react";
import { Loader2, HeartHandshake, Flame, Smile, Mic, BotMessageSquare } from "lucide-react";
import { EmotionMode, PersonaTheme } from "../types/types";

interface VisualizerOrbProps {
  loading: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentEmotion: EmotionMode;
  theme: PersonaTheme;
  statusMessage: string;
}

/**
 * Interactive visualizer displaying AI states, animation rings, and active emotional persona.
 */
export const VisualizerOrb: React.FC<VisualizerOrbProps> = ({
  loading,
  isSpeaking,
  isListening,
  currentEmotion,
  theme,
  statusMessage,
}) => {
  return (
    <section className="relative flex flex-col items-center justify-center my-6 z-10 w-full max-w-md">
      {/* Background Radial Glow */}
      <div className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl transition-all duration-700 bg-gradient-to-tr ${theme.glow}`} />

      {/* Orb Center */}
      <div className="relative flex items-center justify-center">
        {isSpeaking && (
          <>
            <div className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border ${theme.ring} animate-ping opacity-20`} />
            <div className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border ${theme.ring} animate-pulse opacity-30`} />
          </>
        )}

        <div className={`relative z-10 p-10 sm:p-14 rounded-full border backdrop-blur-2xl transition-all duration-500 bg-slate-950/80 shadow-2xl ${
          isSpeaking ? "scale-105 border-white shadow-purple-500/50" : theme.border
        }`}>
          {loading ? (
            <Loader2 className="w-16 h-16 sm:w-20 sm:h-20 animate-spin text-indigo-400" />
          ) : currentEmotion === "stress" ? (
            <HeartHandshake className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 animate-bounce" />
          ) : currentEmotion === "excited" ? (
            <Flame className="w-16 h-16 sm:w-20 sm:h-20 text-orange-400 animate-bounce" />
          ) : currentEmotion === "sarcastic" ? (
            <Smile className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400 animate-bounce" />
          ) : (
            <Mic className={`w-16 h-16 sm:w-20 sm:h-20 ${isListening ? "text-cyan-400 animate-pulse" : "text-slate-600"}`} />
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-xs font-mono text-cyan-400 flex items-center justify-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {statusMessage}
        </p>

        <span className={`text-[11px] uppercase tracking-widest font-mono px-3.5 py-1 rounded-full border inline-flex items-center gap-1.5 shadow-md ${theme.badgeBg}`}>
          <BotMessageSquare className="w-3.5 h-3.5" />
          <span>Active Persona: <strong>{currentEmotion.toUpperCase()} FRIEND MODE</strong></span>
        </span>
      </div>
    </section>
  );
};