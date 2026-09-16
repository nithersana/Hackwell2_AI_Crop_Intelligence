// Client-side text-to-speech helper with fallback to Web Speech API
export function speakText(text: string, lang: 'en' | 'ta' | 'hi' = 'en'): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser environment.');
    return;
  }

  // Stop any active speech
  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/[*#_`\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.92; // slightly slower for farmer clarity
  utterance.pitch = 1.0;

  if (lang === 'ta') {
    utterance.lang = 'ta-IN';
  } else if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  // Find suitable voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => {
    if (lang === 'ta') return v.lang.includes('ta');
    if (lang === 'hi') return v.lang.includes('hi');
    return v.lang.includes('en-IN') || v.lang.includes('en-US');
  });
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export const stopSpeech = stopSpeaking;

