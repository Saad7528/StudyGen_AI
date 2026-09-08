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
  LayoutGrid,
  Gamepad2,
  Brain,
  Zap,
  ArrowRight
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

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
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
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

  const navSections = [
    {
      id: 'make_questions',
      label: 'প্রশ্ন তৈরি',
      items: [
        { id: 'question-paper', label: 'ছবি থেকে প্রশ্নপত্র (Docx)', desc: 'AI Photo to Google Docs / Word', icon: FileText, badge: 'Flagship' },
        { id: 'omr-generator', label: 'ওএমআর শিট জেনারেটর', desc: 'মডেল টেস্টের কাস্টমাইজড বাবল শিট', icon: Layers, badge: 'Popular' },
        { id: 'quick-ocr', label: 'কুইক ওসিআর স্ক্যানার', desc: 'ছবি থেকে বাংলা টেক্সট রূপান্তর', icon: Sparkles }
      ]
    },
    {
      id: 'ai_tools',
      label: 'AI টুলস',
      items: [
        { id: 'memory-technique', label: '🧠 AI মেমরি টেকনিক ও ছন্দ', desc: 'অটো ছন্দ, ভিজ্যুয়াল স্কেচ ও ব্রেকডাউন', icon: Brain, badge: 'New AI' },
        { id: 'mcq-game', label: '🎮 AI MCQ গেম মেকার (Arena)', desc: 'ছবি, ফাইল বা টেক্সট থেকে কুইজ গেম', icon: Gamepad2, badge: 'New Game' },
        { id: 'quiz-practice', label: '🗂️ ১০০+ ৩D ফ্ল্যাশকার্ড ডেক', desc: '১০০+ প্রশ্নব্যাংক ও কার্ড রিভিশন', icon: Sparkles, badge: '১০০+' },
        { id: 'study-summary', label: 'AI স্টাডি সামারি ও নোট', desc: 'স্বয়ংক্রিয় সারসংক্ষেপ ও রিভিশন নোট', icon: Sparkles, badge: 'AI' }
      ]
    },
    {
      id: 'utilities',
      label: 'ফিচার ও ইউটিলিটি',
      items: [
        { id: 'grammar-checker', label: 'ব্যাকরণ ও বানান শুদ্ধিকরণ', desc: 'বাংলা ও ইংরেজি ভুল সমাধান', icon: SpellCheck, badge: 'AI' },
        { id: 'text-diff', label: 'টেক্সট ডিফারেন্স চেকার', desc: 'শব্দ ও অক্ষর লেভেল পরিবর্তন তুলনা', icon: GitCompare, badge: 'Diff' },
        { id: 'math-solver', label: 'সমীকরণ সমাধানকারী', desc: 'বীজগণিত ও সমীকরণের স্টেপ সলিউশন', icon: Calculator },
        { id: 'gpa-calculator', label: 'GPA ক্যালকুলেটর', desc: 'এসএসসি ও এইচএসসি গ্রেডিং হিসাব', icon: Award },
        { id: 'base-converter', label: 'বেস কনভার্টার', desc: 'বাইনারি, ডেসিমেল, হেক্সাডেসিমেল', icon: Binary }
      ]
    },
    {
      id: 'resources',
      label: 'রিসোর্স',
      items: [
        { id: 'formula-library', label: 'ফর্মুলা ও সূত্র লাইব্রেরি', desc: 'গণিত ও বিজ্ঞানের গুরুত্বপূর্ণ সূত্র', icon: BookOpen },
        { id: 'about', label: 'নির্মাতার লক্ষ্য ও পরিচিতি', desc: 'StudyGen AI এর ভিশন ও বিস্তারিত', icon: User }
      ]
    }
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={navContainerRef}>
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          
          {/* ==========================================
              LEFT: BRAND LOGO
             ========================================== */}
          <div 
            onClick={() => handleSelectTab('question-paper')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-icon.png"
                alt="StudyGen AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight flex items-center">
                  <span className="text-cyan-600 dark:text-cyan-400">Study</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Gen</span>
                  <span className="text-orange-500 ml-1">AI</span>
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 hidden sm:inline-block">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden xl:block font-medium">
                বহুমুখী শিক্ষা ও AI প্রশ্নপত্র তৈরি হাব
              </p>
            </div>
          </div>

          {/* ==========================================
              CENTER: MINIMAL CATEGORIZED DROPDOWNS
             ========================================== */}
          <nav className="hidden lg:flex items-center gap-1">
            {navSections.map((section) => {
              const isOpen = activeDropdown === section.id;
              const hasActiveChild = section.items.some(it => it.id === activeTab);

              return (
                <div key={section.id} className="relative">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : section.id)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      isOpen || hasActiveChild
                        ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/50'
                        : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <span>{section.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                  </button>

                  {/* Dropdown Menu Panel */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2.5 w-72 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 backdrop-blur-2xl shadow-2xl space-y-1 animate-fade-in z-50">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isCurrentActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectTab(item.id)}
                            className={`w-full p-2.5 rounded-xl text-left transition flex items-start gap-2.5 cursor-pointer ${
                              isCurrentActive
                                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 font-bold'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isCurrentActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                              <ItemIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold truncate flex items-center justify-between">
                                <span>{item.label}</span>
                                {item.badge && (
                                  <span className="text-[8px] font-extrabold px-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ==========================================
              RIGHT: ACTION TOOLBAR & GET STARTED CTA
             ========================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Drafts Trigger */}
            {onOpenDrafts && (
              <button
                onClick={onOpenDrafts}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="রিসেন্ট ড্রাফট ও হিস্ট্রি"
              >
                <History className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Draft</span>
              </button>
            )}

            {/* Focus Timer Trigger */}
            {onToggleTimer && (
              <button
                onClick={onToggleTimer}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-400 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="স্টাডি ও এক্সাম টাইমার"
              >
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden sm:inline">Timer</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isDarkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            {/* Primary 'শুরু করুন' CTA Button (Cmd + K / Palette launcher) */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>শুরু করুন</span>
              </button>
            )}

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
            {/* Mobile Search Button */}
            {onOpenCommandPalette && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCommandPalette();
                }}
                className="w-full p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-between text-xs font-bold cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>যেকোনো টুল বা ফিচার খুঁজুন</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px]">
                  ⌘K
                </span>
              </button>
            )}

            {/* Grouped Links */}
            {navSections.map((group) => (
              <div key={group.id} className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  {group.label}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map(subItem => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeTab === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleSelectTab(subItem.id)}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
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
          </div>
        )}
      </div>
    </header>
  );
};
