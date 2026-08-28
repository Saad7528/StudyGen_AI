'use client';

import React, { useState } from 'react';
import { OmrConfig } from '../../types/study-tools';
import { 
  FileSpreadsheet, 
  Printer, 
  Settings2, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  Download,
  School,
  FileCheck
} from 'lucide-react';

const DEFAULT_CONFIG: OmrConfig = {
  institutionName: 'ঢাকা রেসিডেনসিয়াল মডেল কলেজ',
  examTitle: 'অর্ধ-বার্ষিক মূল্যায়ন পরীক্ষা — ২০২৬',
  className: 'দশম শ্রেণি',
  subject: 'পদার্থবিজ্ঞান (MCQ ওএমআর শিট)',
  date: new Date().toISOString().split('T')[0],
  totalQuestions: 25,
  optionsCount: 4,
  optionType: 'bangla',
  setCodes: ['ক', 'খ', 'গ', 'ঘ'],
  rollDigits: 6,
  regDigits: 6,
  showInstructions: true,
  showSignatureBoxes: true,
  watermarkText: 'STUDYGEN OMR',
  accentColor: '#4f46e5'
};

export const OmrGenerator: React.FC = () => {
  const [config, setConfig] = useState<OmrConfig>(DEFAULT_CONFIG);
  const [markedAnswers, setMarkedAnswers] = useState<Record<number, number>>({});
  const [selectedSet, setSelectedSet] = useState<number | null>(null);

  const banglaOptions = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
  const englishOptions = ['A', 'B', 'C', 'D', 'E'];
  const options = config.optionType === 'bangla' ? banglaOptions : englishOptions;

  const handleBubbleClick = (qNum: number, optIdx: number) => {
    setMarkedAnswers((prev) => ({
      ...prev,
      [qNum]: prev[qNum] === optIdx ? -1 : optIdx
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const resetMarks = () => {
    setMarkedAnswers({});
    setSelectedSet(null);
  };

  const handleFillDemo = () => {
    const demo: Record<number, number> = {};
    for (let i = 1; i <= config.totalQuestions; i++) {
      demo[i] = Math.floor(Math.random() * config.optionsCount);
    }
    setMarkedAnswers(demo);
    setSelectedSet(0);
  };

  // Compute columns layout: e.g. 25 questions -> 1 column of 25 or 2 of 13/12
  const getColumns = () => {
    const total = config.totalQuestions;
    if (total <= 25) {
      // 1 or 2 columns
      const perCol = Math.ceil(total / 2);
      return [
        Array.from({ length: perCol }, (_, i) => i + 1),
        Array.from({ length: total - perCol }, (_, i) => i + perCol + 1)
      ];
    } else if (total <= 50) {
      // 2 columns of 25
      return [
        Array.from({ length: 25 }, (_, i) => i + 1),
        Array.from({ length: total - 25 }, (_, i) => i + 26)
      ];
    } else {
      // 4 columns
      const perCol = Math.ceil(total / 4);
      return [
        Array.from({ length: perCol }, (_, i) => i + 1),
        Array.from({ length: perCol }, (_, i) => i + perCol + 1),
        Array.from({ length: perCol }, (_, i) => i + perCol * 2 + 1),
        Array.from({ length: total - perCol * 3 }, (_, i) => i + perCol * 3 + 1)
      ];
    }
  };

  const columns = getColumns();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              OMR Sheet Generator & Printable Bubble Sheets
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                A4 রেডি
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ২০, ২৫, ৫০ বা ১০০ MCQ পরীক্ষার জন্য প্রফেশনাল ওএমআর শিট তৈরি ও এক ক্লিকে প্রিন্ট করুন।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
            title="নমুনা উত্তর বাবল ভরাট করুন"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> ডেমো ফিল
          </button>
          <button
            type="button"
            onClick={resetMarks}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> রিসেট
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> প্রিন্ট / PDF ডাউনলোড
          </button>
        </div>
      </div>


      {/* Configuration Controls */}
      <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-md space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
          <Settings2 className="w-4 h-4 text-indigo-500" />
          <span>ওএমআর শিট কনফিগারেশন</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              প্রতিষ্ঠানের নাম
            </label>
            <input
              type="text"
              value={config.institutionName}
              onChange={(e) => setConfig({ ...config, institutionName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              পরীক্ষার নাম
            </label>
            <input
              type="text"
              value={config.examTitle}
              onChange={(e) => setConfig({ ...config, examTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              মোট প্রশ্ন সংখ্যা
            </label>
            <select
              value={config.totalQuestions}
              onChange={(e) => setConfig({ ...config, totalQuestions: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value={20}>২০ টি প্রশ্ন</option>
              <option value={25}>২৫ টি প্রশ্ন (HSC/SSC স্টাইল)</option>
              <option value={30}>৩০ টি প্রশ্ন</option>
              <option value={50}>৫০ টি প্রশ্ন</option>
              <option value={100}>১০০ টি প্রশ্ন (অ্যাডমিশন/জব স্টাইল)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              অপশন ফরম্যাট
            </label>
            <select
              value={config.optionType}
              onChange={(e) => setConfig({ ...config, optionType: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="bangla">বাংলা (ক, খ, গ, ঘ)</option>
              <option value="english">English (A, B, C, D)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Sheet View (Strict A4 Layout in White Canvas) */}
      <div 
        id="printable-question-paper" 
        className="bg-white text-slate-950 shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-300 max-w-4xl mx-auto min-h-[950px] font-sans select-none relative overflow-hidden"
      >
        {/* Soft Watermark */}
        {config.watermarkText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 -rotate-45 font-black text-6xl sm:text-8xl tracking-widest text-slate-900">
            {config.watermarkText}
          </div>
        )}

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-950 pb-3 space-y-1">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
              {config.institutionName}
            </h1>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              {config.examTitle}
            </h2>
            <div className="flex justify-center items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
              <span>শ্রেণি: {config.className}</span>
              <span>•</span>
              <span>বিষয়: {config.subject}</span>
              <span>•</span>
              <span>তারিখ: {config.date}</span>
            </div>
            <div className="inline-block px-3 py-0.5 rounded border border-slate-900 text-xs font-black uppercase tracking-wider mt-1">
              ওএমআর উত্তরপত্র (OPTICAL MARK RECOGNITION SHEET)
            </div>
          </div>

          {/* Student Info & Grid Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs border border-slate-900 p-3 rounded-lg bg-slate-50/50">
            {/* Box 1: Text Fields */}
            <div className="space-y-2 border-r md:border-r border-slate-300 pr-2">
              <div className="font-bold text-slate-900 border-b border-slate-300 pb-1">
                শিক্ষার্থীর পরিচিতি:
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[11px] text-slate-600 block">শিক্ষার্থীর নাম:</span>
                  <div className="h-6 border-b border-dotted border-slate-900 w-full" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <span className="text-[11px] text-slate-600 block">রোল নম্বর:</span>
                    <div className="h-6 border-b border-dotted border-slate-900 w-full" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] text-slate-600 block">শাখা/সেকশন:</span>
                    <div className="h-6 border-b border-dotted border-slate-900 w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Roll Number Bubble Grid */}
            <div className="space-y-1 text-center border-r md:border-r border-slate-300 pr-2">
              <span className="font-bold text-[11px] text-slate-900 block">রোল নম্বর বাবল গ্রিড</span>
              <div className="flex justify-center gap-1.5 pt-1">
                {Array.from({ length: config.rollDigits }).map((_, col) => (
                  <div key={col} className="flex flex-col items-center gap-0.5">
                    <div className="w-5 h-5 border border-slate-900 rounded text-[10px] flex items-center justify-center font-bold">
                      {col + 1}
                    </div>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                      <div
                        key={digit}
                        className="w-4 h-4 rounded-full border border-slate-900 text-[9px] flex items-center justify-center font-semibold cursor-pointer hover:bg-slate-300"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: Set Code Selection */}
            <div className="space-y-2 text-center flex flex-col justify-between">
              <div>
                <span className="font-bold text-[11px] text-slate-900 block border-b border-slate-300 pb-1">
                  প্রশ্নপত্রের সেট কোড
                </span>
                <div className="flex justify-center items-center gap-3 pt-3">
                  {config.setCodes.map((set, sIdx) => {
                    const isSelected = selectedSet === sIdx;
                    return (
                      <div
                        key={set}
                        onClick={() => setSelectedSet(sIdx)}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <span className="text-xs font-bold">{set}</span>
                        <div
                          className={`w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold transition ${
                            isSelected ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'
                          }`}
                        >
                          {set}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions Pill */}
              <div className="p-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900 text-left">
                <span className="font-bold">সঠিক পদ্ধতি:</span> কালো বলপয়েন্ট কলম দিয়ে বৃত্ত সম্পূর্ণ ভরাট করুন।
              </div>
            </div>
          </div>

          {/* OMR MCQ Bubbles Grid */}
          <div className="border-2 border-slate-900 rounded-lg p-4 bg-white">
            <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-2 mb-3 flex items-center justify-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>উত্তরপত্র বাবল সেকশন (ANSWER MATRIX)</span>
            </div>

            <div className={`grid gap-4 ${
              columns.length === 2 ? 'grid-cols-2' : columns.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'
            }`}>
              {columns.map((colQuestions, colIdx) => (
                <div key={colIdx} className="space-y-1.5 border-r last:border-r-0 border-slate-200 pr-2">
                  {colQuestions.map((qNum) => {
                    const markedOpt = markedAnswers[qNum];
                    return (
                      <div
                        key={qNum}
                        className="flex items-center justify-between gap-1 py-0.5 px-1 hover:bg-slate-50 rounded"
                      >
                        <span className="w-6 text-xs font-bold text-slate-800 text-right pr-1">
                          {qNum}.
                        </span>
                        <div className="flex items-center gap-1.5">
                          {options.slice(0, config.optionsCount).map((opt, optIdx) => {
                            const isFilled = markedOpt === optIdx;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleBubbleClick(qNum, optIdx)}
                                className={`w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center text-[10px] font-bold transition-all ${
                                  isFilled
                                    ? 'bg-slate-950 text-white shadow-sm scale-105'
                                    : 'bg-white text-slate-900 hover:bg-slate-200'
                                }`}
                                title={`${qNum} নম্বর প্রশ্নের উত্তর (${opt})`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Guidelines & Signature */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-900 text-xs font-bold text-slate-900 items-end">
            <div className="text-[10px] font-normal text-slate-600 space-y-0.5">
              <p>১. বৃত্তটি পুরোপুরি ভরাট করুন।</p>
              <p>২. বৃত্তের বাইরে দাগ দেওয়া যাবে না।</p>
              <p>৩. ওএমআর শিট ভাঁজ করা সম্পূর্ণ নিষেধ।</p>
            </div>

            <div className="text-center">
              <div className="w-36 mx-auto border-t border-slate-900 pt-1">
                <span>কক্ষ পরিদর্শকের স্বাক্ষর</span>
              </div>
            </div>

            <div className="text-center">
              <div className="w-36 mx-auto border-t border-slate-900 pt-1">
                <span>পরীক্ষার্থীর পূর্ণ স্বাক্ষর</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
