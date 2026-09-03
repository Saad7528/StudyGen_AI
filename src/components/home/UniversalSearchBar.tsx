'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Layers, 
  SpellCheck, 
  Calculator, 
  GitCompare, 
  BookOpen,
  Command,
  Gamepad2
} from 'lucide-react';

interface UniversalSearchBarProps {
  onSelectTab: (tabId: string) => void;
  onOpenCommandPalette: () => void;
}

export const UniversalSearchBar: React.FC<UniversalSearchBarProps> = ({
  onSelectTab,
  onOpenCommandPalette
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const quickChips = [
    { id: 'mcq-game', label: '🎮 ক্রিয়েট MCQ গেম', icon: Gamepad2, color: 'hover:border-purple-500 hover:text-purple-500' },
    { id: 'question-paper', label: '📄 প্রশ্নপত্র তৈরি', icon: FileText, color: 'hover:border-indigo-500 hover:text-indigo-500' },
    { id: 'omr-generator', label: '🫧 ওএমআর শিট', icon: Layers, color: 'hover:border-blue-500 hover:text-blue-500' },
    { id: 'study-summary', label: '✨ এআই সামারি ও নোট', icon: Sparkles, color: 'hover:border-purple-500 hover:text-purple-500' },
    { id: 'quiz-practice', label: '🗂️ ১০০+ কুইজ ও ফ্ল্যাশকার্ড', icon: Sparkles, color: 'hover:border-pink-500 hover:text-pink-500' },
    { id: 'grammar-checker', label: '✍️ ব্যাকরণ ও বানান', icon: SpellCheck, color: 'hover:border-emerald-500 hover:text-emerald-500' },
    { id: 'math-solver', label: '🧮 সমীকরণ সমাধানকারী', icon: Calculator, color: 'hover:border-amber-500 hover:text-amber-500' },
    { id: 'text-diff', label: '🔍 টেক্সট ডিফারেন্স চেকার', icon: GitCompare, color: 'hover:border-cyan-500 hover:text-cyan-500' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCommandPalette();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pt-2">
      {/* Search Bar Input Container */}
      <div 
        onClick={onOpenCommandPalette}
        className="group relative flex items-center gap-3 p-2 sm:p-2.5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border-2 border-indigo-500/20 dark:border-indigo-500/30 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-xl shadow-indigo-500/5 backdrop-blur-xl transition-all duration-300 cursor-pointer"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
          <Search className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            কী করতে চান খুঁজুন...
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 truncate hidden sm:block">
            যেমন: ওএমআর শিট, এআই সামারি, ব্যাকরণ চেক, প্রশ্ন তৈরি বা বীজগণিত সমাধান
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <Command className="w-3.5 h-3.5" /> K
          </span>
          <button
            type="button"
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>খুলুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          দ্রুত অ্যাকশন:
        </span>
        {quickChips.map(chip => (
          <button
            key={chip.id}
            onClick={() => onSelectTab(chip.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm transition-all hover:scale-105 cursor-pointer ${chip.color}`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
