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

  recognition.continuous = false;
  recognition.interimResults = true;

  if (lang === 'ta') {
    recognition.lang = 'ta-IN';
  } else if (lang === 'hi') {
    recognition.lang = 'hi-IN';
  } else {
    recognition.lang = 'en-IN';
  }

  recognition.onstart = () => {
    handlers.onStart?.();
  };

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }
    const text = final || interim;
    if (text) {
      handlers.onResult?.(text, Boolean(final));
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition error event:', event);
    handlers.onError?.(event.error || 'Speech recognition error');
  };

  recognition.onend = () => {
    handlers.onEnd?.();
  };

  try {
    recognition.start();
    return {
      stop: () => {
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


