import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  language?: 'en' | 'hi';
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({
  language = 'en',
  onResult,
  onError,
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check browser support
  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore errors on stopping already stopped instance
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, [isListening]);

  const startListening = useCallback(
    (langOverride?: string) => {
      setError(null);
      setTranscript('');
      setInterimTranscript('');

      if (!isSupported) {
        const errorMsg =
          language === 'hi'
            ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Google Chrome या Edge का उपयोग करें।'
            : 'Voice input is not supported in this browser. Please use Chrome, Edge, or a modern browser.';
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      try {
        const SpeechRecognitionConstructor =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;

        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (e) {
            // Safe abort
          }
        }

        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        // Set speech language code
        const speechLang =
          langOverride || (language === 'hi' ? 'hi-IN' : 'en-IN');
        recognition.lang = speechLang;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            const text = result[0].transcript;
            if (result.isFinal) {
              finalTranscript += text;
            } else {
              currentInterim += text;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
            onResult?.(currentInterim, false);
          }

          if (finalTranscript) {
            setTranscript(finalTranscript);
            setInterimTranscript('');
            onResult?.(finalTranscript, true);
          }
        };

        recognition.onerror = (event: any) => {
          let errorMsg = '';
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            errorMsg =
              language === 'hi'
                ? 'माइक्रोफ़ोन की अनुमति अस्वीकार कर दी गई है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।'
                : 'Microphone access was denied. Please allow microphone permissions in your browser settings.';
          } else if (event.error === 'no-speech') {
            errorMsg =
              language === 'hi'
                ? 'कोई आवाज़ सुनाई नहीं दी। कृपया पुनः प्रयास करें।'
                : 'No speech was detected. Please try speaking again.';
          } else if (event.error === 'network') {
            errorMsg =
              language === 'hi'
                ? 'वॉइस पहचान के लिए नेटवर्क त्रुटि हुई।'
                : 'Network error occurred during speech recognition.';
          } else {
            errorMsg =
              language === 'hi'
                ? `वॉइस इनपुट त्रुटि: ${event.error}`
                : `Voice input error: ${event.error}`;
          }

          setError(errorMsg);
          onError?.(errorMsg);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        const errorMsg =
          language === 'hi'
            ? 'माइक्रोफ़ोन प्रारंभ करने में विफल।'
            : 'Failed to initialize microphone.';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsListening(false);
      }
    },
    [isSupported, language, onResult, onError]
  );

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    clearError: () => setError(null),
  };
}
