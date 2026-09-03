'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  FileText, 
  Calculator, 
  Award, 
  Binary, 
  BookOpen, 
  SpellCheck, 
  GitCompare, 
  History, 
  ArrowRight, 
  Clock, 
  X, 
  Layers,
  HelpCircle,
  Gamepad2
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onOpenDrafts?: () => void;
  onToggleTimer?: () => void;
}

interface CommandItem {
  id: string;
  type: 'tab' | 'action';
  title: string;
  titleEn: string;
  category: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  action?: () => void;
  keywords: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenDrafts,
  onToggleTimer
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commandItems: CommandItem[] = [
    {
      id: 'mcq-game',
      type: 'tab',
      title: '🎮 ক্রিয়েট ইউর MCQ গেম (Create Your Own Game)',
      titleEn: 'Create AI MCQ Quiz Game',
      category: 'স্টাডি ও প্র্যাকটিস',
      description: 'ছবি, পিডিএফ বা টেক্সট আপলোড করে নিজস্ব কোশ্চেন অ্যান্ড অ্যানসার কুইজ গেম খেলুন',
      icon: Gamepad2,
      badge: '🔥 নিউ গেম',
      keywords: ['game', 'mcq game', 'create game', 'own game', 'গেম', 'কুইজ গেম', 'কোয়েশ্চন', 'অ্যানসার', 'কোশ্চেন গেম']
    },
    {
      id: 'question-paper',
      type: 'tab',
      title: 'প্রশ্নপত্র মেকার (Photo to Docs)',
      titleEn: 'Question Paper Generator',
      category: 'শিক্ষক ও পরীক্ষা',
      description: 'হাতে লেখা বা বইয়ের ছবি থেকে এডিটেবল গুগল ডকক্স প্রশ্ন তৈরি',
      icon: FileText,
      badge: 'ফ্ল্যাগশিপ AI',
      keywords: ['question', 'paper', 'photo', 'cq', 'mcq', 'docs', 'পরীক্ষা', 'প্রশ্ন', 'ছবি']
    },
    {
      id: 'omr-generator',
      type: 'tab',
      title: 'ওএমআর শিট জেনারেটর',
      titleEn: 'OMR Sheet Generator',
      category: 'শিক্ষক ও পরীক্ষা',
      description: 'কাস্টম ওএমআর শিট তৈরি ও এক ক্লিকে প্রিন্ট',
      icon: Layers,
      badge: 'Popular',
      keywords: ['omr', 'sheet', 'print', 'mcq', 'bubble', 'বৃত্ত', 'ওএমআর']
    },
    {
      id: 'study-summary',
      type: 'tab',
      title: 'AI স্টাডি সামারি ও নোট',
      titleEn: 'AI Study Summary & Notes',
      category: 'স্টাডি ও প্র্যাকটিস',
      description: 'যেকোনো পাঠ্যের স্বয়ংক্রিয় সারাংশ ও বুলেট পয়েন্ট নোট',
      icon: Sparkles,
      badge: 'AI',
      keywords: ['summary', 'notes', 'study', 'সারাংশ', 'নোট', 'পড়ালেখার সারসংক্ষেপ']
    },
    {
      id: 'quiz-practice',
      type: 'tab',
      title: '🗂️ ১০০+ ৩D ফ্ল্যাশকার্ড ও প্রশ্নব্যাংক',
      titleEn: 'Quiz & 3D Flashcards',
      category: 'স্টাডি ও প্র্যাকটিস',
      description: '১০০+ সমৃদ্ধ প্রশ্ন ব্যাঙ্ক এবং ৩D ফ্ল্যাশকার্ড প্র্যাকটিস',
      icon: Sparkles,
      badge: '১০০+ প্রশ্ন',
      keywords: ['quiz', 'flashcard', 'practice', 'mcq', 'কুইজ', 'ফ্ল্যাশকার্ড', 'অনুশীলন']
    },
    {
      id: 'grammar-checker',
      type: 'tab',
      title: 'ব্যাকরণ ও বানান শুদ্ধিকরণ',
      titleEn: 'AI Grammar & Spell Checker',
      category: 'স্মার্ট ইউটিলিটি',
      description: 'বাংলা ও ইংরেজি লেখার ভুল শনাক্ত ও সমাধান',
      icon: SpellCheck,
      badge: 'AI',
      keywords: ['grammar', 'spell', 'bangla', 'শুদ্ধিকরণ', 'বানান', 'ব্যাকরণ', 'ভুল']
    },
    {
      id: 'text-diff',
      type: 'tab',
      title: 'টেক্সট ডিফারেন্স চেকার',
      titleEn: 'Text Diff Checker',
      category: 'স্মার্ট ইউটিলিটি',
      description: 'দুটি লেখার মধ্যে পরিবর্তন ও অমিল হাইলাইট',
      icon: GitCompare,
      badge: 'পাওয়ারফুল',
      keywords: ['diff', 'compare', 'difference', 'তুলনা', 'ডিফ', 'অমিল']
    },
    {
      id: 'quick-ocr',
      type: 'tab',
      title: 'কুইক ওসিআর (Quick OCR)',
      titleEn: 'Quick Bengali Image to Text OCR',
      category: 'শিক্ষক ও পরীক্ষা',
      description: 'ছবি থেকে তাৎক্ষণিক বাংলা ও ইংরেজি লেখা রূপান্তর',
      icon: Sparkles,
      keywords: ['ocr', 'image to text', 'ছবি থেকে লেখা', 'স্ক্যানার']
    },
    {
      id: 'math-solver',
      type: 'tab',
      title: 'সমীকরণ ও ম্যাথ সলভার',
      titleEn: 'Equation & Math Solver',
      category: 'স্মার্ট ইউটিলিটি',
      description: 'বীজগণিত, বহুপদী ও দ্বিঘাত সমীকরণের স্টেপ সলিউশন',
      icon: Calculator,
      keywords: ['math', 'equation', 'algebra', 'গণিত', 'সমীকরণ', 'বীজগণিত', 'সমাধান']
    },
    {
      id: 'gpa-calculator',
      type: 'tab',
      title: 'জিপিএ (GPA) ক্যালকুলেটর',
      titleEn: 'SSC / HSC GPA Calculator',
      category: 'স্মার্ট ইউটিলিটি',
      description: 'বাংলাদেশ শিক্ষা বোর্ডের এসএসসি ও এইচএসসি গ্রেডিং হিসাব',
      icon: Award,
      keywords: ['gpa', 'grade', 'ssc', 'hsc', 'গ্রেড', 'জিপিএ']
    },
    {
      id: 'base-converter',
      type: 'tab',
      title: 'বেস কনভার্টার (Base Converter)',
      titleEn: 'Number Base Converter',
      category: 'স্মার্ট ইউটিলিটি',
      description: 'বাইনারি, ডেসিমেল, অক্টাল ও হেক্সাডেসিমেল রূপান্তর',
      icon: Binary,
      keywords: ['base', 'binary', 'hex', 'decimal', 'বাইনারি', 'ডেসিমেল']
    },
    {
      id: 'formula-library',
      type: 'tab',
      title: 'ফর্মুলা ও সূত্র লাইব্রেরি',
      titleEn: 'Formula & Equation Library',
      category: 'স্টাডি ও প্র্যাকটিস',
      description: 'গণিত, পদার্থবিজ্ঞান ও রসায়নের প্রয়োজনীয় সূত্রাবলী',
      icon: BookOpen,
      keywords: ['formula', 'physics', 'math', 'chemistry', 'সূত্র', 'ফর্মুলা']
    },
    {
      id: 'about',
      type: 'tab',
      title: 'আমাদের সম্পর্কে (About Creator)',
      titleEn: 'About Creator & Platform',
      category: 'সাধারণ',
      description: 'StudyGen AI-এর লক্ষ্য ও নির্মাতার পরিচিতি',
      icon: HelpCircle,
      keywords: ['about', 'creator', 'saad', 'পরিচয়', 'সম্পর্কে']
    }
  ];

