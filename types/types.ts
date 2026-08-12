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
  bgGradient: string;
  orbGlow: string;
  accentBorder: string;
  primaryText: string;
  secondaryText: string;
  cardBg: string;
  glow: string;
  border: string;
  badgeBg: string;
  ring: string;
}
export type ThemeMode = "dark" | "light";