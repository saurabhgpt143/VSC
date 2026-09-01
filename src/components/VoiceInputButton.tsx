import React, { useState } from 'react';
import { Mic, MicOff, AlertCircle, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceInputButtonProps {
  onTranscript: (text: string, isFinal: boolean) => void;
  language: 'en' | 'hi';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  tooltipText?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  language,
  className = '',
  size = 'md',
  showLabel = false,
  tooltipText,
}) => {
  const isHindi = language === 'hi';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isListening, isSupported, toggleListening, interimTranscript } =
    useSpeechRecognition({
      language,
      onResult: (text, isFinal) => {
        onTranscript(text, isFinal);
      },
      onError: (err) => {
        setErrorMessage(err);
        setTimeout(() => setErrorMessage(null), 5000);
      },
    });

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-xs sm:text-sm',
    lg: 'p-2.5 text-sm',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setErrorMessage(null);
          toggleListening();
        }}
        title={
          tooltipText ||
          (isListening
            ? isHindi
              ? 'सुनना बंद करें'
              : 'Stop voice input'
            : isHindi
            ? 'बोलकर लिखें (वॉइस इनपुट)'
            : 'Speak input (Voice)')
        }
        className={`relative inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all active:scale-95 ${
          sizeClasses[size]
        } ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-400/30 animate-pulse shadow-md'
            : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300'
        } ${className}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <span className="relative flex items-center justify-center">
            <Mic className={`${iconSizes[size]} text-white`} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </span>
        ) : (
          <Mic className={`${iconSizes[size]}`} />
        )}

        {showLabel && (
          <span className="text-xs font-semibold">
            {isListening
              ? isHindi
                ? 'सुन रहे हैं...'
                : 'Listening...'
              : isHindi
              ? 'वॉइस इनपुट'
              : 'Voice Input'}
          </span>
        )}
      </button>

      {/* Real-time Listening Active Popup */}
      {isListening && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 text-xs font-medium whitespace-nowrap flex items-center gap-2 pointer-events-none animate-fadeIn">
          <span className="flex items-center gap-0.5">
            <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-4 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-2.5 bg-red-400 rounded-full animate-bounce" />
          </span>
          <span className="font-semibold text-red-200">
            {isHindi ? 'बोलिए (हिंदी)...' : 'Speak now (English)...'}
          </span>
          {interimTranscript && (
            <span className="max-w-[140px] truncate text-slate-300 text-[11px] italic">
              "{interimTranscript}"
            </span>
          )}
        </div>
      )}

      {/* Error notification tooltip */}
      {errorMessage && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-red-900 border border-red-200 px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-semibold max-w-[220px] text-center flex items-center gap-1.5 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
