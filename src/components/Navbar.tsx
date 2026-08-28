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
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMathDropdownOpen, setIsMathDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMathDropdownOpen(false);
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

  // Math & Study Tool sub-items
  const studyItems = [
    { id: 'omr-generator', label: 'OMR শিট জেনারেটর', icon: Layers, desc: 'প্রিন্ট-রেডি বাবল শিট মেকার', badge: 'New' },
    { id: 'study-summary', label: 'AI স্টাডি শিট ও সামারি', icon: BookOpen, desc: 'চ্যাপ্টার সামারি ও বুলেট পয়েন্ট', badge: 'AI' },
    { id: 'quiz-practice', label: 'কুইজ ও ফ্ল্যাশকার্ড', icon: Sparkles, desc: 'টাইমড কুইজ ও ৩D ফ্ল্যাশকার্ড', badge: 'Pro' },
    { id: 'math-solver', label: 'সমীকরণ সমাধানকারী', icon: Calculator, desc: 'স্টেপ-বাই-স্টেপ বীজগণিত ও সমীকরণ' },
    { id: 'gpa-calculator', label: 'GPA ক্যালকুলেটর', icon: Award, desc: 'এসএসসি ও এইচএসসি গ্রেডিং' },
    { id: 'base-converter', label: 'বেস কনভার্টার', icon: Binary, desc: 'বাইনারি, ডেসিমেল, হেক্সাডেসিমেল' },
    { id: 'formula-library', label: 'ফর্মুলা লাইব্রেরি', icon: BookOpen, desc: 'গণিত ও বিজ্ঞানের গুরুত্বপূর্ণ সূত্রাবলী' },
  ];

  const isStudyActive = studyItems.some((item) => item.id === activeTab);

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsMathDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/75 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleSelectTab('question-paper')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-icon.png"
                alt="StudyGen AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center">
                  <span className="text-cyan-600 dark:text-cyan-400">Study</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Gen</span>
                  <span className="text-orange-500 ml-1">AI</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                স্টাডিজেন এআই — বহুমুখী শিক্ষা ও সমাধান হাব
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Clean 6 Items) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-inner">
            {/* 1. Question Paper */}
            <button
              onClick={() => handleSelectTab('question-paper')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'question-paper'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>ছবি থেকে প্রশ্নপত্র</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md bg-pink-500 text-white">
                Doc
              </span>
            </button>

            {/* 2. OMR Sheet Generator */}
            <button
              onClick={() => handleSelectTab('omr-generator')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'omr-generator'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>OMR শিট</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md bg-emerald-500 text-white">
                New
              </span>
            </button>

            {/* 3. Study Sheet & Summary */}
            <button
              onClick={() => handleSelectTab('study-summary')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'study-summary'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>স্টাডি সামারি</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md bg-amber-500 text-white">
                AI
              </span>
            </button>

            {/* 4. Quiz & Flashcards */}
            <button
              onClick={() => handleSelectTab('quiz-practice')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'quiz-practice'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>কুইজ ও ফ্ল্যাশকার্ড</span>
            </button>

            {/* 5. More Academy & Math Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMathDropdownOpen(!isMathDropdownOpen)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                  isStudyActive && activeTab !== 'omr-generator' && activeTab !== 'study-summary' && activeTab !== 'quiz-practice'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span>আরও টুলস</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMathDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isMathDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl space-y-1 animate-fade-in z-50">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ল্যাঙ্গুয়েজ ও গণিত টুলকিট
                  </div>
                  {[
                    { id: 'text-diff', label: 'টেক্সট ডিফারেন্স', icon: GitCompare, desc: 'পরিবর্তন ও ডিফারেন্স ফাইন্ডার' },
                    { id: 'grammar-checker', label: 'ব্যাকরণ ও বানান', icon: SpellCheck, desc: 'AI ব্যাকরণ শুদ্ধিকরণ' },
                    { id: 'quick-ocr', label: 'কুইক OCR', icon: Sparkles, desc: 'ছবি থেকে টেক্সট রূপান্তর' },
                    ...studyItems.slice(3)
                  ].map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeTab === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleSelectTab(subItem.id)}
                        className={`w-full p-2 rounded-xl text-left transition flex items-center gap-2.5 ${
                          isSubActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isSubActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <SubIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs truncate">{subItem.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal truncate">{subItem.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 6. About Creator */}
            <button
              onClick={() => handleSelectTab('about')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-indigo-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>পরিচিতি</span>
            </button>
          </nav>


          {/* Right Controls: Theme Toggle + Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all"
              title={isDarkMode ? 'লাইট মোডে স্যুইচ করুন' : 'ডার্ক মোডে স্যুইচ করুন'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            {/* Primary AI Tools Group */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                প্রধান টুলসমূহ (Main Tools)
              </div>
              <div className="grid grid-cols-1 gap-1">
                <button
                  onClick={() => handleSelectTab('question-paper')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                    activeTab === 'question-paper'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> ছবি থেকে প্রশ্নপত্র (Doc)
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-pink-500 text-white">
                    Flagship
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('omr-generator')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                    activeTab === 'omr-generator'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4" /> OMR শিট জেনারেটর
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-white">
                    New
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('study-summary')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                    activeTab === 'study-summary'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> AI স্টাডি শিট ও সামারি
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white">
                    AI
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('quiz-practice')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                    activeTab === 'quiz-practice'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> কুইজ ও ফ্ল্যাশকার্ড প্র্যাকটিস
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                    Pro
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('text-diff')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                    activeTab === 'text-diff'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4" /> টেক্সট ডিফারেন্স ফাইন্ডার
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('grammar-checker')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                    activeTab === 'grammar-checker'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <SpellCheck className="w-4 h-4" /> ব্যাকরণ ও বানান পরীক্ষক
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('quick-ocr')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition ${
                    activeTab === 'quick-ocr'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> কুইক ওসিআর টেক্সট এক্সট্রাক্টর
                </button>
              </div>
            </div>

            {/* Math & Utilities Group */}
            <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                গণিত ও একাডেমি টুলকিট (Math & Tools)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {studyItems.slice(3).map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = activeTab === subItem.id;
                  return (
                    <button
                      key={subItem.id}
                      onClick={() => handleSelectTab(subItem.id)}
                      className={`p-2.5 rounded-xl text-left text-xs transition flex flex-col gap-1 ${
                        isSubActive
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <SubIcon className="w-4 h-4" />
                      <span className="text-[11px] font-semibold">{subItem.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* About Profile */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => handleSelectTab('about')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                  activeTab === 'about'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" /> পরিচিতি (About Creator)
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                  Saad
                </span>
              </button>
            </div>
          </div>

        )}
      </div>
    </header>
  );
};
