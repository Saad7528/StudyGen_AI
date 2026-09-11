'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Brain
} from 'lucide-react';
import { LottiePlayer } from '@/components/common/LottiePlayer';

const AI_PROMPTS = [
  '📝 বাংলা ১ম পত্র: সৃজনশীল প্রশ্ন ও মান বণ্টন তৈরি হচ্ছে...',
  '⚡ পদার্থবিজ্ঞান: ১০টি বহুনির্বাচনী প্রশ্ন (MCQ) প্রস্তুত...',
  '🔍 খাতার ছবির হাতে লেখা থেকে ১-ক্লিকে .docx ফাইল...',
  '🧠 জীবকোষ অধ্যায়ের মেমরি টেকনিক ও ছন্দ জেনারেট হচ্ছে...',
  '🧮 উচ্চতর গণিত: ত্রিকোণমিতি সূত্রের কুইজ শিট তৈরি...'
];

export const HeroStudyCharacterScene: React.FC = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter effect for live AI generation prompt
  useEffect(() => {
    const fullText = AI_PROMPTS[currentPromptIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause at full text
          setTimeout(() => setIsDeleting(true), 2400);
        }
      } else {
        if (charIndex > 0) {
          setDisplayedText(fullText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentPromptIndex((prev) => (prev + 1) % AI_PROMPTS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentPromptIndex]);

  return (
    <div className="relative w-full max-w-[460px] aspect-square rounded-3xl bg-gradient-to-br from-white/90 via-indigo-50/40 to-purple-50/40 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-indigo-950/40 border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-6 flex flex-col items-center justify-center overflow-visible shadow-2xl backdrop-blur-xl group hover:border-indigo-500/50 transition-all duration-300">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-6 -left-6 w-44 h-44 bg-indigo-500/25 dark:bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-pink-500/20 dark:bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-700 pointer-events-none" />

      {/* Top Banner: Teacher & Student Badge */}
      <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-slate-800 text-pink-300 dark:text-pink-300 border border-pink-500/40 text-[11px] font-bold shadow-xl flex items-center gap-1.5 z-20 whitespace-nowrap">
        <GraduationCap className="w-3.5 h-3.5 text-pink-400 shrink-0" />
        <span>শিক্ষার্থী ও শিক্ষকদের বিশ্বস্ত AI সহচর</span>
        <span className="text-amber-300">✨</span>
      </div>

      {/* Top-Left Floating Badge: Question.docx (100% Editable) */}
      <div className="absolute top-7 -left-4 sm:-left-6 p-2.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 border border-indigo-200 dark:border-indigo-700/60 shadow-xl flex items-center gap-2.5 z-20 backdrop-blur-md transform -rotate-2 hover:rotate-0 transition-transform duration-200">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20 shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="text-left pr-1">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
            <span>Question.docx</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>১০০% এডিটেবল</span>
          </div>
        </div>
      </div>

      {/* Bottom-Left Floating Badge: OCR Handwriting to Docx */}
      <div className="absolute bottom-16 -left-3 sm:-left-5 p-2.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 border border-purple-200 dark:border-purple-700/60 shadow-xl flex items-center gap-2 z-20 backdrop-blur-md transform rotate-2 hover:rotate-0 transition-transform duration-200">
        <div className="w-7 h-7 rounded-lg bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
          <ImageIcon className="w-3.5 h-3.5" />
        </div>
        <div className="text-left pr-1">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            খাতার ছবি OCR
          </span>
          <span className="text-[9px] text-purple-600 dark:text-purple-400 font-medium">
            হাতের লেখা এআই কনভার্ট
          </span>
        </div>
      </div>

      {/* Bottom-Right Floating Badge: CQ + MCQ Engine */}
      <div className="absolute bottom-16 -right-3 sm:-right-4 p-2.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 border border-indigo-200 dark:border-indigo-700/60 shadow-xl flex items-center gap-2 z-20 backdrop-blur-md transform -rotate-1 hover:rotate-0 transition-transform duration-200">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Brain className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div className="text-left pr-1">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            CQ + MCQ ইঞ্জিন
          </span>
          <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-medium">
            বোর্ড মান বণ্টন অনুযায়ী
          </span>
        </div>
      </div>

      {/* Main Student / Study Lottie Animation Container */}
      <div className="w-full h-full max-w-[320px] max-h-[290px] relative flex items-center justify-center -mt-2 mb-8">
        <LottiePlayer
          src="/animations/boy-study.json"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Dynamic Live AI Prompt Bubble (Pinned at bottom of character scene) */}
      <div className="absolute bottom-3 left-3 right-3 z-20">
        <div className="p-2.5 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 border border-indigo-500/40 shadow-xl backdrop-blur-md text-left flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-3 h-3 animate-spin text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-slate-200 truncate">
              {displayedText}
              <span className="inline-block w-1 h-3 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
