"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, Loader2 } from "lucide-react";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API for Speech-to-Text (Browser Native)
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US"; // Change to 'hi-IN' for Hindi support

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListening(false);
          handleProcessQuery(text);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Voice Recording Toggle
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setAiResponse("");
      stopSpeaking();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Call API with Grounded Search
  const handleProcessQuery = async (queryText: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText }),
      });

      const data = await res.json();
      if (data.text) {
        setAiResponse(data.text);
        speakText(data.text);
      } else {
        setAiResponse("Sorry, I could not process that request.");
      }
    } catch (err) {
      console.error(err);
      setAiResponse("An error occurred while getting the response.");
    } finally {
      setLoading(false);
    }
  };

  // Text-to-Speech Output
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      stopSpeaking();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-slate-950 text-white selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <div className="flex items-center gap-2 text-xl font-semibold tracking-wide text-purple-400">
        <Sparkles className="w-6 h-6" />
        <span>Real-Time Voice Assistant</span>
      </div>

      {/* Siri Orb / Visualizer */}
      <div className="relative flex items-center justify-center">
        {/* Outer Glow Animations */}
        <div
          className={`absolute w-72 h-72 rounded-full blur-3xl transition-all duration-500 ${
            isListening
              ? "bg-cyan-500/40 scale-125 animate-pulse"
              : isSpeaking
              ? "bg-purple-500/40 scale-125 animate-pulse"
              : "bg-indigo-500/20"
          }`}
        />

        {/* Interactive Mic Button */}
        <button
          onClick={toggleListening}
          disabled={loading}
          className={`relative z-10 p-10 rounded-full transition-all duration-300 transform active:scale-95 shadow-2xl ${
            isListening
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/50"
              : isSpeaking
              ? "bg-purple-600 hover:bg-purple-700 shadow-purple-500/50"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/50"
          }`}
        >
          {loading ? (
            <Loader2 className="w-16 h-16 animate-spin text-white" />
          ) : isListening ? (
            <MicOff className="w-16 h-16 text-white animate-bounce" />
          ) : isSpeaking ? (
            <Volume2 className="w-16 h-16 text-white animate-pulse" />
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </button>
      </div>

      {/* Display Panel */}
      <div className="w-full max-w-lg space-y-4 text-center">
        {/* User Query Status */}
        {transcript && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 backdrop-blur-md">
            <span className="text-xs uppercase tracking-wider text-slate-500 block mb-1">
              You Said
            </span>
            <p className="text-lg font-medium">{transcript}</p>
          </div>
        )}

        {/* AI Response Display */}
        {aiResponse && (
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-100 backdrop-blur-md">
            <span className="text-xs uppercase tracking-wider text-purple-400 block mb-1">
              Assistant Response
            </span>
            <p className="text-lg font-medium">{aiResponse}</p>
          </div>
        )}

        {/* Instructions */}
        {!transcript && !loading && (
          <p className="text-slate-500 text-sm">
            Tap the microphone and ask anything happening in the world...
          </p>
        )}
      </div>
    </main>
  );
}