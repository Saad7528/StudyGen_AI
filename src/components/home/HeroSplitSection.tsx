'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Wand2, 
  Layers, 
  Brain, 
  Gamepad2, 
  SpellCheck, 
  Calculator, 
  GitCompare, 
  CheckCircle2,
  Heart
} from 'lucide-react';

interface HeroSplitSectionProps {
  onSelectTab: (tabId: string) => void;
  onOpenCommandPalette: () => void;
}

export const HeroSplitSection: React.FC<HeroSplitSectionProps> = ({
  onSelectTab,
  onOpenCommandPalette
}) => {
  const [queryInput, setQueryInput] = useState('');

  const quickActionChips = [
    { id: 'memory-technique', label: '🧠 মেমরি টেকনিক ও ছন্দ', color: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400' },
    { id: 'mcq-game', label: '🎮 ক্রিয়েট MCQ গেম', color: 'hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400' },
    { id: 'question-paper', label: '📄 প্রশ্নপত্র তৈরি', color: 'hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400' },
    { id: 'omr-generator', label: '🫧 ওএমআর শিট', color: 'hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400' },
    { id: 'study-summary', label: '✨ এআই সামারি ও নোট', color: 'hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400' },
    { id: 'quiz-practice', label: '🗂️ ১০০+ কুইজ ও ফ্ল্যাশকার্ড', color: 'hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400' },
    { id: 'grammar-checker', label: '✍️ ব্যাকরণ ও বানান', color: 'hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400' },
    { id: 'math-solver', label: '🧮 সমীকরণ সমাধানকারী', color: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400' },
    { id: 'text-diff', label: '🔍 টেক্সট ডিফারেন্স চেকার', color: 'hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400' },
  ];

  const handleGenerateClick = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCommandPalette();
  };

  return (
    <div className="space-y-8">
      {/* =========================================================================
          MAIN DUAL-COLUMN HERO SECTION (Human-Touchable & Clean)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2 sm:pt-4">
        
        {/* LEFT COLUMN: Copy, Search Bar & Quick Action Chips (60%) */}
        <div className="lg:col-span-7 space-y-4 text-left">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>বাংলাদেশের শিক্ষার্থীদের জন্য AI সহায়ক</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-4.5xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.18]">
            খাতায় লিখুন, ছবি তুলুন — পেয়ে যান{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
              গুগল ডক এডিটেবল প্রশ্নপত্র
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
            হাতে লেখা বা বইয়ের পাতার ছবি আপলোড করলেই এআই স্বয়ংক্রিয়ভাবে সৃজনশীল (CQ), বহুনির্বাচনী (MCQ) ও মান বণ্টন সাজিয়ে <strong>১০০% এডিটেবল .docx</strong> ফাইল তৈরি করে দেয়।
          </p>

          {/* Integrated Search / Generation Bar (44px touch target) */}
          <form 
            onSubmit={handleGenerateClick}
            className="group relative flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-lg shadow-indigo-500/5 transition-all max-w-xl"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-4 h-4 text-indigo-500" />
            </div>

            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="কোন বিষয়ে প্রশ্নপত্র চান? যেমন: বাংলা, গণিত, পদার্থবিজ্ঞান..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none px-2 min-w-0"
            />

            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>জেনারেট করুন</span>
            </button>
          </form>

          {/* Quick Action Chips (Crisp & Ergonomic) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>দ্রুত অ্যাকশন:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {quickActionChips.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => onSelectTab(chip.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${chip.color}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Modern Vector Student & Docs Artwork (Visible on Desktop lg+) */}
        <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center">
          
          {/* Background Ambient Glow */}
          <div className="absolute w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/15 rounded-full blur-2xl -z-10" />

          {/* Interactive Illustration Composition */}
          <div className="relative w-full max-w-[400px] aspect-square rounded-2xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-slate-900/70 dark:to-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col items-center justify-center overflow-visible shadow-xl backdrop-blur-md">
            
            {/* Curved Friendly Slogan Badge */}
            <div className="absolute -top-3 -right-2 px-3.5 py-1 rounded-full bg-slate-900 text-pink-400 border border-pink-500/30 text-xs font-bold shadow-lg flex items-center gap-1.5 transform rotate-2">
              <span>পড়াশোনা হোক আরও সহজ</span>
              <span>✨</span>
            </div>

            {/* Floating Google Docs Icon Card */}
            <div className="absolute top-5 left-3 sm:-left-3 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 shadow-lg flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>Question.docx</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ১০০% এডিটেবল
                </div>
              </div>
            </div>

            {/* Floating Image Preview Badge */}
            <div className="absolute bottom-6 -left-1 sm:-left-3 p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 shadow-lg flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-pink-500/15 text-pink-500 flex items-center justify-center">
                <ImageIcon className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                খাতার ছবি OCR
              </span>
            </div>

            {/* Main Central Character & Study Scene (SVG Art) */}
            <div className="w-52 h-52 sm:w-60 sm:h-60 relative flex items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Back Screen / Laptop Glow */}
                <rect x="75" y="70" width="150" height="100" rx="10" fill="#3B82F6" fillOpacity="0.15" stroke="#6366F1" strokeWidth="2" />
                <rect x="90" y="85" width="120" height="70" rx="6" fill="#1E1B4B" />
                <path d="M100 100H140M100 115H170M100 130H150" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="180" cy="115" r="12" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.5" />
                <path d="M176 115L179 118L185 112" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Laptop Base */}
                <path d="M60 170H240L230 185H70L60 170Z" fill="#334155" />
                <rect x="135" y="173" width="30" height="3" rx="1.5" fill="#94A3B8" />

                {/* Character Body (Girl with Purple Hoodie) */}
                <path d="M110 270C110 220 190 220 190 270" fill="#7C3AED" />
                
                {/* Hoodie Neck & Collar */}
                <path d="M135 210L150 230L165 210H135Z" fill="#6D28D9" />

                {/* Head / Face */}
                <ellipse cx="150" cy="190" rx="22" ry="24" fill="#FCD34D" />
                {/* Hair */}
                <path d="M125 185C125 160 175 160 175 185C175 190 170 170 150 170C130 170 125 190 125 185Z" fill="#1E293B" />
                <path d="M125 185C120 205 125 220 130 225C132 215 130 200 135 195" fill="#1E293B" />
                <path d="M175 185C180 205 175 220 170 225C168 215 170 200 165 195" fill="#1E293B" />

                {/* Eyes & Friendly Smile */}
                <circle cx="143" cy="190" r="2" fill="#0F172A" />
                <circle cx="157" cy="190" r="2" fill="#0F172A" />
                <path d="M146 199C148 202 152 202 154 199" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />

                {/* Hands typing on keyboard */}
                <ellipse cx="120" cy="245" rx="8" ry="5" fill="#FCD34D" transform="rotate(-15 120 245)" />
                <ellipse cx="180" cy="245" rx="8" ry="5" fill="#FCD34D" transform="rotate(15 180 245)" />

                {/* Potted Plant (Left) */}
                <path d="M50 240H70L65 265H55L50 240Z" fill="#D97706" />
                <path d="M60 240C50 220 40 225 60 215C80 225 70 220 60 240Z" fill="#10B981" />

                {/* Books Stack (Right) */}
                <rect x="230" y="255" width="45" height="9" rx="1.5" fill="#EC4899" />
                <rect x="233" y="244" width="40" height="9" rx="1.5" fill="#3B82F6" />
                <rect x="235" y="233" width="36" height="9" rx="1.5" fill="#F59E0B" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM 4 QUICK FEATURE CARDS (Visible on Desktop lg+ to avoid duplicate mobile cards)
         ========================================================================= */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
        
        {/* Card 1: প্রশ্নপত্র তৈরি */}
        <div 
          onClick={() => onSelectTab('question-paper')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2.5"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              প্রশ্নপত্র তৈরি
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              বিষয়, অধ্যায়, নম্বর ও ধরন নির্বাচন করে কাস্টম প্রশ্নপত্র তৈরি করুন।
            </p>
          </div>
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
            <span>শুরু করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: ছবি থেকে প্রশ্ন */}
        <div 
          onClick={() => onSelectTab('quick-ocr')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500 dark:hover:border-pink-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2.5"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-pink-500/15 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              ছবি থেকে প্রশ্ন
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              ছবি তুলুন বা আপলোড করুন, AI স্বয়ংক্রিয়ভাবে প্রশ্ন তৈরি করবে।
            </p>
          </div>
          <div className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
            <span>শুরু করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Google Docs এ এডিট */}
        <div 
          onClick={() => onSelectTab('question-paper')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2.5"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FileCode className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Google Docs এ এডিট
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              তৈরি করা প্রশ্নপত্র সরাসরি গুগল ডকে এডিট ও প্রিন্ট করুন।
            </p>
          </div>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
            <span>জানুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: AI টুলস */}
        <div 
          onClick={() => onSelectTab('memory-technique')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2.5"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Wand2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI টুলস
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              মেমরি ছন্দ, কুইজ গেম, সংক্ষিপ্ত নোট, সারাংশ এবং আরও অনেক কিছু।
            </p>
          </div>
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-1">
            <span>সব টুলস দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Trust Micro-Line */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] font-medium text-slate-400">
        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        <span>হাজারো শিক্ষক ও শিক্ষার্থীর আস্থার সাথে</span>
      </div>
    </div>
  );
};
