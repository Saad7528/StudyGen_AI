'use client';

import React, { useState } from 'react';
import { MnemonicItem } from '@/types/mnemonic';
import { 
  Printer, 
  Download, 
  FileText, 
  Layout, 
  Check, 
  Sparkles, 
  Compass, 
  ShieldCheck,
  BookOpen,
  Table
} from 'lucide-react';

interface MnemonicPrintHandoutProps {
  items: MnemonicItem[];
  title?: string;
  onClose?: () => void;
}

export const MnemonicPrintHandout: React.FC<MnemonicPrintHandoutProps> = ({
  items,
  title = 'StudyGenAI মেমরি টেকনিক ও রিভিশন হ্যান্ডআউট',
  onClose
}) => {
  const [printMode, setPrintMode] = useState<'master_side_by_side' | 'a4_cheatsheet' | 'slide_deck'>('master_side_by_side');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Banner (Hidden on Print) */}
      <div className="print:hidden p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট ও পিডিএফ এক্সপোর্ট কনফিগারেশন</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            নিচের যেকোনো একটি লেআউট পছন্দ করে এক ক্লিকে ব্রাউজার থেকে রঙিন পিডিএফ হিসেবে সংরক্ষণ বা প্রিন্ট করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPrintMode('master_side_by_side')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                printMode === 'master_side_by_side'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📑 মাস্টার টেবিল (ডানে ছবি)
            </button>
            <button
              onClick={() => setPrintMode('a4_cheatsheet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                printMode === 'a4_cheatsheet'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📄 A4 রিভিশন শিট
            </button>
            <button
              onClick={() => setPrintMode('slide_deck')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                printMode === 'slide_deck'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📽️ স্লাইড ডেক
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>PDF ডাউনলোড / প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE CANVAS (Optimized for standard A4, Master Table & Slide Booklets)
         ========================================================================= */}
      <div 
        id="printable-mnemonic-handout"
        className="printable-area bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-5xl mx-auto print:p-0 print:border-none print:shadow-none print:max-w-none"
      >
        {/* Document Header */}
        <div className="border-b-2 border-indigo-600 pb-4 mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-black text-xl tracking-tight">
              <span>StudyGenAI</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                স্মার্ট মেমরি টেকনিক ও ভিজ্যুয়াল আর্ট
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 mt-1">{title}</h1>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>তারিখ: {new Date().toLocaleDateString('bn-BD')}</div>
            <div>মোট ফর্মুলা: {items.length} টি</div>
          </div>
        </div>

        {/* MODE 0: MASTER DUAL COLUMN (Side-by-side with Art Image) */}
        {printMode === 'master_side_by_side' && (
          <div className="space-y-6">
            {items.map((item, idx) => {
              const fallbackImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
                `colored pencil hand-drawn sketch illustration, ${item.visual_cue.sketch_prompt || item.mnemonic_formula}, ${item.topic}, vintage educational textbook art`
              )}?width=800&height=600&nologo=true&enhance=true`;

              const displayImageUrl = item.image_url || item.visual_cue.image_url || fallbackImageUrl;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl border-2 border-slate-300 bg-[#FCFBF8] break-inside-avoid page-break-inside-avoid space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                    <span className="font-extrabold text-sm text-indigo-700">
                      #{idx + 1} টপিক: {item.topic}
                    </span>
                    <span className="text-xs bg-slate-200 px-2.5 py-0.5 rounded-full font-bold">
                      {item.exam_target || 'বিসিএস / ভর্তি'}
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* LEFT: Text, Formula & Breakdown (65%) */}
                    <div className="col-span-8 space-y-3">
                      <div>
                        <div className="text-xs text-slate-600 font-bold">
                          <strong>প্রশ্ন:</strong> {item.question}
                        </div>
                        <div className="text-xs text-emerald-800 font-extrabold mt-0.5">
                          <strong>সঠিক উত্তর:</strong> {item.correct_answer}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-100 border-2 border-amber-400">
                        <span className="text-[10px] font-bold text-amber-900 uppercase block">
                          মনে রাখার মূল বাংলা ছন্দ ও সূত্র:
                        </span>
                        <div className="text-sm font-black text-amber-950 mt-0.5">
                          "{item.mnemonic_formula}"
                        </div>
                      </div>

                      {/* Syllable Breakdown Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.breakdown.map((b, bIdx) => (
                          <span
                            key={bIdx}
                            className="inline-flex items-center gap-1 text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-300 font-semibold text-slate-800 shadow-xs"
                          >
                            <b className="text-indigo-700 font-extrabold">{b.code}</b> = {b.meaning}
                          </span>
                        ))}
                      </div>

                      {item.mcq_avoid_confusion_tip && (
                        <div className="text-[10px] text-rose-900 bg-rose-50 p-2 rounded-xl border border-rose-200">
                          <strong>⚠️ MCQ কনফিউশন গার্ড:</strong> {item.mcq_avoid_confusion_tip}
                        </div>
                      )}
                    </div>

                    {/* RIGHT: Visual Art Image (35%) */}
                    <div className="col-span-4 space-y-1.5 text-center">
                      <div className="rounded-2xl overflow-hidden border-2 border-amber-400 shadow-sm bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={displayImageUrl}
                          alt={item.mnemonic_formula}
                          className="w-full h-36 object-cover"
                        />
                      </div>
                      {item.visual_cue.cartoon_dialogue && (
                        <p className="text-[10px] italic text-amber-950 font-bold bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                          💬 "{item.visual_cue.cartoon_dialogue}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODE 1: A4 COMPACT CHEAT-SHEET */}
        {printMode === 'a4_cheatsheet' && (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border-2 border-slate-200 bg-[#FCFBF8] break-inside-avoid page-break-inside-avoid"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <span className="font-bold text-xs text-indigo-700">
                    #{idx + 1} টপিক: {item.topic}
                  </span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-semibold">
                    {item.exam_target || 'বিসিএস / ভর্তি'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-5 space-y-1">
                    <div className="text-xs text-slate-600 font-medium">
                      <strong>প্রশ্ন:</strong> {item.question}
                    </div>
                    <div className="text-xs text-emerald-800 font-bold">
                      <strong>সঠিক উত্তর:</strong> {item.correct_answer}
                    </div>
                  </div>

                  <div className="md:col-span-7 p-3 rounded-xl bg-amber-50 border border-amber-300">
                    <div className="text-xs font-black text-amber-950">
                      ⚡ সূত্র: "{item.mnemonic_formula}"
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.breakdown.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className="inline-flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded border border-amber-200 font-semibold text-slate-800"
                        >
                          <b className="text-indigo-600 font-bold">{b.code}</b> = {b.meaning}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {item.mcq_avoid_confusion_tip && (
                  <div className="mt-2 text-[10px] text-rose-800 bg-rose-50 p-1.5 rounded border border-rose-200">
                    <strong>⚠️ কনফিউশন দূরীকরণ:</strong> {item.mcq_avoid_confusion_tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* MODE 2: VISUAL SLIDE DECK (Illustrated Booklets) */}
        {printMode === 'slide_deck' && (
          <div className="space-y-8">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border-2 border-slate-300 bg-slate-50 break-inside-avoid page-break-inside-avoid space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    স্লাইড #{idx + 1}: {item.topic}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    StudyGenAI Visual Deck
                  </span>
                </div>

                <div className="text-center py-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">প্রশ্ন</span>
                  <h3 className="text-lg font-black text-slate-900">{item.question}</h3>
                  <div className="text-sm font-bold text-emerald-700 mt-1">
                    উত্তর: {item.correct_answer}
                  </div>
                </div>

                {/* Mnemonic Banner */}
                <div className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-400 text-center">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    মনে রাখার ছন্দ ও মেমোরি হ্যাক
                  </span>
                  <div className="text-xl font-extrabold text-amber-950 mt-1">
                    "{item.mnemonic_formula}"
                  </div>
                </div>

                {/* Visual Sketch Summary */}
                {item.visual_cue && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-300 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      <div className="text-xs font-bold text-indigo-700 uppercase mb-1">
                        🎨 ভিজ্যুয়াল মেমোরি দৃশ্য
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        "{item.visual_cue.description}"
                      </p>
                      {item.visual_cue.cartoon_dialogue && (
                        <div className="mt-2 text-xs italic bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900 font-semibold">
                          ডায়ালগ: "{item.visual_cue.cartoon_dialogue}"
                        </div>
                      )}
                    </div>

                    {/* Syllable Breakdown */}
                    <div>
                      <div className="text-xs font-bold text-slate-700 uppercase mb-1.5">
                        🔍 শব্দ বিশ্লেষণ
                      </div>
                      <div className="space-y-1">
                        {item.breakdown.map((b, bIdx) => (
                          <div key={bIdx} className="text-xs bg-slate-100 p-1.5 rounded flex items-center justify-between">
                            <span className="font-bold text-indigo-600">{b.code}</span>
                            <span className="text-slate-800 font-semibold">{b.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Print Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>StudyGenAI Platform • স্মার্ট মেমরি ইঞ্জিন ২০২৬</span>
          <span>studygenai.app</span>
        </div>
      </div>
    </div>
  );
};
