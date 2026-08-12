"use client";

import React from "react";
import { User, Volume2 } from "lucide-react";

interface TranscriptCardProps {
  transcript: string;
  aiResponse: string;
}

/**
 * Displays live speech transcripts for user speech and generated AI responses.
 */
export const TranscriptCard: React.FC<TranscriptCardProps> = ({ transcript, aiResponse }) => {
  if (!transcript && !aiResponse) return null;

  return (
    <section className="w-full max-w-xl space-y-3 my-2 z-10">
      {transcript && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-slate-300 backdrop-blur-xl shadow-xl flex items-start gap-3">
          <User className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
          <div className="text-left w-full">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-0.5">
              Voice Heard
            </span>
            <p className="text-sm font-medium">"{transcript}"</p>
          </div>
        </div>
      )}

      {aiResponse && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900/80 border border-purple-800/50 text-purple-100 backdrop-blur-xl shadow-xl flex items-start gap-3">
          <Volume2 className="w-5 h-5 text-purple-400 mt-0.5 shrink-0 animate-pulse" />
          <div className="text-left w-full">
            <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 block mb-0.5">
              Viji Response (Male Voice)
            </span>
            <p className="text-base font-semibold">{aiResponse}</p>
          </div>
        </div>
      )}
    </section>
  );
};