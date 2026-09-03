'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Sparkles, 
  GitCompare, 
  SpellCheck, 
  Calculator, 
  Award, 
  Binary, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  Download,
  Eye,
  SlidersHorizontal,
  Gamepad2
} from 'lucide-react';

interface ToolsBentoGridProps {
  onSelectTab: (tabId: string) => void;
}

type CategoryType = 'all' | 'exam' | 'study' | 'utility';

export const ToolsBentoGrid: React.FC<ToolsBentoGridProps> = ({ onSelectTab }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const tools = [
    {
      id: 'question-paper',
      category: 'exam',
      title: 'AI প্রশ্নপত্র মেকার (Photo to Docs)',
      subtitle: 'হাতে লেখা বা বইয়ের পাতার ছবি থেকে এডিটেবল গুগল ডকক্স ও মাইক্রোসফট ওয়ার্ড প্রশ্নপত্র',
      icon: FileText,
      badge: 'ফ্ল্যাগশিপ AI',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      isHero: true,
      features: ['সৃজনশীল (CQ) ও MCQ স্বয়ংক্রিয় বিন্যাস', '১০০% এডিটেবল .docx ডাউনলোড', 'বাংলা ও ইংরেজি মিডিয়াম সাপোর্ট']
    },
    {
      id: 'omr-generator',
      category: 'exam',
      title: 'ওএমআর শিট জেনারেটর (OMR Sheet)',
      subtitle: 'স্কুল, কলেজ ও যেকোনো মডেল টেস্টের জন্য কাস্টমাইজড প্রফেশনাল ওএমআর শিট তৈরি',
      icon: Layers,
      badge: 'জনপ্রিয়',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      gradient: 'from-blue-600 to-cyan-600',
      features: ['২০, ২৫, ৫০ বা ১০০ প্রশ্ন সেট', 'রোল ও রেজিস্ট্রেশন নম্বর বাবল', 'ইনস্ট্যান্ট A4 পেজ প্রিন্ট']
    },
    {
      id: 'study-summary',
      category: 'study',
      title: 'AI স্টাডি সামারি ও রিভিশন নোট',
      subtitle: 'যেকোনো বড় চ্যাপ্টার বা টেক্সট পেস্ট করলেই স্মার্ট সামারি, বুলেট পয়েন্ট ও মূল তথ্য তৈরি',
      icon: Sparkles,
      badge: 'AI Smart',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      gradient: 'from-purple-600 to-pink-500',
      features: ['দ্রুত পরীক্ষার প্রস্তুতি নোট', 'গুরুত্বপূর্ণ তারিখ ও কীওয়ার্ড হাইলাইট', 'এক ক্লিকে কপি ও এক্সপোর্ট']
    },
    {
      id: 'mcq-game',
      category: 'study',
      title: '🎮 ক্রিয়েট ইউর MCQ গেম (Create Your Own Game)',
      subtitle: 'ছবি, ডকুমেন্ট (PDF/DOCX) বা টেক্সট আপলোড করে নিজস্ব কোশ্চেন অ্যান্ড অ্যানসার কুইজ গেম বানান ও খেলুন',
      icon: Gamepad2,
      badge: '🔥 নতুন AI গেম মেকার',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      gradient: 'from-purple-600 via-pink-600 to-rose-500',
      features: ['ছবি ও যেকোনো ফাইল থেকে ইনস্ট্যান্ট গেম', 'টাইমার, কম্বো স্ট্রিক (🔥 3x) ও হার্ট লাইফ', 'ভিক্টরি ট্রফি, র্যাংক ও ১-ক্লিক রি-ম্যাচ']
    },
    {
      id: 'quiz-practice',
      category: 'study',
      title: '🗂️ ১০০+ ৩D ফ্ল্যাশকার্ড ও প্রশ্নব্যাংক',
      subtitle: '১০০+ সমৃদ্ধ বিষয়ভিত্তিক প্রশ্নব্যাঙ্ক ও ইন্টারঅ্যাক্টিভ ৩D ফ্ল্যাশকার্ড ফ্লিপ অনুশীলন সুবিধা',
      icon: Sparkles,
      badge: '১০০+ ডেক',
      badgeColor: 'bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      gradient: 'from-pink-600 to-rose-500',
      features: ['ইসলামিক স্টাডিজ ও সাধারণ জ্ঞান', 'রিয়েল-টাইম স্কোর ও ফিডব্যাক', '৩D কার্ড ফ্লিপ অ্যানিমেশন']
    },
    {
      id: 'grammar-checker',
      category: 'utility',
      title: 'বাংলা ও ইংরেজি ব্যাকরণ শুদ্ধিকরণ',
      subtitle: 'ভুল বানান, ব্যাকরণগত ত্রুটি ও যতিচিহ্ন তৎক্ষণাৎ শনাক্ত করে সঠিক রূপ প্রদর্শন',
      icon: SpellCheck,
      badge: 'AI Powered',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      gradient: 'from-emerald-600 to-teal-500',
      features: ['বাংলা সাধু-চলিত বা বানান শুদ্ধি', 'ভুলের ব্যাখ্যা ও সাজেশন', 'সরাসরি ডিফারেন্স চেকারে পাঠানো']
    },
    {
      id: 'text-diff',
      category: 'utility',
      title: 'স্মার্ট টেক্সট ডিফারেন্স চেকার',
      subtitle: 'দুটি লেখার মধ্যে প্রতিটি শব্দ ও অক্ষরের পরিবর্তন রঙিন হাইলাইটে পুঙ্খানুপুঙ্খ তুলনা',
      icon: GitCompare,
      badge: 'পাওয়ারফুল',
      badgeColor: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      gradient: 'from-cyan-600 to-blue-600',
      features: ['পাশাপাশি (Side-by-Side) ও ইনলাইন ভিউ', 'অক্ষর ও শব্দ লেভেল হাইলাইট', 'এক্সপোর্ট ও পরিসংখ্যান']
    },
    {
      id: 'math-solver',
      category: 'utility',
      title: 'সমীকরণ ও বীজগণিত সমাধানকারী',
      subtitle: 'দ্বিঘাত সমীকরণ, সরল সমীকরণ ও বীজগাণিতিক রাশির স্টেপ-বাই-স্টেপ সমাধান',
      icon: Calculator,
      badge: 'Step-by-Step',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      gradient: 'from-amber-500 to-orange-600',
      features: ['KaTeX দিয়ে গণিত সিম্বল রেন্ডার', 'প্রতিটি ধাপের ব্যাখ্যা', 'সহজ ইনপুট প্যাড']
    },
    {
      id: 'quick-ocr',
      category: 'exam',
      title: 'কুইক ওসিআর (বাংলা ও ইংরেজি স্ক্যানার)',
      subtitle: 'যেকোনো ছবি বা স্ক্রিনশট আপলোড দিলে কয়েক সেকেন্ডেই স্পষ্ট টেক্সটে রূপান্তর',
      icon: Sparkles,
      badge: '৯৯.৮% নির্ভুল',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      gradient: 'from-indigo-500 to-purple-600',
      features: ['বাংলা হস্তাক্ষর ও মুদ্রণ শনাক্তকরণ', 'ক্লিপবোর্ডে ওয়ান-ক্লিক কপি', 'ব্যাকরণ চেকারে পাঠানোর সুবিধা']
    },
    {
      id: 'gpa-calculator',
      category: 'utility',
      title: 'এসএসসি ও এইচএসসি GPA ক্যালকুলেটর',
      subtitle: 'বাংলাদেশ শিক্ষা বোর্ডের স্ট্যান্ডার্ড অনুযায়ী ৪র্থ বিষয়সহ সঠিক গ্রেড পয়েন্ট হিসাব',
      icon: Award,
      badge: 'বোর্ড স্ট্যান্ডার্ড',
      badgeColor: 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
      gradient: 'from-violet-600 to-indigo-600',
      features: ['সাইন্স, কমার্স, আর্টস বিভাগ', '৪র্থ বিষয়ের ৩ পয়েন্ট অতিরিক্ত যোগ', 'জিপিএ ৫.০০ ক্যালকুলেশন']
    },
    {
      id: 'base-converter',
      category: 'utility',
      title: 'সংখ্যা পদ্ধতি বেস কনভার্টার',
      subtitle: 'বাইনারি, ডেসিমেল, অক্টাল ও হেক্সাডেসিমেল সংখ্যার তাত্ক্ষণিক রূপান্তর ও বিটভিউ',
      icon: Binary,
      badge: 'আইসিটি স্পেশাল',
      badgeColor: 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      gradient: 'from-sky-500 to-blue-600',
      features: ['একসাথে সব বেস রূপান্তর', 'এইচএসসি আইসিটি পরীক্ষার উপযোগী', 'স্টেপ ক্যালকুলেশন ভিউ']
    },
    {
      id: 'formula-library',
      category: 'study',
      title: 'ফর্মুলা ও সমীকরণ লাইব্রেরি',
      subtitle: 'গণিত, পদার্থবিজ্ঞান ও রসায়নের গুরুত্বপূর্ণ সকল সূত্র ও নিয়মাবলীর সমৃদ্ধ কোষ',
      icon: BookOpen,
      badge: 'রেফারেন্স',
      badgeColor: 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      gradient: 'from-teal-500 to-emerald-600',
      features: ['ক্যাটাগরিভিত্তিক সূত্রের তালিকা', 'KaTeX সুন্দর ম্যাথ রেন্ডারিং', 'দ্রুত সূত্র সার্চ সুবিধা']
    }
  ];

  const filteredTools = tools.filter(tool => {
    if (activeCategory === 'all') return true;
    return tool.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: 'সব টুলস (১১)' },
    { id: 'exam', label: '📝 প্রশ্ন ও পরীক্ষা মেকার' },
    { id: 'study', label: '🧠 স্টাডি ও প্র্যাকটিস' },
    { id: 'utility', label: '🛠️ স্মার্ট ইউটিলিটিজ' }
  ];

  return (
    <div className="space-y-8 pt-4">
      {/* Metrics & Social Proof Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">১১+ টুলস</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">অল-ইন-ওয়ান স্টাডি স্যুট</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">১০০% এডিটেবল</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">গুগল ডকক্স ও ওয়ার্ড ফাইল</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">৯৯.৮% নির্ভুল</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">বাংলা OCR ও গণিত সমীকরণ</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">ফ্রি ও ওপেন</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">শিক্ষক ও শিক্ষার্থীদের জন্য</div>
          </div>
        </div>
      </div>

      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>টুলস শোরুম ও ফিচার হাব</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            সব সুযোগ-সুবিধা ও পাওয়ার টুলস
          </h2>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map(tool => {
          const Icon = tool.icon;
          const isHero = tool.isHero && activeCategory === 'all';

          return (
            <div
              key={tool.id}
              onClick={() => onSelectTab(tool.id)}
              className={`group relative p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden glass-card-hover ${
                isHero ? 'md:col-span-2 bg-gradient-to-br from-indigo-50/60 via-white/80 to-purple-50/60 dark:from-indigo-950/30 dark:via-slate-900/80 dark:to-purple-950/30' : ''
              }`}
            >
              {/* Background Glow on hover */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.gradient} text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-sm ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.title}
                </h3>

                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tool.subtitle}
                </p>

                {/* Features bullet list */}
                <ul className="mt-4 space-y-1.5">
                  {tool.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom action trigger */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span className="flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-200">
                  টুলটি ব্যবহার করুন
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                  সরাসরি খুলুন ➔
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
