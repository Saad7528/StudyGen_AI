'use client';

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  BrainCircuit, 
  Layers, 
  Play, 
  FileCheck, 
  ScanLine,
  Heart,
  Timer,
  Flame,
  Trophy,
  Check,
  Pause,
  RotateCcw
} from 'lucide-react';

interface InteractiveLaunchpadSectionProps {
  onOpenModal: (tab: 'image' | 'file' | 'paste') => void;
}

export const InteractiveLaunchpadSection: React.FC<InteractiveLaunchpadSectionProps> = ({
  onOpenModal
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'image' | 'file' | 'paste'>('image');
  const [animStep, setAnimStep] = useState<number>(0); // 0: Input/Scan, 1: AI Processing, 2: Live Play Arena, 3: Victory Score
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Auto-cycle through the 4 live stages
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, [selectedMethod, isAutoPlaying]);

  const methods = [
    {
      id: 'image' as const,
      number: '০১',
      title: 'ছবি ও খাতার নোট থেকে গেম',
      subtitle: 'হাতে লেখা প্রশ্ন বা বইয়ের পাতার ছবি দিন',
      desc: 'AI স্বয়ংক্রিয়ভাবে হাতের লেখা পড়ে সঠিক উত্তর ও ৪টি অপশন তৈরি করে লাইভ গেম বানিয়ে দেবে।',
      icon: Camera,
      color: 'indigo',
      gradient: 'from-indigo-600 to-purple-600',
      badge: 'ক্যামেরা ও স্ক্যান',
      accentBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80',
      activeBorder: 'border-indigo-500 shadow-indigo-500/15'
    },
    {
      id: 'file' as const,
      number: '০২',
      title: 'ডকুমেন্ট ফাইল ও শিট',
      subtitle: '.docx, .pdf বা .txt ফাইল ড্রপ করুন',
      desc: 'যেকোনো বড় চ্যাপ্টার, হ্যান্ডনোট বা ডকুমেন্ট ফাইল দিলে পুরো কনটেন্ট মুহূর্তেই কুইজ গেমে রূপ নেবে।',
      icon: Upload,
      color: 'purple',
      gradient: 'from-purple-600 to-pink-600',
      badge: 'PDF / DOCX / TXT',
      accentBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/80',
      activeBorder: 'border-purple-500 shadow-purple-500/15'
    },
    {
      id: 'paste' as const,
      number: '০৩',
      title: 'সরাসরি প্রশ্ন পেস্ট / টাইপ',
      subtitle: 'উত্তর ছাড়া প্রশ্ন পেস্ট করলেও চলবে',
      desc: 'প্রশ্ন বা টপিক পেস্ট করলেই AI নিজ থেকে সঠিক উত্তর খুঁজে, নিখুঁত ৩টি বিকল্প বানিয়ে গেম বানাবে।',
      icon: FileText,
      color: 'emerald',
      gradient: 'from-emerald-600 to-teal-600',
      badge: 'ইনস্ট্যান্ট পেস্ট',
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80',
      activeBorder: 'border-emerald-500 shadow-emerald-500/15'
    }
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              🚀 নিজের AI MCQ কুইজ গেম যেভাবে তৈরি করবেন
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            বাম পাশের যেকোনো মেথড সিলেক্ট করুন এবং ডানে স্বয়ংক্রিয় প্রসেসিং থেকে গেম খেলার লাইভ সিমুলেশন দেখুন
          </p>
        </div>

        <button
          onClick={() => onOpenModal(selectedMethod)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>এখনই গেম বানান</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main 2-Column Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* =========================================================================
            LEFT COLUMN: SERIAL LIST OF 3 OPTIONS (VERTICAL)
           ========================================================================= */}
        <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <div
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method.id);
                  setAnimStep(0);
                }}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? `${method.accentBg} ${method.activeBorder} shadow-lg scale-[1.02]`
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Glow Bar */}
                {isSelected && (
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b ${method.gradient}`} />
                )}

                <div className="flex items-start gap-3.5 pl-1">
                  {/* Serial Number & Icon */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md bg-gradient-to-tr ${method.gradient} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        মেথড {method.number}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {method.badge}
                      </span>
                    </div>

                    <h4 className={`text-sm sm:text-base font-black mt-1 transition-colors ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {method.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {method.desc}
                    </p>

                    {/* Quick Trigger Button inside selected card */}
                    {isSelected && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenModal(method.id);
                          }}
                          className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:underline cursor-pointer"
                        >
                          <span>এই মেথডে শুরু করুন</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-semibold text-slate-400">
                          AI অটোমেটিক
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            RIGHT COLUMN: REAL STEP-BY-STEP ANIMATED WORKFLOW SHOWCASE
           ========================================================================= */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-5 sm:p-7 border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[440px]">
          
          {/* Ambient Background Glow FX */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Stage Bar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold tracking-wide uppercase text-indigo-300">
                লাইভ প্রসেসিং সিমুলেশন
              </span>
            </div>

            {/* Stage Selector Pills */}
            <div className="flex items-center gap-1.5">
              {[
                { step: 0, label: '১. ইনপুট' },
                { step: 1, label: '২. AI সলভ' },
                { step: 2, label: '৩. গেম প্লে' },
                { step: 3, label: '৪. স্কোর' }
              ].map(s => (
                <button
                  key={s.step}
                  onClick={() => {
                    setAnimStep(s.step);
                    setIsAutoPlaying(false);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition cursor-pointer ${
                    animStep === s.step
                      ? 'bg-indigo-600 text-white shadow-xs scale-105'
                      : 'bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* =========================================================================
              DYNAMIC MAIN STAGE BODY: TRANSITIONS THROUGH 4 VISUAL PHASES
             ========================================================================= */}
          <div className="py-4 my-auto relative z-10">
            
            {/* -------------------------------------------------------------
                PHASE 0: RAW INPUT & LASER SCANNING STAGE
               ------------------------------------------------------------- */}
            {animStep === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
                  <span className="flex items-center gap-1.5">
                    <ScanLine className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>ধাপ ১: কনটেন্ট ইনপুট ও অপটিক্যাল স্ক্যানিং</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    স্ক্যানিং সক্রিয়
                  </span>
                </div>

                {/* Simulated Document / Photo with Laser Beam */}
                <div className="relative p-5 rounded-2xl bg-slate-800/90 border border-cyan-500/40 overflow-hidden shadow-inner font-mono text-xs">
                  {/* Glowing Laser Scan Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-bounce" />
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 border-b border-slate-700/80 pb-2">
                    <span className="text-cyan-300 font-bold">
                      {selectedMethod === 'image' && '📸 photo_question_note.jpg'}
                      {selectedMethod === 'file' && '📄 ICT_Chapter_3_Document.pdf'}
                      {selectedMethod === 'paste' && '📝 Raw_Text_Question_Bank.txt'}
                    </span>
                    <span className="text-emerald-400 font-bold">৯৯.৮% নির্ভুল OCR</span>
                  </div>

                  <div className="space-y-2.5 text-slate-300 text-xs">
                    <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                      <span>১. HTML5-এ semantic tag কোনটি?</span>
                      <span className="text-[10px] text-cyan-400 font-bold">শনাক্ত ✓</span>
                    </div>
                    <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                      <span>২. CSS Box Model-এর বাইরের অংশ কোনটি?</span>
                      <span className="text-[10px] text-cyan-400 font-bold">শনাক্ত ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                PHASE 1: AI BRAIN SYNTHESIS & OPTION FORMULATION STAGE
               ------------------------------------------------------------- */}
            {animStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-purple-300 font-bold px-1">
                  <span className="flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-purple-400 animate-spin" />
                    <span>ধাপ ২: Gemini AI সমাধান ও ৪টি স্মার্ট অপশন তৈরি</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    AI প্রসেসিং
                  </span>
                </div>

                {/* Synthesis Pipeline Box */}
                <div className="p-5 rounded-2xl bg-slate-800/90 border border-purple-500/40 shadow-inner space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400 text-purple-300 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">প্রশ্নটির সমাধান ও ডিস্ট্রাক্টর তৈরি হচ্ছে...</span>
                        <span className="text-[10px] text-purple-300 font-bold">১০০% সম্পন্ন</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 h-1.5 rounded-full w-full animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                    <div className="p-2 rounded-lg bg-purple-950/50 border border-purple-500/30 text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>সঠিক উত্তর: &lt;article&gt;</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-400">
                      বিকল্প ১: &lt;div&gt;
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-400">
                      বিকল্প ২: &lt;span&gt;
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-400">
                      বিকল্প ৩: &lt;b&gt;
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                PHASE 2: LIVE GAMIFIED PLAY ARENA CARD (WITH SOUND & COMBOS)
               ------------------------------------------------------------- */}
            {animStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-pink-300 font-bold px-1">
                  <span className="flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-pink-400 fill-current" />
                    <span>ধাপ ৩: লাইভ গেমপ্লে ও কম্বো স্ট্রিক অ্যারেনা</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    🎮 গেম লাইভ
                  </span>
                </div>

                {/* Gamified Play Arena Card */}
                <div className="p-5 rounded-2xl bg-slate-900 border-2 border-indigo-500/60 shadow-2xl space-y-3 relative overflow-hidden">
                  
                  {/* Game Status Bar */}
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black">
                      প্রশ্ন ১ / ১০
                    </span>

                    <div className="flex items-center gap-3">
                      {/* Hearts */}
                      <div className="flex items-center gap-0.5 text-rose-500 text-xs">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </div>

                      {/* Score Badge */}
                      <div className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-300" />
                        <span>১৫০ pts</span>
                      </div>

                      {/* Timer */}
                      <div className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        <span>২০s</span>
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h5 className="text-xs sm:text-sm font-black text-white pt-1">
                    HTML5-এ নিচের কোনটি একটি Semantic Element?
                  </h5>

                  {/* 4 Interactive Option Buttons (Showing active correct click) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-bold flex items-center justify-between shadow-md shadow-emerald-500/20 scale-[1.02]">
                      <span>ক. &lt;article&gt;</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400">
                      <span>খ. &lt;div&gt;</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400">
                      <span>গ. &lt;span&gt;</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400">
                      <span>ঘ. &lt;b&gt;</span>
                    </div>
                  </div>

                  {/* Combo Streak Popup */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-amber-300 font-extrabold">
                    <span className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                      <Flame className="w-3.5 h-3.5 fill-current text-orange-400" />
                      <span>🔥 2x Combo! (+৫০ বোনাস পয়েন্ট)</span>
                    </span>
                    <span className="text-emerald-400 font-bold">সঠিক উত্তর! ➔</span>
                  </div>

                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                PHASE 3: VICTORY REPORT & COMMUNITY PUBLISH
               ------------------------------------------------------------- */}
            {animStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold px-1">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>ধাপ ৪: ভিক্টরি ট্রফি ও কমিউনিটি পাবলিশ</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    🏆 বিজয়ী
                  </span>
                </div>

                {/* Victory Scorecard Preview */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50">
                    <Trophy className="w-6 h-6" />
                  </div>

                  <div>
                    <h5 className="text-sm font-black text-white">🏆 গ্র্যান্ডমাস্টার স্কলার (১০০% নির্ভুল)</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">মোট স্কোর: ১,২৫০ pts • সময়: ১ মিনিট ১৫ সেকেন্ড</p>
                  </div>

                  <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-[11px] text-purple-200 flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>কমিউনিটিতে সেভ করা হয়েছে • ১০টি লাইক পেলেই পার্মানেন্ট!</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Interactive Stage Progress & Action */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            {/* Auto-play toggle / replay button */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <button
                onClick={() => {
                  setIsAutoPlaying(true);
                  setAnimStep(0);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center gap-1 cursor-pointer transition text-[11px] font-bold"
                title="অ্যানিমেশন আবার প্রথম থেকে চালু করুন"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রি-প্লে</span>
              </button>
              <span className="text-[11px]">
                {isAutoPlaying ? 'অটো-সিমুলেশন চলছে...' : 'ধাপ নির্বাচন সক্রিয়'}
              </span>
            </div>

            {/* Launch Modal Action */}
            <button
              onClick={() => onOpenModal(selectedMethod)}
              className="px-5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current text-indigo-600" />
              <span>এই মেথডে গেম তৈরি করুন</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
