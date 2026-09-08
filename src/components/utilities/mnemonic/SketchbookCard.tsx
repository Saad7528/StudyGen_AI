'use client';

import React, { useState } from 'react';
import { MnemonicItem } from '@/types/mnemonic';
import { VisualSketchCanvas } from './VisualSketchCanvas';
import { 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Copy, 
  Check, 
  HelpCircle, 
  Eye, 
  Share2, 
  AlertTriangle,
  Lightbulb,
  Bookmark,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface SketchbookCardProps {
  item: MnemonicItem;
  index: number;
  onSelectForPresentation?: (item: MnemonicItem) => void;
}

export const SketchbookCard: React.FC<SketchbookCardProps> = ({
  item,
  index,
  onSelectForPresentation
}) => {
  const [showSketch, setShowSketch] = useState(true);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = () => {
    const text = `📌 টপিক: ${item.topic}\n❓ প্রশ্ন: ${item.question}\n✅ উত্তর: ${item.correct_answer}\n✨ মনে রাখার ছন্দ: ${item.mnemonic_formula}\n\n🔍 ব্রেকডাউন:\n${item.breakdown.map(b => `• ${b.code} = ${b.meaning}`).join('\n')}\n\n💡 টিপ: ${item.mcq_avoid_confusion_tip || ''}\n\n— জেনারেটেড বাই StudyGenAI`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `মনে রাখার ছন্দ: ${item.mnemonic_formula}। সঠিক উত্তর: ${item.correct_answer}`
    );
    utterance.lang = 'bn-BD';
    utterance.rate = 0.9;

    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative rounded-xl bg-[#FDFBF7] dark:bg-slate-900 border border-[#E9DFCB] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Top Paper Header Bar */}
      <div className="px-4 sm:px-5 py-3 bg-[#F7F2E6] dark:bg-slate-950/80 border-b border-[#E8DFC8] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">
            #{index + 1}
          </span>
          <span className="text-xs font-bold text-amber-900 dark:text-amber-300 tracking-wide uppercase">
            {item.topic}
          </span>
          {item.exam_target && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-semibold border border-amber-300 dark:border-amber-800">
              {item.exam_target}
            </span>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSpeak}
            title="ভয়েসে ছন্দ শুনুন"
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              speaking
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            title="পুরো সূত্র কপি করুন"
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsSaved(!isSaved)}
            title="বুকমার্ক করুন"
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              isSaved
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Question & Answer Header */}
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold mt-0.5 shrink-0">
              প্রশ্ন
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {item.question}
            </h3>
          </div>

          <div className="flex items-start gap-2 pl-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mt-0.5 shrink-0">
              সঠিক উত্তর
            </span>
            <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {item.correct_answer}
            </p>
          </div>
        </div>

        {/* Highlighted Mnemonic Formula (Yellow Highlighter Effect) */}
        <div className="relative p-3.5 sm:p-4 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>মনে রাখার জাদুকরী ছন্দ (Mnemonic Formula)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
              Subject Anchored ⚓
            </span>
          </div>

          <div className="text-base sm:text-lg font-extrabold text-amber-950 dark:text-amber-100 tracking-wide leading-relaxed">
            "{item.mnemonic_formula}"
          </div>
        </div>

        {/* Syllable / Acronym Breakdown Chips */}
        <div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>শব্দ ও অক্ষর বিভাজন (Step-by-Step Breakdown)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {item.breakdown.map((b, bIdx) => (
              <div
                key={bIdx}
                className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs"
              >
                <div className="min-w-8 px-1.5 h-7 rounded-md bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs text-center">
                  {b.code}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {b.meaning}
                  </div>
                  {b.phoneticHint && (
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                      {b.phoneticHint}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MCQ Avoid Confusion Tip */}
        {item.mcq_avoid_confusion_tip && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold text-rose-950 dark:text-rose-100">MCQ কনফিউশন গার্ড: </strong>
              {item.mcq_avoid_confusion_tip}
            </div>
          </div>
        )}

        {/* Toggle Visual Sketch */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setShowSketch(!showSketch)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showSketch ? 'ভিজ্যুয়াল স্কেচ লুকান' : 'ভিজ্যুয়াল স্কেচ ও কার্টুন ডুডল দেখুন'}</span>
            </button>

            {onSelectForPresentation && (
              <button
                onClick={() => onSelectForPresentation(item)}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
              >
                <span>স্লাইড প্রেজেন্টেশনে দেখুন</span>
              </button>
            )}
          </div>

          {showSketch && item.visual_cue && (
            <VisualSketchCanvas
              visualCue={item.visual_cue}
              formula={item.mnemonic_formula}
              topic={item.topic}
              question={item.question}
              correctAnswer={item.correct_answer}
            />
          )}
        </div>
      </div>
    </div>
  );
};
