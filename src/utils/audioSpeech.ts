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

// Speech Recognition (Speech-to-Text) helpers
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export interface SpeechRecognizerHandlers {
  onStart?: () => void;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function startSpeechListening(
  lang: 'en' | 'ta' | 'hi',
  handlers: SpeechRecognizerHandlers
): { stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    handlers.onError?.('Speech recognition is not supported in this browser.');
    return null;
  }

  const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  // continuous = true ensures browser does not cut off after 1 second of silence
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  if (lang === 'ta') {
    recognition.lang = 'ta-IN';
  } else if (lang === 'hi') {
    recognition.lang = 'hi-IN';
  } else {
    recognition.lang = 'en-IN';
  }

  let hasEnded = false;

  recognition.onstart = () => {
    handlers.onStart?.();
  };

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = 0; i < event.results.length; ++i) {
      const res = event.results[i];
      if (res && res[0]) {
        if (res.isFinal) {
          final += res[0].transcript + ' ';
        } else {
          interim += res[0].transcript;
        }
      }
    }

    const currentText = (final + interim).trim();
    if (currentText) {
      handlers.onResult?.(currentText, Boolean(final.trim()));
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition event:', event.error);
    // Ignore no-speech warning so the microphone stays open while user speaks
    if (event.error === 'no-speech') {
      return;
    }
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      hasEnded = true;
      handlers.onError?.('not-allowed');
      return;
    }
    if (event.error !== 'aborted') {
      handlers.onError?.(event.error || 'Speech error');
    }
  };

  recognition.onend = () => {
    if (!hasEnded) {
      handlers.onEnd?.();
    }
  };

  try {
    recognition.start();
    return {
      stop: () => {
        hasEnded = true;
        try {
          recognition.stop();
        } catch {}
      }
    };
  } catch (err) {
    handlers.onError?.(String(err));
    return null;
  }
}


