'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  GitCompare, 
  ArrowLeftRight, 
  Copy, 
  Trash2, 
  Download, 
  Upload, 
  Check, 
  Sparkles, 
  Sliders, 
  FileText, 
  Eye, 
  Layers, 
  Type, 
  AlignLeft, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  computeDiff, 
  DiffMode, 
  DiffOptions, 
  DiffResult,
  calculateTextStatistics 
} from '../../lib/diff-checker';

interface TextDiffCheckerProps {
  initialTextA?: string;
  initialTextB?: string;
  onSendToGrammarChecker?: (text: string) => void;
}

const SAMPLE_PRESETS = [
  {
    name: 'বাংলা বানান ও সাধু-চলিত পরিবর্তন',
    textA: `শিক্ষক মহাশয় বলিলেন, ছাত্রদিগের সর্বদা পরিস্কার পরিচ্ছন্ন থাকা উচিত। তাহাদের দৈনন্দিন জীবনে সময়ের মূল্য অপরিসীম। বিদ্যা অমূল্য ধন।`,
    textB: `শিক্ষক মহাশয় বললেন, ছাত্রদের সর্বদা পরিষ্কার-পরিচ্ছন্ন থাকা উচিত। তাদের দৈনন্দিন জীবনে সময়ের মূল্য অপরিসীম। জ্ঞান হলো অমূল্য সম্পদ।`,
  },
  {
    name: 'English Paragraph Revision',
    textA: `Artificial Intelligence is changing the world rapidly. Many people thinks that AI will replace developers. However, human creativity remains irreplaceable.`,
    textB: `Artificial Intelligence is revolutionizing the world rapidly! Many people think that AI will augment developers. Furthermore, human creativity remains truly irreplaceable.`,
  },
  {
    name: 'লাইন উল্টাপাল্টা ও গ্যাপ লাইন (Ignore Order Test)',
    textA: `১. আম\n\n২. জাম\n৩. কাঁঠাল\n\n৪. লিচু`,
    textB: `৩. কাঁঠাল\n১. আম\n৪. লিচু\n২. জাম`,
  },
];

