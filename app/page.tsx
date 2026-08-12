"use client";

import React, { useState, useRef } from "react";
import { TelemetryData, EmotionMode, ThemeMode } from "../types/types";
import { getPreferredMaleVoice } from "./speechUtils";
import { getPersonaTheme } from "./themeUtils";

import { Header } from "../components/Header";
import { VisualizerOrb } from "../components/VisualizerOrb";
import { EmotionSelector } from "../components/EmotionSelector";
import { TranscriptCard } from "../components/TranscriptCard";
import { TelemetryFooter } from "../components/TelemetryFooter";

export default function VijiVoiceAssistant() {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionMode>("neutral");
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark"); // Day & Night Mode State
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Tap 'Activate Viji' to start");
  

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);

  const currentEmotionRef = useRef<EmotionMode>(currentEmotion);
  currentEmotionRef.current = currentEmotion;

  const startSpeechEngine = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser Speech API not supported. Please use Google Chrome or Microsoft Edge.");
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
        setStatusMessage("Listening... Say something to Viji");
      };

      recognition.onresult = (event: any) => {
        if (isProcessingRef.current) return;

        const lastIndex = event.results.length - 1;
        const speechText = event.results[lastIndex][0].transcript.trim();

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
        if (event.error === "no-speech" || event.error === "aborted") return;
        if (event.error === "not-allowed") {
          setStatusMessage("Microphone permission denied.");
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current && !isProcessingRef.current && !window.speechSynthesis.speaking) {
          try {
            recognition.start();
          } catch (e) {}
        } else if (!isListeningRef.current) {
          setIsListening(false);
          setStatusMessage("Mic Standby mode.");
        }
      };

      recognitionRef.current = recognition;
    }

    try {
      recognitionRef.current.start();
    } catch (e) {}
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
    const activeMode = currentEmotionRef.current;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText, currentMode: activeMode }),
      });

      const data = await res.json();
      const clientEndTime = Date.now();

      if (data.text) {
        setAiResponse(data.text);
        
        if (activeMode === "neutral" && data.emotion) {
          setCurrentEmotion(data.emotion);
        }

        setTelemetry({
          ...data.telemetry,
          totalPipelineLatency: clientEndTime - clientStartTime,
        });

        speakText(data.text, data.speechConfig?.pitch || 1.0, data.speechConfig?.rate || 1.0);
      }
    } catch (err) {
      console.error(err);
      setAiResponse("Bhai, server side se kuch issue lag raha hai.");
    } finally {
      setLoading(false);
      isProcessingRef.current = false;
    }
  };

 const speakText = (text: string, pitch = 0.75, rate = 1.0) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    stopSpeaking();

    const executeSpeak = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const maleVoice = getPreferredMaleVoice(availableVoices);

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Pitch is strictly set to deep male level (0.75)
      utterance.pitch = 0.75; 
      utterance.rate = rate;

      if (maleVoice) {
        utterance.voice = maleVoice;
        utterance.lang = maleVoice.lang;
        console.log("Active Voice Assigned:", maleVoice.name);
      } else {
        // Safe Fallback: Force system to lower pitch so even default system voice sounds male
        utterance.lang = "en-IN";
        utterance.pitch = 0.6;
        console.warn("No native male voice found, pitch forced to 0.6");
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setStatusMessage("Viji Speaking...");
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {}
        }
      };

      const handleSpeechEnd = () => {
        setIsSpeaking(false);
        if (isListeningRef.current) {
          setStatusMessage("Listening... Say something to Viji");
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (e) {}
          }, 400);
        } else {
          setStatusMessage("Mic Standby mode.");
        }
      };

      utterance.onend = handleSpeechEnd;
      utterance.onerror = handleSpeechEnd;

      window.speechSynthesis.speak(utterance);
    };

    // Handle Async Voices loading in Chrome/Safari
    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        executeSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      executeSpeak();
    }
  };

  // Dynamic Theme based on Active Emotion + Day/Night Mode Selection
  const theme = getPersonaTheme(currentEmotion, themeMode);
  const isDark = themeMode === "dark";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 transition-colors duration-500 font-sans relative overflow-hidden bg-gradient-to-b ${theme.bgGradient} ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Background Grid Pattern */}
      <div
        className={`absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none ${
          !isDark && "opacity-40"
        }`}
      />

      {/* Header Bar */}
      <Header
        isSpeaking={isSpeaking}
        isListening={isListening}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(isDark ? "light" : "dark")}
        onStopSpeaking={stopSpeaking}
        onToggleListening={toggleListening}
      />

      {/* Interactive Orb Visualizer */}
      <VisualizerOrb
        loading={loading}
        isSpeaking={isSpeaking}
        isListening={isListening}
        currentEmotion={currentEmotion}
        theme={theme}
        statusMessage={statusMessage}
      />

      {/* Manual Mode Selection Toolbar */}
      <EmotionSelector
        currentEmotion={currentEmotion}
        onSelectEmotion={(mode: EmotionMode) => {
          setCurrentEmotion(mode);
          currentEmotionRef.current = mode;
        }}
        disabled={loading}
      />

      {/* Transcripts */}
      <TranscriptCard transcript={transcript} aiResponse={aiResponse} />

      {/* Real-Time Pipeline Telemetry */}
      <TelemetryFooter telemetry={telemetry} />
    </main>
  );
}