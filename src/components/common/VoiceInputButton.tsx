'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Globe, Loader2 } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  appendMode?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  appendMode = true,
  className = '',
  size = 'sm'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState<'bn-BD' | 'en-US'>('bn-BD');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      if (transcript && transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, [lang, onTranscript]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট করে না। দয়া করে Chrome বা Edge ব্যবহার করুন।');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = lang;
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const toggleLang = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newLang = lang === 'bn-BD' ? 'en-US' : 'bn-BD';
    setLang(newLang);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className={`inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700/60 shadow-sm ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        className={`flex items-center gap-1 font-semibold rounded-lg transition ${
          size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'
        } ${
          isListening
            ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30 ring-2 ring-rose-400'
            : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        title={isListening ? 'কথা বলা বন্ধ করুন' : 'মুখে বলে বাংলায় বা ইংরেজিতে লিখুন (Voice-to-Text)'}
      >
        {isListening ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>শুনছি...</span>
          </>
        ) : (
          <>
            <Mic className="w-3 h-3 text-indigo-500" />
            <span>ভয়েস</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={toggleLang}
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
          lang === 'bn-BD'
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
            : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
        }`}
        title="ভাষা পরিবর্তন (বাংলা / English)"
      >
        {lang === 'bn-BD' ? 'বাং' : 'ENG'}
      </button>
    </div>
  );
};
