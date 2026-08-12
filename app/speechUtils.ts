/**
 * Finds the best available deep Indian/English male voice for Text-to-Speech.
 */
export const getPreferredMaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
  return (
    voices.find((v) => {
      const name = v.name.toLowerCase();
      const isIndianOrHindi = v.lang.includes("en-IN") || v.lang.includes("hi-IN");
      const isMale =
        name.includes("male") ||
        name.includes("rishi") ||
        name.includes("david") ||
        name.includes("hemant") ||
        name.includes("george");
      return isIndianOrHindi && isMale;
    }) ||
    voices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        (v.lang.includes("en-IN") || v.lang.includes("hi-IN")) &&
        !name.includes("female") &&
        !name.includes("zira") &&
        !name.includes("heera")
      );
    }) ||
    voices.find((v) => {
      const name = v.name.toLowerCase();
      return name.includes("male") || name.includes("david") || name.includes("mark");
    })
  );
};