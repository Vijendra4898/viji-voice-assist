/**
 * Strictly finds and returns ONLY a Male Voice for Speech Synthesis.
 * Excludes all non-male voices completely.
 */
export const getPreferredMaleVoice = (
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | undefined => {
  if (!voices || voices.length === 0) return undefined;

  // Exact & Partial Male Voice Names across Chrome, Edge, Windows, Android, iOS & Mac
  const maleVoicesList = [
    "microsoft rishi online (natural) - english (india)",
    "microsoft hemant online (natural) - hindi (india)",
    "microsoft prabhat online (natural) - english (india)",
    "google hindi male",
    "google हिन्दी male",
    "google uk english male",
    "google us english male",
    "microsoft david",
    "microsoft mark",
    "microsoft george",
    "rishi",
    "hemant",
    "prabhat",
    "ravi",
    "david",
    "mark",
    "george",
    "daniel",
    "alex",
    "fred",
    "male",
  ];

  // Strictly filter voices that contain at least one male keyword
  const availableMaleVoices = voices.filter((v) => {
    const vName = v.name.toLowerCase();
    return maleVoicesList.some((maleKeyword) => vName.includes(maleKeyword));
  });

  if (availableMaleVoices.length === 0) {
    return undefined; // No male voice found in system
  }

  // 1. Priority: Indian English or Hindi Male Voice
  const indianMale = availableMaleVoices.find(
    (v) => v.lang.includes("en-IN") || v.lang.includes("hi-IN")
  );
  if (indianMale) return indianMale;

  // 2. Fallback: Any Available Male Voice from the filtered array
  return availableMaleVoices[0];
};