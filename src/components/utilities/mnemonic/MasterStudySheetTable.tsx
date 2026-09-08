'use client';

import React, { useState } from 'react';
import { MnemonicItem } from '@/types/mnemonic';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Eye, 
  Maximize2, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  AlertTriangle,
  Compass,
  ImageIcon,
  RefreshCw,
  X
} from 'lucide-react';

interface MasterStudySheetTableProps {
  items: MnemonicItem[];
}

export const MasterStudySheetTable: React.FC<MasterStudySheetTableProps> = ({ items }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; desc: string } | null>(null);

  const handleCopyRow = (item: MnemonicItem) => {
    const text = `📌 প্রশ্ন: ${item.question}\n✅ সঠিক উত্তর: ${item.correct_answer}\n✨ মনে রাখার ছন্দ: ${item.mnemonic_formula}\n🔍 ভাঙন: ${item.breakdown.map(b => `${b.code} = ${b.meaning}`).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Info */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-semibold">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>মাস্টার স্টাডি শিট:</strong> বামপাশে প্রশ্ন ও শর্টকাট সূত্র এবং ডানপাশে সংশ্লিষ্ট রঙিন ভিজ্যুয়াল মেমরি আর্ট।
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 font-bold">
          মোট এন্ট্রি: {items.length} টি
        </span>
      </div>

      {/* Dual Column Master Study Rows */}
      <div className="space-y-6">
        {items.map((item, idx) => {
          // Construct or fallback AI image url
          const fallbackImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
            `colored pencil hand-drawn sketch illustration, ${item.visual_cue.sketch_prompt || item.mnemonic_formula}, ${item.topic}, vintage educational textbook art`
          )}?width=800&height=600&nologo=true&enhance=true`;

          const displayImageUrl = item.image_url || item.visual_cue.image_url || fallbackImageUrl;

          return (
            <div
              key={item.id || idx}
              className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Row Header */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    {item.topic}
                  </span>
                  {item.exam_target && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-semibold border border-amber-300 dark:border-amber-800">
                      {item.exam_target}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleCopyRow(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>টেক্সট কপি</span>
                    </>
                  )}
                </button>
              </div>

              {/* Main Dual-Column Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 items-center">
                {/* LEFT COLUMN: Question + Answer + Mnemonic Formula + Breakdown (60%) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Question & Answer */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold mt-0.5 shrink-0">
                        প্রশ্ন
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {item.question}
                      </h3>
                    </div>

                    <div className="flex items-start gap-2 pl-1">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mt-0.5 shrink-0">
                        সঠিক উত্তর
                      </span>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        {item.correct_answer}
                      </p>
                    </div>
                  </div>

                  {/* Highlighted Bengali Mnemonic Formula Banner */}
                  <div className="p-4 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        মনে রাখার মূল ছন্দ ও শর্টকাট সূত্র
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                        Anchor ⚓
                      </span>
                    </div>

                    <div className="text-base sm:text-xl font-black text-amber-950 dark:text-amber-100 leading-snug">
                      "{item.mnemonic_formula}"
                    </div>
                  </div>

                  {/* Syllable Breakdown Grid */}
                  <div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
                      🔍 শব্দ ও অক্ষর বিভাজন (Breakdown):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.breakdown.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700"
                        >
                          <div className="min-w-7 px-1.5 h-6 rounded-md bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs text-center">
                            {b.code}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {b.meaning}
                            </div>
                            {b.phoneticHint && (
                              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 truncate">
                                {b.phoneticHint}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confusion Tip */}
                  {item.mcq_avoid_confusion_tip && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>MCQ কনফিউশন গার্ড: </strong>
                        {item.mcq_avoid_confusion_tip}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: Rich Colored Pencil Sketch Art Card (40%) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 dark:border-amber-700/60 shadow-lg group bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImageUrl}
                      alt={item.mnemonic_formula}
                      className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() =>
                        setZoomImage({
                          url: displayImageUrl,
                          title: item.mnemonic_formula,
                          desc: item.visual_cue.description
                        })
                      }
                    />

                    {/* Bottom Title Bar Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex items-end justify-between text-white">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-amber-300 uppercase block">
                          ভিজ্যুয়াল মেমরি আর্ট
                        </span>
                        <div className="text-xs font-bold text-white truncate">
                          "{item.mnemonic_formula}"
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setZoomImage({
                            url: displayImageUrl,
                            title: item.mnemonic_formula,
                            desc: item.visual_cue.description
                          })
                        }
                        className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors cursor-pointer"
                        title="বড় করে দেখুন"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sketch Dialogue Note */}
                  {item.visual_cue.cartoon_dialogue && (
                    <div className="p-2.5 rounded-xl bg-[#FDFBF7] dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-200 font-semibold italic text-center">
                      💬 "{item.visual_cue.cartoon_dialogue}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Image Zoom Modal */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-white">
              <span className="text-sm font-bold text-amber-300">"{zoomImage.title}"</span>
              <button
                onClick={() => setZoomImage(null)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomImage.url}
              alt={zoomImage.title}
              className="w-full max-h-[70vh] object-contain rounded-2xl"
            />

            <p className="text-xs text-slate-300 leading-relaxed">{zoomImage.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};
