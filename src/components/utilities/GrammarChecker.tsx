'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Wand2, 
  Copy, 
  Check, 
  Trash2, 
  GitCompare, 
  ArrowRight, 
  BookOpen, 
  RefreshCw,
  SpellCheck,
  CheckCheck,
  Zap,
  Info
} from 'lucide-react';

interface GrammarCheckerProps {
  initialText?: string;
  onCompareDiff?: (originalText: string, correctedText: string) => void;
}

interface IssueItem {
  original: string;
  suggestion: string;
  type: 'spelling' | 'grammar' | 'punctuation' | 'style';
  explanation: string;
}

interface GrammarAnalysisResult {
  correctedText: string;
  issues: IssueItem[];
  summary: {
    totalIssues: number;
    spellingIssues: number;
    grammarIssues: number;
    punctuationIssues: number;
    styleIssues: number;
    score: number;
    overallFeedback: string;
  };
}

const SAMPLE_GRAMMAR_PRESETS = [
  {
    name: 'বাংলা বানান ও সাধু-চলিত মিশ্রণ (গুরুচণ্ডালী দোষ)',
    text: `সকল শিক্ষকবৃন্দ বলিলেন যে ছাত্রদিগকে সর্বদা পরিস্কার পরিচ্ছন্ন থাকিতে হবে। পরীক্ষার ফলাফল খুব শিঘ্রই দেওয়া হবে এবং সে অনুযায়ী পুরষ্কার বিতরন করা হইবে।`,
  },
  {
    name: 'বাংলা ণ-ত্ব/ষ-ত্ব ও শব্দের ভুল প্রয়োগ',
    text: `বাংলাদেশ একটি সুন্দর দেশ। এখানের মানুষগুলো অতিব সাধারণ এবং তাদের শ্রদ্ধাঞ্জলী দেওয়া উচিত। তাদের দৈনন্দিন জীবনে সময়ের মুল্য অপরিসীম।`,
  },
  {
    name: 'English Grammar & Typo Mistakes',
    text: `The students was very excited for the compitition. Each of the player have practice hard for win the trophy. Its going to be an exiting match!`,
  },
];

