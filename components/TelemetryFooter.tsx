"use client";

import React from "react";
import { Activity } from "lucide-react";
import { TelemetryData } from "../types/types";

interface TelemetryFooterProps {
  telemetry: TelemetryData | null;
}

/**
 * Displays pipeline metrics and latency stats in a real-time telemetry panel.
 */
export const TelemetryFooter: React.FC<TelemetryFooterProps> = ({ telemetry }) => {
  if (!telemetry) return null;

  return (
    <footer className="w-full max-w-2xl mt-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-2xl z-10 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Real-Time Telemetry & Latency</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full">
          {telemetry.modelUsed}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[9px] block">STT LATENCY</span>
          <span className="text-cyan-400 font-bold text-sm">{telemetry.sttLatency}ms</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[9px] block">LLM LATENCY</span>
          <span className="text-purple-400 font-bold text-sm">{telemetry.llmLatency}ms</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[9px] block">TTS LATENCY</span>
          <span className="text-pink-400 font-bold text-sm">{telemetry.ttsLatency}ms</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[9px] block">TOTAL PIPELINE</span>
          <span className="text-emerald-400 font-bold text-sm">{telemetry.totalPipelineLatency}ms</span>
        </div>
      </div>
    </footer>
  );
};