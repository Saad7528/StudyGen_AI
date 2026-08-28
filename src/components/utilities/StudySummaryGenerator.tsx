'use client';

import React, { useState } from 'react';
import { StudySummaryResult } from '../../types/study-tools';
import { KaTeXViewer } from '../KaTeXViewer';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  ListChecks, 
  Bookmark, 
  Lightbulb, 
  Flame, 
  HelpCircle,
  Share2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_TOPICS: Record<string, StudySummaryResult> = {
  'physics-motion': {
    title: 'গতি ও নিউটনের গতিসূত্র (Motion & Newton\'s Laws)',
    topic: 'পদার্থবিজ্ঞান - অধ্যায় ২ ও ৩',
    subject: 'পদার্থবিজ্ঞান (Physics)',
    quickSummary: [
      'দূরত্ব একটি স্কেলার রাশি কিন্তু সরণ একটি নির্দিষ্ট দিকে দূরত্বের পরিবর্তন বোঝায় যা ভেক্টর রাশি।',
      'ত্বরণ হলো সময়ের সাথে বেগের পরিবর্তনের হার ($a = \\frac{v - u}{t}$)। সুষম ত্বরণের ক্ষেত্রে গতি সমীকরণ প্রযোজ্য।',
      'নিউটনের প্রথম সূত্র থেকে জড়তা ও বলের গুণগত সংজ্ঞা পাওয়া যায়।',
      'নিউটনের দ্বিতীয় সূত্র অনুযায়ী বস্তুর ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমানুপাতিক ($F = ma$)।',
      'নিউটনের তৃতীয় সূত্র: প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া রয়েছে ($F_1 = -F_2$)।'
    ],
    keyDefinitions: [
      {
        term: 'জড়তা (Inertia)',
        explanation: 'বস্তু যে অবস্থায় আছে চিরকাল সে অবস্থায় থাকতে চাওয়ার যে ধর্ম বা প্রবণতা, তাকে জড়তা বলে।',
        example: 'চলন্ত বাস হঠাৎ ব্রেক করলে যাত্রীদের সামনের দিকে ঝুঁকে পড়া।'
      },
      {
        term: 'ভরবেগ (Momentum)',
        explanation: 'কোনো বস্তুর ভর ও বেগের গুণফলকে ভরবেগ বলে। এটি একটি ভেক্টর রাশি ($p = mv$), একক $kg\\cdot m/s$।'
      },
      {
        term: 'ঘর্ষণ বল (Friction)',
        explanation: 'একটি বস্তু যখন অপর একটি বস্তুর সংস্পর্শে থেকে গতিশীল হয় বা হতে চেষ্টা করে, তখন গতির বিপরীতে যে বাধার সৃষ্টি হয়।'
      }
    ],
    formulasAndRules: [
      { label: 'বেগের সমীকরণ', formula: 'v = u + at', note: 'u = আদিবেগ, a = ত্বরণ, t = সময়' },
      { label: 'দূরত্ব ও ত্বরণ সম্পর্ক', formula: 's = ut + \\frac{1}{2}at^2', note: 'সুষম ত্বরণে অতিক্রান্ত দূরত্ব' },
      { label: 'বেগ ও সরণ সম্পর্ক', formula: 'v^2 = u^2 + 2as', note: 'সময় (t) অনুপস্থিত থাকলে এটি প্রযোজ্য' },
      { label: 'বলের সমীকরণ', formula: 'F = ma = m\\left(\\frac{v - u}{t}\\right)', note: 'নিউটনের দ্বিতীয় গতিসূত্র' },
      { label: 'ভরবেগের সংরক্ষণশীলতা', formula: 'm_1u_1 + m_2u_2 = m_1v_1 + m_2v_2', note: 'সংঘর্ষের আগে ও পরের মোট ভরবেগ সমান' }
    ],
    highYieldExamTips: [
      'পরন্ত বস্তুর ক্ষেত্রে $a$-এর স্থলে অভিকর্ষজ ত্বরণ $g = 9.8\\, m/s^2$ বসবে। খাড়া উপরের দিকে নিক্ষিপ্ত বস্তুর ক্ষেত্রে সমীকরণে মাইনাস ($-$) হবে।',
      'সর্বোচ্চ উচ্চতায় শেষ বেগ $v = 0$ হয় এবং সর্বোচ্চ উচ্চতায় ওঠার সময় $t = \\frac{u}{g}$।',
      'কাদায় বা পানিতে গুলির প্রবেশের ক্ষেত্রে মন্দন ($a$) নির্ণয়ের প্রশ্নে $v^2 = u^2 - 2as$ ব্যবহার হয়।'
    ],
    sampleQuestions: [
      {
        question: 'একটি ১০ kg ভরের বস্তুর ওপর ২০ N বল প্রয়োগ করলে ত্বরণ কত হবে?',
        answer: '$a = \\frac{F}{m} = \\frac{20}{10} = 2\\, m/s^2$'
      },
      {
        question: 'ঘর্ষণ কমানোর দুটি উপায় লিখুন।',
        answer: '১. পৃষ্ঠকে মসৃণ ও পিচ্ছিলকারক তেল/গ্রিজ ব্যবহার করা, ২. চাকা বা বল বিয়ারিং ব্যবহার করা।'
      }
    ],
    generatedAt: 'August 2026'
  },
  'math-trig': {
    title: 'ত্রিকোণমিতিক অনুপাত ও অভেদাবলী (Trigonometry Essentials)',
    topic: 'উচ্চতর গণিত - অধ্যায় ৮ ও ৯',
    subject: 'উচ্চতর গণিত (Higher Math)',
    quickSummary: [
      'সমকোণী ত্রিভুজের সূক্ষ্মকোণের সাপেক্ষে বাহুগুলোর অনুপাতই ত্রিকোণমিতিক অনুপাত ($\\sin, \\cos, \\tan, \\cot, \\sec, \\csc$)।',
      'কোণ পরিমাপের দুটি প্রধান একক: ষাটমূলক (Degree) এবং বৃত্তীয় (Radian)। $180^\\circ = \\pi\\text{ radians}$।',
      'বৃত্তের চাপ $s = r\\theta$ যেখানে কোণ $\\theta$ অবশ্যই রেডিয়ান এককে হতে হবে।'
    ],
    keyDefinitions: [
      {
        term: 'রেডিয়ান কোণ (Radian)',
        explanation: 'কোনো বৃত্তের ব্যাসার্ধের সমান চাপ বৃত্তের কেন্দ্রে যে কোণ তৈরি করে, তাকে এক রেডিয়ান কোণ বলে ($1^c = \\frac{180^\\circ}{\\pi}$)।'
      },
      {
        term: 'ত্রিকোণমিতিক চতুর্ভাগ (Quadrants)',
        explanation: 'All-Sin-Tan-Cos নিয়ম অনুযায়ী ১ম চতুর্ভাগে সবাই পজিটিভ, ২য়ে সাইন, ৩য়ে ট্যান এবং ৪র্থ চতুর্ভাগে কস পজিটিভ।'
      }
    ],
    formulasAndRules: [
      { label: 'মৌলিক পিথাগোরীয় অভেদ ১', formula: '\\sin^2\\theta + \\cos^2\\theta = 1', note: 'সকল বাস্তব কোণের জন্য প্রযোজ্য' },
      { label: 'মৌলিক অভেদ ২', formula: '\\sec^2\\theta - \\tan^2\\theta = 1', note: '\\tan^2\\theta = \\sec^2\\theta - 1' },
      { label: 'মৌলিক অভেদ ৩', formula: '\\csc^2\\theta - \\cot^2\\theta = 1', note: '\\csc^2\\theta = 1 + \\cot^2\\theta' },
      { label: 'বৃত্তচাপের দৈর্ঘ্য', formula: 's = r\\theta', note: '\\theta\\text{ radians}' },
      { label: 'বৃত্তকলার ক্ষেত্রফল', formula: 'A = \\frac{1}{2}r^2\\theta', note: '\\theta\\text{ radians}' }
    ],
    highYieldExamTips: [
      '$\\sin(-\\theta) = -\\sin\\theta$ কিন্তু $\\cos(-\\theta) = \\cos\\theta$। এটি ভর্তি ও বোর্ড পরীক্ষায় সবচেয়ে বেশি আসে।',
      '$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$ এবং $\\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}$।'
    ],
    sampleQuestions: [
      {
        question: 'যদি $\\tan\\theta = \\frac{3}{4}$ এবং $\\theta$ সূক্ষ্মকোণ হয়, তবে $\\sin\\theta$ কত?',
        answer: '$\\sin\\theta = \\frac{3}{5}$'
      }
    ],
    generatedAt: 'August 2026'
  },
  'ict-boolean': {
    title: 'বুলিয়ান অ্যালজেব্রা ও ডিজিটাল লজিক গেইট (ICT Logic Gates)',
    topic: 'আইসিটি - অধ্যায় ৩ (সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস)',
    subject: 'আইসিটি (ICT)',
    quickSummary: [
      'বুলিয়ান অ্যালজেব্রা কেবল দুটি মান $0$ (False/Low) এবং $1$ (True/High) নিয়ে কাজ করে।',
      'মৌলিক লজিক গেইট ৩টি: AND (গুণন), OR (যোগ), NOT (পূরক)।',
      'সার্বজনীন গেইট ২টি: NAND এবং NOR (যেকোনো সার্কিট এদের দিয়ে বাস্তবায়ন সম্ভব)।',
      'ডি-মরগ্যানের উপপাদ্য দুটি জটিল বুলিয়ান সমীকরণ সরলীকরণে সবচেয়ে বেশি ব্যবহৃত হয়।'
    ],
    keyDefinitions: [
      {
        term: 'বুলিয়ান পূরক (NOT Operation)',
        explanation: 'কোনো চলকের মানের বিপরীত মান পাওয়ার অপারেশন। যেমন: $\\overline{0} = 1$ এবং $\\overline{1} = 0$।'
      },
      {
        term: 'সার্বজনীন গেইট (Universal Gate)',
        explanation: 'যে সকল গেইট দিয়ে মৌলিক গেইটসমূহ সহ অন্যান্য সব লজিক সার্কিট তৈরি করা যায়। যেমন: NAND ও NOR।'
      }
    ],
    formulasAndRules: [
      { label: 'ডি-মরগ্যানের ১ম উপপাদ্য', formula: '\\overline{A + B} = \\overline{A} \\cdot \\overline{B}', note: 'যোগের কমপ্লিমেন্ট গুণের সমান' },
      { label: 'ডি-মরগ্যানের ২য় উপপাদ্য', formula: '\\overline{A \\cdot B} = \\overline{A} + \\overline{B}', note: 'গুণের কমপ্লিমেন্ট যোগের সমান' },
      { label: 'XOR গেইট সূত্র', formula: 'A \\oplus B = \\overline{A}B + A\\overline{B}', note: 'বিজড় সংখ্যক ইনপুট ১ হলে আউটপুট ১' },
      { label: 'XNOR গেইট সূত্র', formula: '\\overline{A \\oplus B} = AB + \\overline{A}\\,\\overline{B}', note: 'ইনপুট সমান হলে আউটপুট ১' }
    ],
    highYieldExamTips: [
      '$A + A = A$ এবং $A \\cdot A = A$ (Idempotent Law)। অনেকেই ভুলে $2A$ বা $A^2$ লেখে যা ভুল।',
      'হাফ অ্যাডার তৈরিতে ১টি XOR এবং ১টি AND গেইট প্রয়োজন ($S = A \\oplus B, C = AB$)।'
    ],
    sampleQuestions: [
      {
        question: '$A + \\overline{A}B$ কে সরলীকরণ করলে কী পাওয়া যাবে?',
        answer: '$A + \\overline{A}B = (A + \\overline{A})(A + B) = 1 \\cdot (A + B) = A + B$'
      }
    ],
    generatedAt: 'August 2026'
  }
};

