"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Sparkles,
  Loader2,
  Activity,
  Radio,
  Flame,
  HeartHandshake,
  Smile,
  Zap,
  Volume2,
  VolumeX,
  BotMessageSquare,
  User,
} from "lucide-react";

interface TelemetryData {
  sttLatency: number;
  llmLatency: number;
  ttsLatency: number;
  detectedPersona: string;
  modelUsed: string;
  totalPipelineLatency?: number;
}

type EmotionMode = "stress" | "excited" | "sarcastic" | "neutral";

export default function VijiVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionMode>("neutral");
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [statusMessage, setStatusMessage] = useState("Tap 'Activate Viji' to start");

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const isProcessingRef = useRef(false);

  // STRICT Viji Wake Word Detector
  const isStrictVijiWakeWord = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("siri") || lower.includes("google") || lower.includes("alexa")) {
      return false;
    }
    const allowedVijiWords = ["viji", "vjee", "vijay", "veggie", "vg"];
    return allowedVijiWords.some((word) => lower.includes(word));
  };

  const startSpeechEngine = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser Speech API not supported. Please use Chrome or Edge.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setStatusMessage("Listening... Say 'Hey Viji'");
      };

      recognition.onresult = (event: any) => {
  if (isProcessingRef.current) return;

  const lastIndex = event.results.length - 1;
  const speechText = event.results[lastIndex][0].transcript.trim();
  console.log("Speech Heard:", speechText);

  // Directly process speech without forcing 'Viji' wake word
  if (speechText.length > 0) {
    const cleanQuery = speechText
      .replace(/hey viji|hi viji|viji|sun viji|suno viji/gi, "")
      .trim();

    const finalQuery = cleanQuery.length > 0 ? cleanQuery : speechText;

    setTranscript(finalQuery);
    handleProcessQuery(finalQuery);
  }
};

      recognition.onerror = (event: any) => {
        // Silently handle temporary silence and abort errors
        if (event.error === "no-speech") {
          console.log("No speech detected, listening continuously...");
          return;
        }
        if (event.error === "aborted") {
          console.warn("Speech recognition aborted gracefully.");
          return;
        }

        console.error("Speech Error:", event.error);
        if (event.error === "not-allowed") {
          setStatusMessage("Microphone permission denied.");
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current && !isProcessingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            console.log("Engine restarting...");
          }
        } else {
          setIsListening(false);
          setStatusMessage("Mic Standby mode.");
        }
      };

      recognitionRef.current = recognition;
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("Engine active");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      setStatusMessage("Mic Paused");
    } else {
      startSpeechEngine();
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleProcessQuery = async (queryText: string) => {
    isProcessingRef.current = true;
    setLoading(true);
    stopSpeaking();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const clientStartTime = Date.now();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText, currentMode: currentEmotion }),
      });

      const data = await res.json();
      const clientEndTime = Date.now();

      if (data.text) {
        setAiResponse(data.text);
        setCurrentEmotion(data.emotion);

        setTelemetry({
          ...data.telemetry,
          totalPipelineLatency: clientEndTime - clientStartTime,
        });

        speakText(data.text, data.speechConfig?.pitch || 0.9, data.speechConfig?.rate || 1.0);
      }
    } catch (err) {
      console.error(err);
      setAiResponse("Bhai, server side se kuch issue lag raha hai.");
    } finally {
      setLoading(false);
      isProcessingRef.current = false;

      if (isListeningRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) {}
        }, 500);
      }
    }
  };

  // Male Voice Implementation
  const speakText = (text: string, pitch = 0.9, rate = 1.0) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      stopSpeaking();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Lower pitch slightly for a natural deep male voice
      utterance.pitch = pitch;
      utterance.rate = rate;

      const voices = window.speechSynthesis.getVoices();

      // Priority match for Male Voices (Indian/Hindi or English Male)
      const maleVoice = voices.find((v) => {
        const name = v.name.toLowerCase();
        const isIndianOrHindi = v.lang.includes("en-IN") || v.lang.includes("hi-IN");
        const isMale = name.includes("male") || name.includes("rishi") || name.includes("david") || name.includes("hemant") || name.includes("george");
        
        return isIndianOrHindi && isMale;
      }) || voices.find((v) => {
        const name = v.name.toLowerCase();
        return (v.lang.includes("en-IN") || v.lang.includes("hi-IN")) && !name.includes("female") && !name.includes("zira") && !name.includes("heera");
      }) || voices.find((v) => {
        const name = v.name.toLowerCase();
        return name.includes("male") || name.includes("david") || name.includes("mark");
      });

      if (maleVoice) {
        utterance.voice = maleVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const getPersonaTheme = () => {
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

  const theme = getPersonaTheme();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 bg-[#030712] text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl z-10 gap-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white animate-spin" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              VIJI AI COPILOT
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">
              REASONING & EMOTION ENGINE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono hover:bg-red-900 transition"
            >
              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
              <span>Stop Voice</span>
            </button>
          )}

          <button
            onClick={toggleListening}
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

      {/* Interactive Orb */}
      <section className="relative flex flex-col items-center justify-center my-6 z-10 w-full max-w-md">
        <div className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl transition-all duration-700 bg-gradient-to-tr ${theme.glow}`} />

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

      {/* Transcript & Response Cards */}
      <section className="w-full max-w-xl space-y-3 my-2 z-10">
        {transcript && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-slate-300 backdrop-blur-xl shadow-xl flex items-start gap-3">
            <User className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div className="text-left w-full">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-0.5">
                Voice Heard ('Viji' Matched)
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

      {/* Telemetry Footer */}
      {telemetry && (
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
      )}
    </main>
  );
}