  const actionItems: CommandItem[] = [
    {
      id: 'action-drafts',
      type: 'action',
      title: 'রিসেন্ট ড্রাফট ও হিস্ট্রি খুলুন',
      titleEn: 'Open Recent Workspaces & Drafts',
      category: 'অ্যাকশন',
      description: 'পূর্ববর্তী সেভ করা প্রশ্নপত্র বা নোট দেখুন',
      icon: History,
      keywords: ['history', 'draft', 'save', 'হিস্ট্রি', 'ড্রাফট'],
      action: () => {
        if (onOpenDrafts) onOpenDrafts();
        onClose();
      }
    },
    {
      id: 'action-timer',
      type: 'action',
      title: 'এক্সাম ও স্টাডি টাইমার টগল',
      titleEn: 'Toggle Focus Exam Timer',
      category: 'অ্যাকশন',
      description: 'পড়ালেখা বা কুইজ অনুশীলনের জন্য স্টপওয়াচ/টাইমার চালান',
      icon: Clock,
      keywords: ['timer', 'focus', 'pomodoro', 'টাইমার', 'ঘড়ি', 'পোমোডোরো'],
      action: () => {
        if (onToggleTimer) onToggleTimer();
        onClose();
      }
    }
  ];

  const allItems = [...commandItems, ...actionItems];

  const filteredItems = allItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle Keyboard Navigation inside Modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleExecute(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const handleExecute = (item: CommandItem) => {
    if (item.type === 'tab') {
      onSelectTab(item.id);
      onClose();
    } else if (item.action) {
      item.action();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="কী খুঁজতে চান? (টুল নাম, ওএমআর, সমীকরণ, ব্যাকরণ...)"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2.5 sm:p-3 space-y-1.5 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                &quot;{query}&quot; সংক্রান্ত কোনো টুল বা অ্যাকশন পাওয়া যায়নি
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                বানান বা বিকল্প কীওয়ার্ড দিয়ে চেষ্টা করুন
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleExecute(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 translate-x-1'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-white text-indigo-700'
                                : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs truncate ${
                          isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-3">
                    <span
                      className={`text-[11px] font-medium hidden sm:inline-block ${
                        isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-white' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 px-5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px] font-bold">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px] font-bold">↓</kbd>
              নেভিগেট
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px] font-bold">↵</kbd>
              সিলেক্ট
            </span>
          </div>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">StudyGen AI Quick Navigation</span>
        </div>
      </div>
    </div>
  );
};
