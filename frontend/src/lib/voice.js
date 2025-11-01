/**
 * Text-to-Speech utility using Web Speech API
 */

let synthesis = null;

if (typeof window !== 'undefined') {
  synthesis = window.speechSynthesis;
}

let currentUtterance = null;

export const speak = (text, lang = 'en-IN') => {
  if (!synthesis) {
    console.warn('Speech synthesis not available');
    return;
  }

  // Stop any current speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;
  utterance.volume = 1;

  currentUtterance = utterance;

  synthesis.speak(utterance);

  return utterance;
};

export const stopSpeaking = () => {
  if (synthesis) {
    synthesis.cancel();
    currentUtterance = null;
  }
};

export const isSpeaking = () => {
  return synthesis && synthesis.speaking;
};

export const getAvailableVoices = () => {
  if (!synthesis) return [];
  return synthesis.getVoices();
};