export const TextDiffChecker: React.FC<TextDiffCheckerProps> = ({
  initialTextA = '',
  initialTextB = '',
  onSendToGrammarChecker,
}) => {
  const [textA, setTextA] = useState(initialTextA || SAMPLE_PRESETS[0].textA);
  const [textB, setTextB] = useState(initialTextB || SAMPLE_PRESETS[0].textB);

  // If props change from external caller
  useEffect(() => {
    if (initialTextA) setTextA(initialTextA);
    if (initialTextB) setTextB(initialTextB);
  }, [initialTextA, initialTextB]);

  // Diff Options State
  const [mode, setMode] = useState<DiffMode>('word');
  const [viewType, setViewType] = useState<'split' | 'unified'>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreEmptyLines, setIgnoreEmptyLines] = useState(false);
  const [ignoreLineOrder, setIgnoreLineOrder] = useState(false);
  const [ignorePunctuation, setIgnorePunctuation] = useState(false);

  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Compute Diff
  const diffResult: DiffResult = useMemo(() => {
    const options: DiffOptions = {
      mode,
      ignoreWhitespace,
      ignoreCase,
      ignoreEmptyLines,
      ignoreLineOrder,
      ignorePunctuation,
    };
    return computeDiff(textA, textB, options);
  }, [textA, textB, mode, ignoreWhitespace, ignoreCase, ignoreEmptyLines, ignoreLineOrder, ignorePunctuation]);

  const statsA = useMemo(() => calculateTextStatistics(textA), [textA]);
  const statsB = useMemo(() => calculateTextStatistics(textB), [textB]);

  // Actions
  const handleSwap = () => {
    const temp = textA;
    setTextA(textB);
    setTextB(temp);
  };

  const handleClearAll = () => {
    setTextA('');
    setTextB('');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(label);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (target === 'A') setTextA(content);
      else setTextB(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadReport = () => {
    const report = `=========================================
STUDYGEN AI — TEXT DIFFERENCE REPORT
=========================================
তারিখ ও সময়: ${new Date().toLocaleString('bn-BD')}
সাদৃশ্য স্কোর (Similarity): ${diffResult.summary.similarityPercentage}%
যোগ হয়েছে: +${diffResult.summary.addedCount} | বাদ পড়েছে: -${diffResult.summary.removedCount} | অপরিবর্তিত: ${diffResult.summary.unchangedCount}

[পরিসংখ্যান - মূল টেক্সট ১]:
- মোট ক্যারেক্টার (স্পেস সহ): ${statsA.charsWithSpace}
- মোট ক্যারেক্টার (স্পেস ছাড়া): ${statsA.charsWithoutSpace}
- মোট শব্দ: ${statsA.words}
- মোট বাক্য: ${statsA.sentences}
- মোট লাইন: ${statsA.lines}

[পরিসংখ্যান - পরিবর্তিত টেক্সট ২]:
- মোট ক্যারেক্টার (স্পেস সহ): ${statsB.charsWithSpace}
- মোট ক্যারেক্টার (স্পেস ছাড়া): ${statsB.charsWithoutSpace}
- মোট শব্দ: ${statsB.words}
- মোট বাক্য: ${statsB.sentences}
- মোট লাইন: ${statsB.lines}

-----------------------------------------
[মূল টেক্সট ১]:
${textA}

-----------------------------------------
[পরিবর্তিত টেক্সট ২]:
${textB}
=========================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-diff-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <GitCompare className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                টেক্সট ডিফারেন্স ফাইন্ডার
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Diff Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              দুটি প্যারাগ্রাফ বা লেখার প্রতিটি অক্ষর, শব্দ ও লাইনের পার্থক্য এবং পরিসংখ্যান বিশ্লেষণ করুন
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">স্যাম্পল:</span>
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTextA(preset.textA);
                setTextB(preset.textB);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Control & Options Toolbar */}
      <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Comparison Mode */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" /> তুলনার ধরন:
            </span>
            <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setMode('word')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition ${
                  mode === 'word'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                শব্দ (Word)
              </button>
              <button
                onClick={() => setMode('char')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition ${
                  mode === 'char'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                অক্ষর (Char)
              </button>
              <button
                onClick={() => setMode('line')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition ${
                  mode === 'line'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                লাইন (Line)
              </button>
            </div>
          </div>

          {/* View Mode (Split vs Unified) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> ভিউ মোড:
            </span>
            <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewType('split')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition ${
                  viewType === 'split'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                পাশাপাশি (Split)
              </button>
              <button
                onClick={() => setViewType('unified')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition ${
                  viewType === 'unified'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                একত্রে (Inline)
              </button>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSwap}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition active:scale-95"
              title="টেক্সট অদলবদল করুন"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> অদল-বদল
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800/60 flex items-center gap-1.5 transition active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" /> রিপোর্ট ডাউনলোড
            </button>
          </div>
        </div>

        {/* Filter Checkboxes */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400">
            <input
              type="checkbox"
              checked={ignoreEmptyLines}
              onChange={(e) => setIgnoreEmptyLines(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span>গ্যাপ লাইন বাদ দিন (Ignore Empty Lines)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400">
            <input
              type="checkbox"
              checked={ignoreLineOrder}
              onChange={(e) => setIgnoreLineOrder(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span>লাইনের ক্রম উল্টাপাল্টা হলেও চেক করুন (Ignore Order)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span>হোয়াইটস্পেস ইগনোর (Ignore Spaces)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span>কেস ইগনোর (Ignore Case)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400">
            <input
              type="checkbox"
              checked={ignorePunctuation}
              onChange={(e) => setIgnorePunctuation(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span>বিরামচিহ্ন বাদ (Ignore Punctuation)</span>
          </label>
        </div>
      </div>

      {/* Two Text Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Text A */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                মূল টেক্সট ১ (Original)
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer border border-slate-200 dark:border-slate-700 transition" title="ফাইল আপলোড (.txt, .md)">
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept=".txt,.md,.text"
                  onChange={(e) => handleFileUpload(e, 'A')}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => handleCopy(textA, 'textA')}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition"
                title="কপি করুন"
              >
                {copiedStatus === 'textA' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onSendToGrammarChecker && (
                <button
                  onClick={() => onSendToGrammarChecker(textA)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition flex items-center gap-1"
                  title="এই টেক্সটটির ব্যাকরণ ও বানান পরীক্ষা করুন"
                >
                  <Sparkles className="w-3 h-3" /> ব্যাকরণ চেক
                </button>
              )}
            </div>
          </div>

          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="এখানে ১ম টেক্সট বা মূল প্যারাগ্রাফটি পেস্ট করুন বা লিখুন..."
            rows={8}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-sans text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
          />

          {/* Stats Bar A */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              অক্ষর: <strong className="text-slate-800 dark:text-slate-200">{statsA.charsWithSpace}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              শব্দ: <strong className="text-slate-800 dark:text-slate-200">{statsA.words}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              বাক্য: <strong className="text-slate-800 dark:text-slate-200">{statsA.sentences}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              লাইন: <strong className="text-slate-800 dark:text-slate-200">{statsA.lines}</strong>
            </span>
          </div>
        </div>

        {/* Right: Modified Text B */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                পরিবর্তিত টেক্সট ২ (Modified)
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer border border-slate-200 dark:border-slate-700 transition" title="ফাইল আপলোড (.txt, .md)">
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept=".txt,.md,.text"
                  onChange={(e) => handleFileUpload(e, 'B')}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => handleCopy(textB, 'textB')}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition"
                title="কপি করুন"
              >
                {copiedStatus === 'textB' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onSendToGrammarChecker && (
                <button
                  onClick={() => onSendToGrammarChecker(textB)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition flex items-center gap-1"
                  title="এই টেক্সটটির ব্যাকরণ ও বানান পরীক্ষা করুন"
                >
                  <Sparkles className="w-3 h-3" /> ব্যাকরণ চেক
                </button>
              )}
            </div>
          </div>

          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="এখানে ২য় টেক্সট বা সংশোধিত প্যারাগ্রাফটি পেস্ট করুন বা লিখুন..."
            rows={8}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-sans text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
          />

          {/* Stats Bar B */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              অক্ষর: <strong className="text-slate-800 dark:text-slate-200">{statsB.charsWithSpace}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              শব্দ: <strong className="text-slate-800 dark:text-slate-200">{statsB.words}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              বাক্য: <strong className="text-slate-800 dark:text-slate-200">{statsB.sentences}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              লাইন: <strong className="text-slate-800 dark:text-slate-200">{statsB.lines}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Summary Metrics & Similarity Score */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Similarity Score */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              সাদৃশ্য স্কোর (Similarity)
            </span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {diffResult.summary.similarityPercentage}%
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${diffResult.summary.similarityPercentage}%` }}
            />
          </div>
        </div>

        {/* Added Count */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              নতুন যুক্ত হয়েছে
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">+</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            +{diffResult.summary.addedCount}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            টোকেন ২য় টেক্সটে যুক্ত
          </p>
        </div>

        {/* Removed Count */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              বাদ পড়েছে / মুছে ফেলা
            </span>
            <span className="text-xs font-black text-rose-600 dark:text-rose-400">-</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">
            -{diffResult.summary.removedCount}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            টোকেন ১ম টেক্সট থেকে বাদ
          </p>
        </div>

        {/* Unchanged / Matching */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              হুবহু মিল রয়েছে
            </span>
            <span className="text-xs font-black text-slate-600 dark:text-slate-400">=</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {diffResult.summary.unchangedCount}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            টোকেন সম্পূর্ণ অপরিবর্তিত
          </p>
        </div>
      </div>

      {/* Difference Output Viewer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              পার্থক্য ও হাইলাইটেড ফলাফল ({viewType === 'split' ? 'Side-by-Side Split View' : 'Unified Inline View'})
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/40 inline-block" />
              <span className="text-rose-600 dark:text-rose-400">বাদ পড়া অংশ</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40 inline-block" />
              <span className="text-emerald-600 dark:text-emerald-400">নতুন যোগ হওয়া অংশ</span>
            </div>
          </div>
        </div>

        {/* View Mode 1: Unified Inline */}
        {viewType === 'unified' ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-sans leading-relaxed min-h-[160px] whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
            {diffResult.parts.length === 0 ? (
              <span className="text-slate-400 italic">কোনো পার্থক্য নেই বা কোনো টেক্সট ইনপুট দেওয়া হয়নি।</span>
            ) : (
              diffResult.parts.map((part, index) => {
                if (part.type === 'added') {
                  return (
                    <ins
                      key={index}
                      className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded border border-emerald-500/30 no-underline font-semibold mx-0.5"
                    >
                      {part.value}
                    </ins>
                  );
                }
                if (part.type === 'removed') {
                  return (
                    <del
                      key={index}
                      className="bg-rose-500/20 text-rose-700 dark:text-rose-300 px-1 py-0.5 rounded border border-rose-500/30 line-through font-semibold mx-0.5 opacity-80"
                    >
                      {part.value}
                    </del>
                  );
                }
                return (
                  <span key={index} className="text-slate-800 dark:text-slate-200">
                    {part.value}
                  </span>
                );
              })
            )}
          </div>
        ) : (
          /* View Mode 2: Split View (Side-by-Side Line by Line) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column View */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950">
              <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between">
                <span>মূল টেক্সট (Original Side)</span>
                <span>{diffResult.leftLines.length} লাইন</span>
              </div>
              <div className="p-3 font-mono text-xs overflow-x-auto space-y-1 min-h-[200px]">
                {diffResult.leftLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 px-2 py-1 rounded transition-colors ${
                      line.type === 'removed'
                        ? 'bg-rose-500/15 text-rose-800 dark:text-rose-200 border-l-2 border-rose-500'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 select-none w-6 text-right shrink-0">
                      {line.lineNum > 0 ? line.lineNum : ''}
                    </span>
                    <span className="flex-1 font-sans break-words whitespace-pre-wrap">
                      {line.content || ' '}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column View */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950">
              <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                <span>পরিবর্তিত টেক্সট (Modified Side)</span>
                <span>{diffResult.rightLines.length} লাইন</span>
              </div>
              <div className="p-3 font-mono text-xs overflow-x-auto space-y-1 min-h-[200px]">
                {diffResult.rightLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 px-2 py-1 rounded transition-colors ${
                      line.type === 'added'
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-l-2 border-emerald-500'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 select-none w-6 text-right shrink-0">
                      {line.lineNum > 0 ? line.lineNum : ''}
                    </span>
                    <span className="flex-1 font-sans break-words whitespace-pre-wrap">
                      {line.content || ' '}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Side-by-Side Statistics Comparison Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          উভয় টেক্সটের তুলনামূলক পরিসংখ্যান (Comparative Analysis)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">পরিমাপক (Metric)</th>
                <th className="py-3 px-4 text-rose-600 dark:text-rose-400">মূল টেক্সট ১</th>
                <th className="py-3 px-4 text-emerald-600 dark:text-emerald-400">পরিবর্তিত টেক্সট ২</th>
                <th className="py-3 px-4 text-slate-700 dark:text-slate-300">পার্থক্য (Difference)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-bold">মোট ক্যারেক্টার (স্পেস সহ)</td>
                <td className="py-3 px-4">{statsA.charsWithSpace}</td>
                <td className="py-3 px-4">{statsB.charsWithSpace}</td>
                <td className="py-3 px-4 font-bold">
                  {statsB.charsWithSpace - statsA.charsWithSpace > 0 ? `+${statsB.charsWithSpace - statsA.charsWithSpace}` : statsB.charsWithSpace - statsA.charsWithSpace}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-bold">মোট ক্যারেক্টার (স্পেস ছাড়া)</td>
                <td className="py-3 px-4">{statsA.charsWithoutSpace}</td>
                <td className="py-3 px-4">{statsB.charsWithoutSpace}</td>
                <td className="py-3 px-4 font-bold">
                  {statsB.charsWithoutSpace - statsA.charsWithoutSpace > 0 ? `+${statsB.charsWithoutSpace - statsA.charsWithoutSpace}` : statsB.charsWithoutSpace - statsA.charsWithoutSpace}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-bold">মোট শব্দ (Words)</td>
                <td className="py-3 px-4">{statsA.words}</td>
                <td className="py-3 px-4">{statsB.words}</td>
                <td className="py-3 px-4 font-bold">
                  {statsB.words - statsA.words > 0 ? `+${statsB.words - statsA.words}` : statsB.words - statsA.words}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-bold">মোট বাক্য (Sentences)</td>
                <td className="py-3 px-4">{statsA.sentences}</td>
                <td className="py-3 px-4">{statsB.sentences}</td>
                <td className="py-3 px-4 font-bold">
                  {statsB.sentences - statsA.sentences > 0 ? `+${statsB.sentences - statsA.sentences}` : statsB.sentences - statsA.sentences}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-bold">মোট লাইন (Lines)</td>
                <td className="py-3 px-4">{statsA.lines}</td>
                <td className="py-3 px-4">{statsB.lines}</td>
                <td className="py-3 px-4 font-bold">
                  {statsB.lines - statsA.lines > 0 ? `+${statsB.lines - statsA.lines}` : statsB.lines - statsA.lines}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-bold">অনুচ্ছেদ সংখ্যা (Paragraphs)</td>
                <td className="py-3 px-4">{statsA.paragraphs}</td>
                <td className="py-3 px-4">{statsB.paragraphs}</td>
                <td className="py-3 px-4 font-bold">
                  {statsB.paragraphs - statsA.paragraphs > 0 ? `+${statsB.paragraphs - statsA.paragraphs}` : statsB.paragraphs - statsA.paragraphs}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