export const GrammarChecker: React.FC<GrammarCheckerProps> = ({
  initialText = '',
  onCompareDiff,
}) => {
  const [inputText, setInputText] = useState(initialText || SAMPLE_GRAMMAR_PRESETS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GrammarAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'spelling' | 'grammar' | 'punctuation' | 'style'>('all');
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [dismissedIndices, setDismissedIndices] = useState<number[]>([]);

  // Analyze text via Gemini API
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMsg('অনুগ্রহ করে পরীক্ষা করার জন্য কিছু টেক্সট লিখুন বা পেস্ট করুন।');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setDismissedIndices([]);

    try {
      const res = await fetch('/api/check-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ব্যাকরণ পরীক্ষা সম্পন্ন করা যায়নি।');
      }

      setAnalysisResult(data.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'অপ্রত্যাশিত কোনো সমস্যা হয়েছে।';
      setErrorMsg(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply single fix
  const handleApplySingleFix = (issue: IssueItem, index: number) => {
    if (!inputText.includes(issue.original)) return;
    const updated = inputText.replace(issue.original, issue.suggestion);
    setInputText(updated);
    setDismissedIndices((prev) => [...prev, index]);
  };

  // Dismiss single issue
  const handleDismiss = (index: number) => {
    setDismissedIndices((prev) => [...prev, index]);
  };

  // 1-Click Fix All
  const handleFixAll = () => {
    if (analysisResult?.correctedText) {
      setInputText(analysisResult.correctedText);
      setDismissedIndices(analysisResult.issues.map((_, i) => i));
    }
  };

  const handleCopyCorrected = () => {
    const textToCopy = analysisResult?.correctedText || inputText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const visibleIssues = (analysisResult?.issues || []).filter((issue, idx) => {
    if (dismissedIndices.includes(idx)) return false;
    if (activeFilter === 'all') return true;
    return issue.type === activeFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <SpellCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                এআই ব্যাকরণ ও বানান পরীক্ষক
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                AI Smart Fix
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              বাংলা ও ইংরেজি লেখার বানান, ব্যাকরণ ও বিরামচিহ্ন নিখুঁত করুন এবং ১-ক্লিকে সব সংশোধন করুন
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">স্যাম্পল:</span>
          {SAMPLE_GRAMMAR_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(preset.text);
                setAnalysisResult(null);
                setDismissedIndices([]);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" /> আপনার টেক্সট ইনপুট দিন:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setInputText('');
                setAnalysisResult(null);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-500 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
            </button>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="এখানে যেকোনো বাংলা বা ইংরেজি প্যারাগ্রাফ লিখুন বা পেস্ট করুন..."
          rows={6}
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-sans text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
        />

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 font-medium">
            অক্ষর: <strong>{inputText.length}</strong> | শব্দ: <strong>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0}</strong>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>এআই বিশ্লেষণ করছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>ব্যাকরণ ও বানান পরীক্ষা করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis & Fix Results */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 backdrop-blur-xl">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                লেখনী মান স্কোর
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {analysisResult.summary.score || 90}/100
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                বানান ভুল (Spelling)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {analysisResult.summary.spellingIssues} টি
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                ব্যাকরণ ভুল (Grammar)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {analysisResult.summary.grammarIssues} টি
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                মোট শনাক্তকৃত ভুল
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {analysisResult.summary.totalIssues} টি
              </div>
            </div>
          </div>

          {/* AI Feedback Banner */}
          {analysisResult.summary.overallFeedback && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-600 dark:text-indigo-400">এআই মন্তব্য: </strong>
                {analysisResult.summary.overallFeedback}
              </div>
            </div>
          )}

          {/* Super Action Bar: 1-Click Fix All & Diff Bridge */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border border-emerald-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                ১-ক্লিকে সব সংশোধন
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                এক ক্লিকে সব বানান, ব্যাকরণ ও বিরামচিহ্ন স্বয়ংক্রিয়ভাবে শুদ্ধ করুন
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleFixAll}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" /> সব ঠিক করুন (Fix All)
              </button>

              {onCompareDiff && (
                <button
                  onClick={() => onCompareDiff(inputText, analysisResult.correctedText)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
                  title="ডিফারেন্স চেকারে পরিবর্তন দেখুন"
                >
                  <GitCompare className="w-4 h-4" /> পার্থক্য দেখুন (Diff)
                </button>
              )}
            </div>
          </div>

          {/* Issues List & Individual Correction */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                শনাক্তকৃত ত্রুটি ও পরামর্শসমূহ ({visibleIssues.length} টি বাকি)
              </h3>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeFilter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  সব ({analysisResult.issues.length})
                </button>
                <button
                  onClick={() => setActiveFilter('spelling')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeFilter === 'spelling'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  বানান ({analysisResult.summary.spellingIssues})
                </button>
                <button
                  onClick={() => setActiveFilter('grammar')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeFilter === 'grammar'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ব্যাকরণ ({analysisResult.summary.grammarIssues})
                </button>
                <button
                  onClick={() => setActiveFilter('punctuation')}
                  className={`px-3 py-1 rounded-lg transition ${
                    activeFilter === 'punctuation'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  বিরামচিহ্ন ({analysisResult.summary.punctuationIssues})
                </button>
              </div>
            </div>

            {/* List of Issue Cards */}
            {visibleIssues.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  কোনো ত্রুটি অবশিষ্ট নেই! আপনার লেখা সম্পূর্ণ শুদ্ধ।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-indigo-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        issue.type === 'spelling'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : issue.type === 'grammar'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                      }`}>
                        {issue.type === 'spelling' ? 'বানান ভুল' : issue.type === 'grammar' ? 'ব্যাকরণ' : 'বিরামচিহ্ন'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleApplySingleFix(issue, idx)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Check className="w-3 h-3" /> গ্রহণ করুন
                        </button>
                        <button
                          onClick={() => handleDismiss(idx)}
                          className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold"
                        >
                          বাদ
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through">
                        {issue.original}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        {issue.suggestion}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
                      {issue.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Corrected Text Full View */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> সম্পূর্ণ সংশোধিত টেক্সট (Polished Version)
              </h3>
              <button
                onClick={handleCopyCorrected}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
              >
                {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>কপি করুন</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-sans leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
              {analysisResult.correctedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
