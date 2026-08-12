// types.ts

export interface TelemetryData {
  sttLatency: number;
  llmLatency: number;
  ttsLatency: number;
  detectedPersona: string;
  modelUsed: string;
  totalPipelineLatency?: number;
}

export type EmotionMode =
  | "stress"
  | "excited"
  | "sarcastic"
  | "laughing"
  | "crying"
  | "angry"
  | "flirty"
  | "neutral";

export interface PersonaTheme {
  glow: string;
  border: string;
  badgeBg: string;
  ring: string;
}