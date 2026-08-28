'use client';

import React from 'react';
import { Sparkles, Heart, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/60 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                <span className="text-cyan-600 dark:text-cyan-400">Study</span>
                <span className="text-indigo-600 dark:text-indigo-400">Gen</span>
                <span className="text-orange-500 ml-1">AI</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-bold">
                স্টাডিজেন
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              শিক্ষার্থী, শিক্ষক ও সাধারণ মানুষের জটিল কাজকে সহজ ও আধুনিক করতে নির্মিত এআই এডুকেশন হাব।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" /> .docx ও A4 PDF
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-indigo-500">
              <FileText className="w-4 h-4" /> ওএমআর বাবল শিট
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-500">
              <Sparkles className="w-4 h-4" /> ফ্ল্যাশকার্ড ও কুইজ
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-pink-500">
              <Sparkles className="w-4 h-4" /> এআই স্টাডি সামারি
            </span>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} StudyGen AI. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1.5 flex-wrap justify-center">
            তৈরি করেছেন{' '}
            <a
              href="https://saad-portfolio-eta-three.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              S. M. Amirul Islam Saad
            </a>{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> শিক্ষা ও প্রযুক্তি প্রেমীদের জন্য।
          </p>
        </div>
      </div>
    </footer>
  );
};
