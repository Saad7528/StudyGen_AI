'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronDown, 
  Calculator, 
  Award, 
  Binary, 
  BookOpen, 
  GitCompare, 
  SpellCheck, 
  FileText, 
  User, 
  Layers,
  Search,
  History,
  Clock,
  Command,
  Flame,
  LayoutGrid,
  Gamepad2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCommandPalette?: () => void;
  onOpenDrafts?: () => void;
  onToggleTimer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenCommandPalette,
  onOpenDrafts,
  onToggleTimer
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app_theme', 'light');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('app_theme', 'dark');
    }
  };

  const menuCategories = [
    {
      title: '📝 শিক্ষক ও পরীক্ষা মেকার',
      items: [
        { id: 'question-paper', label: 'ছবি থেকে প্রশ্নপত্র (Docx)', desc: 'AI Photo to Google Docs / Word', icon: FileText, badge: 'Flagship' },
        { id: 'omr-generator', label: 'ওএমআর শিট জেনারেটর', desc: 'মডেল টেস্টের কাস্টমাইজড বাবল শিট', icon: Layers, badge: 'Popular' },
        { id: 'quick-ocr', label: 'কুইক ওসিআর স্ক্যানার', desc: 'ছবি থেকে বাংলা টেক্সট রূপান্তর', icon: Sparkles }
      ]
    },
    {
      title: '🧠 স্টাডি ও প্র্যাকটিস',
      items: [
        { id: 'mcq-game', label: '🎮 AI MCQ গেম মেকার (Create Game)', desc: 'ছবি, ফাইল বা টেক্সট থেকে কুইজ গেম', icon: Gamepad2, badge: 'New Game' },
        { id: 'quiz-practice', label: '🗂️ ১০০+ ৩D ফ্ল্যাশকার্ড ডেক', desc: '১০০+ প্রশ্নব্যাংক ও কার্ড রিভিশন', icon: Sparkles, badge: '১০০+' },
        { id: 'study-summary', label: 'AI স্টাডি সামারি ও নোট', desc: 'স্বয়ংক্রিয় সারসংক্ষেপ ও রিভিশন নোট', icon: Sparkles, badge: 'AI' },
        { id: 'formula-library', label: 'ফর্মুলা ও সূত্র লাইব্রেরি', desc: 'গণিত ও বিজ্ঞানের গুরুত্বপূর্ণ সূত্র', icon: BookOpen }
      ]
    },
    {
      title: '🛠️ স্মার্ট ইউটিলিটিজ',
      items: [
        { id: 'grammar-checker', label: 'ব্যাকরণ ও বানান শুদ্ধিকরণ', desc: 'বাংলা ও ইংরেজি ভুল সমাধান', icon: SpellCheck, badge: 'AI' },
        { id: 'text-diff', label: 'টেক্সট ডিফারেন্স চেকার', desc: 'শব্দ ও অক্ষর লেভেল পরিবর্তন তুলনা', icon: GitCompare, badge: 'Diff' },
        { id: 'math-solver', label: 'সমীকরণ সমাধানকারী', desc: 'বীজগণিত ও সমীকরণের স্টেপ সলিউশন', icon: Calculator },
        { id: 'gpa-calculator', label: 'GPA ক্যালকুলেটর', desc: 'এসএসসি ও এইচএসসি গ্রেডিং হিসাব', icon: Award },
        { id: 'base-converter', label: 'বেস কনভার্টার', desc: 'বাইনারি, ডেসিমেল, হেক্সাডেসিমেল', icon: Binary }
      ]
    }
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo */}
          <div 
            onClick={() => handleSelectTab('question-paper')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-icon.png"
                alt="StudyGen AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight flex items-center">
                  <span className="text-cyan-600 dark:text-cyan-400">Study</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Gen</span>
                  <span className="text-orange-500 ml-1">AI</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 hidden sm:inline-block">
                  Pro
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                বহুমুখী শিক্ষা ও AI প্রশ্নপত্র তৈরি হাব
              </p>
            </div>
          </div>

          {/* Desktop Search Launcher Button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-xs font-medium cursor-pointer shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-indigo-500" />
              <span>টুল বা ফিচার খুঁজুন...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-sm ml-2">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-inner">
            {/* 1. Question Paper */}
            <button
              onClick={() => handleSelectTab('question-paper')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'question-paper'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>প্রশ্নপত্র মেকার</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-pink-500 text-white">
                Doc
              </span>
            </button>

            {/* 2. AI MCQ Game Maker (Create Game) */}
            <button
              onClick={() => handleSelectTab('mcq-game')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mcq-game'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20 font-black scale-105'
                  : 'text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 font-bold'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
              <span>AI MCQ গেম</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse">
                New
              </span>
            </button>

            {/* 3. OMR Sheet Generator */}
            <button
              onClick={() => handleSelectTab('omr-generator')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'omr-generator'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>OMR শিট</span>
            </button>

            {/* 4. Study Sheet & Summary */}
            <button
              onClick={() => handleSelectTab('study-summary')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'study-summary'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>AI সামারি</span>
            </button>

            {/* 5. Text Diff Checker */}
            <button
              onClick={() => handleSelectTab('text-diff')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'text-diff'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>টেক্সট ডিফ</span>
            </button>

            {/* 5. Categorized Mega Menu Dropdown */}
            <div className="relative" ref={megaMenuRef}>
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isMegaMenuOpen
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>সব টুলস</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Panel */}
              {isMegaMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-[580px] p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 backdrop-blur-2xl shadow-2xl space-y-4 animate-fade-in z-50">
                  <div className="grid grid-cols-3 gap-3">
                    {menuCategories.map((category, catIdx) => (
                      <div key={catIdx} className="space-y-2">
                        <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                          {category.title}
                        </div>
                        <div className="space-y-1">
                          {category.items.map(subItem => {
                            const SubIcon = subItem.icon;
                            const isSubActive = activeTab === subItem.id;
                            return (
                              <button
                                key={subItem.id}
                                onClick={() => handleSelectTab(subItem.id)}
                                className={`w-full p-2 rounded-xl text-left transition flex items-start gap-2 cursor-pointer ${
                                  isSubActive
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div className={`p-1 rounded-lg shrink-0 mt-0.5 ${isSubActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                  <SubIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold truncate flex items-center justify-between">
                                    <span>{subItem.label}</span>
                                    {subItem.badge && (
                                      <span className="text-[8px] font-extrabold px-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{subItem.desc}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mega Menu Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <button 
                      onClick={() => handleSelectTab('about')}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-semibold"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>নির্মাতার পরিচিতি ও লক্ষ্য</span>
                    </button>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                      ১১+ ফ্রি এডুকেশন টুলস
                    </span>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Power Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Drafts Drawer Trigger */}
            {onOpenDrafts && (
              <button
                onClick={onOpenDrafts}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="রিসেন্ট ড্রাফট ও হিস্ট্রি"
              >
                <History className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">ড্রাফট</span>
              </button>
            )}

            {/* Focus Timer Trigger */}
            {onToggleTimer && (
              <button
                onClick={onToggleTimer}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-400 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="এক্সাম ও স্টাডি টাইমার"
              >
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="hidden sm:inline">টাইমার</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isDarkMode ? 'লাইট মোডে স্যুইচ করুন' : 'ডার্ক মোডে স্যুইচ করুন'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in max-h-[80vh] overflow-y-auto">
            {/* Mobile Quick Search */}
            {onOpenCommandPalette && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCommandPalette();
                }}
                className="w-full p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-between text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>যেকোনো টুল বা ফিচার খুঁজুন</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px]">
                  ⌘K সার্চ
                </span>
              </button>
            )}

            {/* Grouped Links */}
            {menuCategories.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  {group.title}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map(subItem => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeTab === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleSelectTab(subItem.id)}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                          isSubActive
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-100/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <SubIcon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </span>
                        {subItem.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isSubActive ? 'bg-white text-indigo-700' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600'
                          }`}>
                            {subItem.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* About link */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleSelectTab('about')}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 ${
                  activeTab === 'about'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <User className="w-4 h-4" />
                <span>আমাদের সম্পর্কে (About Creator)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
