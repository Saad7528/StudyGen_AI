'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MnemonicItem } from '@/types/mnemonic';
import { VisualSketchCanvas } from './VisualSketchCanvas';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Lightbulb, 
  Volume2, 
  Share2, 
  HelpCircle,
  Eye,
  Sliders
} from 'lucide-react';

interface InteractiveSlideDeckProps {
  items: MnemonicItem[];
  initialIndex?: number;
  onClose?: () => void;
}

export const InteractiveSlideDeck: React.FC<InteractiveSlideDeckProps> = ({
  items,
  initialIndex = 0,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [revealStep, setRevealStep] = useState<'question_only' | 'revealed'>('question_only');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentItem = items[currentIndex] || items[0];

  useEffect(() => {
    setRevealStep('question_only');
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'KeyN') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'KeyP') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setRevealStep(prev => prev === 'question_only' ? 'revealed' : 'question_only');
      } else if (e.key === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length]);

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!currentItem) return null;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col rounded-2xl bg-slate-900 text-white overflow-hidden border border-slate-800 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'min-h-[640px]'
      }`}
    >
      {/* Top Slide Deck Bar */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 text-xs font-bold">
            স্লাইড {currentIndex + 1} / {items.length}
          </span>
          <span className="text-sm font-bold text-slate-300 truncate max-w-xs sm:max-w-md">
            {currentItem.topic}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRevealStep(revealStep === 'question_only' ? 'revealed' : 'question_only')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{revealStep === 'question_only' ? 'ছন্দ ও উত্তর উন্মোচন' : 'লুকান (Active Recall)'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="ফুলস্ক্রিন মোড (F)"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Progress Line */}
      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Main Slide Content Canvas */}
      <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Question Banner */}
          <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 shadow-lg backdrop-blur-sm text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              পরীক্ষার প্রশ্ন
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed">
              {currentItem.question}
            </h2>
          </div>

          {/* Active Recall Stage: Hidden Answer or Revealed */}
          {revealStep === 'question_only' ? (
            <div className="p-8 rounded-xl bg-slate-950/60 border-2 border-dashed border-slate-700 text-center flex flex-col items-center justify-center space-y-4 py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HelpCircle className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-200">
                  নিজের স্মৃতি পরীক্ষা করুন (Active Recall Mode)
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  প্রথমে মনে করার চেষ্টা করুন, এরপর নিচের বাটনে ক্লিক করলে বা স্পেসবার চাপলে সূত্র ও ছন্দ উন্মোচিত হবে।
                </p>
              </div>
              <button
                onClick={() => setRevealStep('revealed')}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-105 cursor-pointer"
              >
                ✨ ছন্দ ও ম্যাজিক সূত্র দেখুন
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Correct Answer & Highlighted Formula */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-indigo-500/15 border-2 border-amber-400/40 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    ম্যাজিক ছন্দ সূত্র
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    সঠিক উত্তর: {currentItem.correct_answer}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wide text-center py-2">
                  "{currentItem.mnemonic_formula}"
                </div>

                {/* Syllable Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-amber-400/20">
                  {currentItem.breakdown.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        {b.code}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate">{b.meaning}</div>
                        {b.phoneticHint && (
                          <div className="text-[10px] text-amber-300 truncate">{b.phoneticHint}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Sketch Canvas */}
              {currentItem.visual_cue && (
                <VisualSketchCanvas
                  visualCue={currentItem.visual_cue}
                  formula={currentItem.mnemonic_formula}
                  topic={currentItem.topic}
                  question={currentItem.question}
                  correctAnswer={currentItem.correct_answer}
                  compact
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Toolbar */}
      <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী (Prev)</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === items.length - 1}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>পরবর্তী (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span>কীবোর্ড শর্টকাট:</span>
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
            ← / →
          </kbd>
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
            Space (Reveal)
          </kbd>
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
            F (Fullscreen)
          </kbd>
        </div>
      </div>
    </div>
  );
};
