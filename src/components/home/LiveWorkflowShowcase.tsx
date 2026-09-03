'use client';

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Cpu, 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  FileCode, 
  Check, 
  Play, 
  Pause 
} from 'lucide-react';

export const LiveWorkflowShowcase: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [scanProgress, setScanProgress] = useState<number>(0);

  const steps = [
    {
      step: 0,
      title: '১. ছবি তুলুন বা আপলোড দিন',
      desc: 'হাতে লেখা নোট, গাইড বই বা পরীক্ষার পাতার যেকোনো অ্যাঙ্গেলের ছবি ক্যামেরা দিয়ে তুলুন বা আপলোড করুন।',
      icon: Camera,
      badge: 'ইনপুট',
      accent: 'from-blue-500 to-indigo-600',
      tagColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    },
    {
      step: 1,
      title: '২. AI স্মার্ট কনভার্সন ও ফরম্যাটিং',
      desc: 'উন্নত বাংলা OCR ও AI সৃজনশীল (CQ), বহুনির্বাচনী (MCQ) এবং ম্যাথ সমীকরণকে আলাদা করে সাজায়।',
      icon: Cpu,
      badge: 'AI প্রসেসিং',
      accent: 'from-purple-500 to-pink-600',
      tagColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    },
    {
      step: 2,
      title: '৩. এডিটেবল ডকক্স ও ওএমআর রেডি',
      desc: 'সরাসরি গুগল ডকক্স ও মাইক্রোসফট ওয়ার্ডে এডিটযোগ্য .docx ফাইল ও ওএমআর শিট রেডি ও ডাউনলোড।',
      icon: FileCheck,
      badge: 'আউটপুট',
      accent: 'from-emerald-500 to-teal-600',
      tagColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    }
  ];

  // Auto step cycle
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  // Animated Scan Progress on Step 1
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    if (activeStep === 1) {
      setScanProgress(15);
      progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 98) {
            clearInterval(progressInterval);
            return 98;
          }
          return prev + 12;
        });
      }, 350);
    } else {
      setScanProgress(0);
    }
    return () => clearInterval(progressInterval);
  }, [activeStep]);

  return (
    <div className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-indigo-50/70 via-white/70 to-purple-50/50 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-indigo-950/40 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-xl overflow-hidden relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
          <span>ইন্টারেক্টিভ লাইভ ডেমো</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          মাত্র ৩টি সহজ ধাপে আপনার পারফেক্ট প্রশ্নপত্র
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          জটিল টাইপিংয়ের ঝামেলা ছাড়াই কয়েক সেকেন্ডে প্রফেশনাল পরীক্ষার প্রশ্নপত্র তৈরি করুন
        </p>
      </div>

      {/* Main Split Layout: Left (List of Steps) + Right (Live Animation Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* =========================================================
            LEFT COLUMN (5 Cols): Compact Step List / Timeline
           ========================================================= */}
        <div className="lg:col-span-5 space-y-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeStep;

            return (
              <div
                key={item.step}
                onClick={() => {
                  setActiveStep(index);
                  setIsPlaying(false);
                }}
                className={`group p-4 rounded-2xl transition-all duration-300 border cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-500 shadow-xl shadow-indigo-500/10 translate-x-1'
                    : 'bg-white/60 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-800/60'
                }`}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                )}

                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.accent} text-white flex items-center justify-center shrink-0 shadow-md ${
                      isActive ? 'scale-105 ring-2 ring-indigo-400/30' : 'opacity-80'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className={`text-xs sm:text-sm font-bold truncate ${
                        isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {item.title}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${item.tagColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Progress bar line for active step */}
                {isActive && isPlaying && (
                  <div className="mt-3 w-full bg-slate-100 dark:bg-slate-700/60 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-[shimmer_4.5s_linear_infinite] w-full" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Player controls */}
          <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-indigo-600 transition flex items-center gap-1 font-bold text-[11px] cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{isPlaying ? 'অটো-প্লে চলছে' : 'প্লে করুন'}</span>
              </button>
            </div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
              ধাপ {activeStep + 1} / ৩
            </span>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN (7 Cols): Sleek Animated Simulator Canvas
           ========================================================= */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col min-h-[350px] sm:min-h-[390px]">
            
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block opacity-80" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block opacity-80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block opacity-80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">StudyGen-AI-Engine.app</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Live AI Stream</span>
              </div>
            </div>

            {/* Animation Stage Canvas */}
            <div className="flex-1 p-5 sm:p-6 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900">
              
              {/* -------------------------------------------------------------
                  STAGE 1: PHOTO INPUT & LASER OCR SCANNING
                 ------------------------------------------------------------- */}
              {activeStep === 0 && (
                <div className="w-full max-w-md space-y-4 animate-fade-in relative">
                  {/* Photo paper container */}
                  <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 p-4 shadow-2xl overflow-hidden">
                    {/* Pulsing laser scan line */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[floatSlow_2.5s_ease-in-out_infinite] z-20" />

                    {/* Corner crop target markers */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-10" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-10" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-10" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-10" />

                    {/* Simulated Handwritten / Book Page */}
                    <div className="space-y-2.5 opacity-90">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-slate-200">হাতে লেখা গণিত প্রশ্নপত্রের ছবি.jpg</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          স্ক্যানিং চলছে...
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300">
                        <p className="text-indigo-300 font-bold">১। উদ্দীপক: f(x) = 2x² - 5x + 3 একটি বীজগাণিতিক রাশি।</p>
                        <p className="text-slate-400">ক) f(0) এর মান নির্ণয় কর। [মান: ২]</p>
                        <p className="text-slate-400">খ) সমীকরণটির মূলদ্বয়ের প্রকৃতি নির্ণয় কর। [মান: ৪]</p>
                        <p className="text-slate-400">গ) KaTeX সমীকরণ প্রমাণ কর: ax² + bx + c = 0 [মান: ৪]</p>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Upload Finished Bar */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                    <span className="flex items-center gap-2 text-cyan-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      ছবি আপলোড সফল ও ক্রপ শনাক্ত
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">1920x1080 • 2.4 MB</span>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STAGE 2: AI BRAIN CONVERSION & PROCESSING
                 ------------------------------------------------------------- */}
              {activeStep === 1 && (
                <div className="w-full max-w-md space-y-4 animate-fade-in text-center">
                  {/* Glowing AI Core */}
                  <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-xl shadow-purple-500/25 animate-pulse-glow flex items-center justify-center">
                    <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">বাংলা AI প্রসেসিং ও ফরম্যাটিং</h4>
                    <p className="text-xs text-slate-400 mt-0.5">সৃজনশীল উদ্দীপক, MCQ বাবল ও সমীকরণ পৃথকীকরণ হচ্ছে...</p>
                  </div>

                  {/* Progress Bar & Badges */}
                  <div className="space-y-2">
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono font-bold">
                      <span>বিশ্লেষণ অগ্রগতি</span>
                      <span className="text-purple-400">{scanProgress}%</span>
                    </div>
                  </div>

                  {/* Live tags being classified */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-800/60 text-[11px] text-purple-300 font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-purple-400" />
                      <span>CQ সৃজনশীল (ক,খ,গ,ঘ)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-pink-950/40 border border-pink-800/60 text-[11px] text-pink-300 font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-pink-400" />
                      <span>MCQ অপশন ও সঠিক উত্তর</span>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STAGE 3: DOCX / GOOGLE DOCS READY & DOWNLOAD
                 ------------------------------------------------------------- */}
              {activeStep === 2 && (
                <div className="w-full max-w-md space-y-3.5 animate-fade-in">
                  {/* Miniature A4 Question Paper Preview */}
                  <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 relative overflow-hidden">
                    <div className="text-center pb-2 mb-2 border-b border-slate-200">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">মডেল টেস্ট ও চূড়ান্ত পরীক্ষা ২০২৬</div>
                      <h5 className="text-xs font-black text-indigo-700">উচ্চতর গণিত ও বিজ্ঞান প্রশ্নপত্র</h5>
                      <div className="text-[9px] text-slate-600 mt-0.5">সময়: ২ ঘণ্টা ৩০ মিনিট | পূর্ণমান: ১০০</div>
                    </div>

                    <div className="space-y-1.5 text-[10px] text-slate-700">
                      <div className="font-bold text-slate-900 flex justify-between">
                        <span>১। বীজগাণিতিক সমীকরণ সমাধান:</span>
                        <span className="text-indigo-600">[মান: ১০]</span>
                      </div>
                      <p className="text-[9px] text-slate-500 pl-2">ক) বহুপদী রাশির মাত্রা কত? [২]</p>
                      <p className="text-[9px] text-slate-500 pl-2">খ) সমীকরণটির বীজ নির্ণয় কর। [৪]</p>
                    </div>

                    {/* Verified 100% Editable Badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold border border-emerald-300">
                      ১০০% এডিটেবল Docx
                    </div>
                  </div>

                  {/* Download Action Strip */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-700/60 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-emerald-500 text-white">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-300 text-xs">question_paper_final.docx</div>
                        <div className="text-[10px] text-slate-400">Google Docs / MS Word Ready</div>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                      <Download className="w-3.5 h-3.5" />
                      ডাউনলোড
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