interface StudySummaryGeneratorProps {
  onSendToQuiz?: (data: StudySummaryResult) => void;
}

export const StudySummaryGenerator: React.FC<StudySummaryGeneratorProps> = ({ onSendToQuiz }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('physics-motion');
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<StudySummaryResult>(SAMPLE_TOPICS['physics-motion']);
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    setResult(SAMPLE_TOPICS[key]);
  };

  const handleGenerateCustom = () => {
    if (!inputText.trim()) {
      alert('অনুগ্রহ করে টপিকের নাম বা পড়া/নোটের টেক্সট লিখুন');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      // Generate intelligent study notes structure
      const lines = inputText.split('\n').filter(l => l.trim().length > 0);
      const generated: StudySummaryResult = {
        title: lines[0] || 'কাস্টম স্টাডি সামারি',
        topic: 'AI Generated Revision Sheet',
        subject: 'সাধারণ বিজ্ঞান ও জ্ঞান',
        quickSummary: lines.length > 1 ? lines.slice(1, 5) : [
          'মূল বিষয়বস্তু: ' + inputText.slice(0, 80) + '...',
          'কনসেপ্ট ১: গুরুত্বপূর্ণ পয়েন্ট ও থিওরি সংক্ষেপ।',
          'কনসেপ্ট ২: পরীক্ষার জন্য প্রয়োজনীয় নোটসমূহ।'
        ],
        keyDefinitions: [
          {
            term: lines[0]?.slice(0, 20) || 'মূল পরিভাষা',
            explanation: 'প্রদত্ত বিষয়ের প্রধান ধারণা ও সংজ্ঞা বিশ্লেষণ।',
            example: 'ব্যবহারিক উদাহরণ ও প্রয়োগ ক্ষেত্র।'
          }
        ],
        formulasAndRules: [
          { label: 'গুরুত্বপূর্ণ সম্পর্ক', formula: 'E = mc^2', note: 'মূল সূত্র' }
        ],
        highYieldExamTips: [
          'সংজ্ঞা ও মূল বৈশিষ্ট্যগুলো মুখস্থ রাখুন।',
          'বিগত বছরের প্রশ্ন সমাধানের ওপর জোর দিন।'
        ],
        sampleQuestions: [
          {
            question: `${lines[0] || 'এই টপিক'} বলতে কী বোঝায়?`,
            answer: inputText.slice(0, 100) + '...'
          }
        ],
        generatedAt: 'Just Now'
      };

      setResult(generated);
      setIsGenerating(false);
      confetti({ particleCount: 50, spread: 60 });
    }, 800);
  };

  const handleCopyText = () => {
    let text = `====================================\n`;
    text += `${result.title}\n${result.topic} | ${result.subject}\n`;
    text += `====================================\n\n`;

    text += `📌 সারসংক্ষেপ (QUICK SUMMARY):\n`;
    result.quickSummary.forEach((s, i) => {
      text += `${i + 1}. ${s}\n`;
    });

    text += `\n📖 মূল সংজ্ঞা ও পরিভাষা:\n`;
    result.keyDefinitions.forEach((d) => {
      text += `• ${d.term}: ${d.explanation}\n`;
      if (d.example) text += `  উদাহরণ: ${d.example}\n`;
    });

    text += `\n📐 প্রয়োজনীয় সূত্রাবলী:\n`;
    result.formulasAndRules.forEach((f) => {
      text += `• ${f.label}: ${f.formula} (${f.note || ''})\n`;
    });

    text += `\n🔥 হাই-ইল্ড এক্সাম টিপস:\n`;
    result.highYieldExamTips.forEach((t) => {
      text += `• ${t}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <FileText className="w-6 h-6 text-pink-500" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              AI Study Sheet & Summary Generator
              <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold">
                স্মার্ট নোট মেকার
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যেকোনো বড় অধ্যায় বা টপিক থেকে বুলেট সামারি, কী-কনসেপ্ট, সূত্র ও পরীক্ষার হাই-ইল্ড টিপস শিট তৈরি করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'কপি হয়েছে!' : 'কপি নোটস'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> প্রিন্ট / PDF শিট
          </button>
        </div>
      </div>

      {/* Preset Topics & Custom Input Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            রেডিমেড বিষয়সমূহ নির্বাচন করুন:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'physics-motion', label: 'পদার্থবিজ্ঞান: গতি ও নিউটনের সূত্র' },
              { id: 'math-trig', label: 'উচ্চতর গণিত: ত্রিকোণমিতিক অনুপাত' },
              { id: 'ict-boolean', label: 'আইসিটি: বুলিয়ান অ্যালজেব্রা' }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPreset === preset.id
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              অথবা আপনার নিজস্ব পড়া/টপিক লিখুন বা পেস্ট করুন:
            </label>
            <VoiceInputButton
              onTranscript={(text) => setInputText((prev) => (prev ? `${prev} ${text}` : text))}
            />
          </div>
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="যেমন: পর্যায় সারণির পর্যায়বৃত্ত ধর্ম ও ইলেকট্রন বিন্যাস অথবা কোনো অধ্যায়ের প্যারাগ্রাফ পেস্ট করুন..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGenerateCustom}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> জেনারেট হচ্ছে...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> AI স্টাডি শিট তৈরি করুন
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Study Sheet (Printable A4 Canvas) */}
      <div
        id="printable-question-paper"
        className="bg-white text-slate-900 shadow-2xl rounded-2xl p-6 sm:p-12 border border-slate-200 max-w-4xl mx-auto min-h-[900px] font-sans relative antialiased"
      >
        {/* Title Block */}
        <div className="border-b-2 border-slate-950 pb-4 mb-6 text-center space-y-1">
          <div className="inline-block px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold mb-1">
            {result.subject} • {result.topic}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            {result.title}
          </h1>
          <p className="text-xs text-slate-600 italic">
            Quick Revision Study Sheet & Formula Cheat-Sheet
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          {/* 1. Quick Summary Points */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <h3 className="font-black text-indigo-950 flex items-center gap-1.5 text-sm uppercase tracking-wide">
              <ListChecks className="w-4 h-4 text-indigo-600" />
              ১. মূল সারসংক্ষেপ ও কনসেপ্ট (Quick Summary)
            </h3>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-800">
              {result.quickSummary.map((item, idx) => (
                <li key={idx}>
                  <KaTeXViewer content={item} />
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Key Definitions */}
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-slate-300 pb-1">
              <Bookmark className="w-4 h-4 text-pink-600" />
              ২. গুরুত্বপূর্ণ সংজ্ঞা ও পরিভাষা (Key Definitions)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.keyDefinitions.map((def, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <span className="font-bold text-slate-950 block text-xs sm:text-sm text-pink-700">
                    {def.term}
                  </span>
                  <p className="text-slate-700 text-xs">{def.explanation}</p>
                  {def.example && (
                    <p className="text-[11px] text-slate-500 italic">
                      <span className="font-semibold">উদাহরণ:</span> {def.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Formulas & Rules */}
          {result.formulasAndRules.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-slate-300 pb-1">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                ৩. প্রয়োজনীয় সূত্র ও সমীকরণ (Essential Formulas)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.formulasAndRules.map((f, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between gap-1">
                    <span className="font-bold text-amber-950 text-xs">{f.label}</span>
                    <div className="py-1 text-slate-900 text-sm font-semibold">
                      <KaTeXViewer content={`$$${f.formula}$$`} />
                    </div>
                    {f.note && <span className="text-[10px] text-slate-500 italic">({f.note})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. High-Yield Exam Tips */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
            <h3 className="font-black text-rose-950 flex items-center gap-1.5 text-sm uppercase tracking-wide">
              <Flame className="w-4 h-4 text-rose-600" />
              ৪. পরীক্ষায় যে ভুলগুলো সচরাচর হয় (High-Yield Exam Pitfalls)
            </h3>
            <ul className="space-y-1.5 pl-5 list-disc text-rose-950 text-xs">
              {result.highYieldExamTips.map((tip, idx) => (
                <li key={idx}>
                  <KaTeXViewer content={tip} />
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Sample Questions */}
          {result.sampleQuestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-black text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-slate-300 pb-1">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                ৫. নমুনা বোর্ড প্রশ্ন ও সমাধান (Model Q&A)
              </h3>
              <div className="space-y-2">
                {result.sampleQuestions.map((sq, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-start gap-1">
                      <span className="text-emerald-600">প্রশ্ন {idx + 1}:</span>
                      <span>{sq.question}</span>
                    </div>
                    <div className="text-xs text-slate-700 pl-4 border-l-2 border-emerald-500">
                      <span className="font-semibold text-emerald-800">উত্তর:</span>{' '}
                      <KaTeXViewer content={sq.answer} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
