'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PhotoUploader } from '../components/question-paper/PhotoUploader';
import { PaperHeaderEditor } from '../components/question-paper/PaperHeaderEditor';
import { QuestionEditor } from '../components/question-paper/QuestionEditor';
import { PaperPreview } from '../components/question-paper/PaperPreview';
import { ExportModal } from '../components/question-paper/ExportModal';
import { EquationSolver } from '../components/math-solver/EquationSolver';
import { GpaCalculator } from '../components/utilities/GpaCalculator';
import { BaseConverter } from '../components/utilities/BaseConverter';
import { FormulaLibrary } from '../components/utilities/FormulaLibrary';
import { QuickOcr } from '../components/utilities/QuickOcr';
import { TextDiffChecker } from '../components/utilities/TextDiffChecker';
import { GrammarChecker } from '../components/utilities/GrammarChecker';
import { OmrGenerator } from '../components/utilities/OmrGenerator';
import { StudySummaryGenerator } from '../components/utilities/StudySummaryGenerator';
import { QuizFlashcardPractice } from '../components/utilities/QuizFlashcardPractice';
import { AboutCreator } from '../components/AboutCreator';
import { QuestionPaperData } from '../types/question-paper';
import { SAMPLE_EXAM_PAPERS } from '../lib/sample-data';

// New Showcase & Productivity Components
import { CommandPalette } from '../components/common/CommandPalette';
import { RecentDraftsDrawer, DraftItem, saveDraftToStorage } from '../components/common/RecentDraftsDrawer';
import { FocusExamTimer } from '../components/common/FocusExamTimer';
import { UniversalSearchBar } from '../components/home/UniversalSearchBar';
import { LiveWorkflowShowcase } from '../components/home/LiveWorkflowShowcase';
import { ToolsBentoGrid } from '../components/home/ToolsBentoGrid';

import { 
  Sparkles, 
  FileText, 
  Eye, 
  Edit3, 
  Download, 
  CheckCircle2, 
  Calculator, 
  Award, 
  Binary, 
  BookOpen, 
  Search,
  UploadCloud,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const VALID_TABS = [
  'question-paper',
  'mcq-game',
  'omr-generator',
  'study-summary',
  'text-diff',
  'quiz-practice',
  'grammar-checker',
  'quick-ocr',
  'math-solver',
  'gpa-calculator',
  'base-converter',
  'formula-library',
  'about'
];

export default function HomePage() {
  const [activeTab, setActiveTabState] = useState<string>('question-paper');
  const [paperViewMode, setPaperViewMode] = useState<'edit' | 'preview'>('preview');
  const [paperData, setPaperData] = useState<QuestionPaperData>(SAMPLE_EXAM_PAPERS[0].data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Productivity Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDraftsDrawerOpen, setIsDraftsDrawerOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  // Cross-tab text sharing states
  const [diffTextA, setDiffTextA] = useState('');
  const [diffTextB, setDiffTextB] = useState('');
  const [grammarText, setGrammarText] = useState('');

  // 1. Initialize active tab from URL query params, hash or localStorage on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const hashParam = window.location.hash.replace('#', '');
      const savedTab = localStorage.getItem('studygen_active_tab');

      const targetTab = (tabParam && VALID_TABS.includes(tabParam))
        ? tabParam
        : (hashParam && VALID_TABS.includes(hashParam))
        ? hashParam
        : (savedTab && VALID_TABS.includes(savedTab))
        ? savedTab
        : 'question-paper';

      setActiveTabState(targetTab);

      // Keep URL search param synced
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.get('tab') !== targetTab) {
        currentUrl.searchParams.set('tab', targetTab);
        window.history.replaceState({ tab: targetTab }, '', currentUrl.toString());
      }
    } catch {
      // Fallback safe for SSR/Edge
    }
  }, []);

  // 2. Global Keyboard Shortcut for Command Palette (Cmd + K / Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3. Handle browser Back/Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam && VALID_TABS.includes(tabParam)) {
          setActiveTabState(tabParam);
        } else if (event.state?.tab && VALID_TABS.includes(event.state.tab)) {
          setActiveTabState(event.state.tab);
        }
      } catch {
        // Fallback
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 4. Tab switch handler with URL & storage synchronization
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('studygen_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({ tab }, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Safe fallback
    }
  };

  const handleSendToGrammarChecker = (text: string) => {
    setGrammarText(text);
    setActiveTab('grammar-checker');
  };

  const handleCompareDiffInDiffChecker = (originalText: string, correctedText: string) => {
    setDiffTextA(originalText);
    setDiffTextB(correctedText);
    setActiveTab('text-diff');
  };

  const handlePaperGenerated = (data: QuestionPaperData) => {
    setPaperData(data);
    setPaperViewMode('preview');
    // Auto-save to recent drafts
    saveDraftToStorage(
      'question-paper',
      'প্রশ্নপত্র মেকার',
      data.header?.examTitle || data.header?.schoolName || 'নতুন প্রশ্নপত্র',
      `${data.header?.subject || 'সাধারণ'} — মোট প্রশ্ন: ${data.sections?.length || 0}`,
      data
    );
  };

  const toggleColumns = () => {
    setPaperData((prev) => ({
      ...prev,
      twoColumnLayout: !prev.twoColumnLayout
    }));
  };

  // Restore Draft Handler
  const handleRestoreDraft = (draft: DraftItem) => {
    if (draft.toolId === 'question-paper' && draft.data) {
      setPaperData(draft.data);
      setPaperViewMode('preview');
      setActiveTab('question-paper');
    } else if (draft.toolId === 'text-diff' && draft.data) {
      setDiffTextA(draft.data.textA || '');
      setDiffTextB(draft.data.textB || '');
      setActiveTab('text-diff');
    } else if (draft.toolId === 'grammar-checker' && draft.data) {
      setGrammarText(draft.data.text || '');
      setActiveTab('grammar-checker');
    } else {
      setActiveTab(draft.toolId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenDrafts={() => setIsDraftsDrawerOpen(true)}
        onToggleTimer={() => setIsTimerOpen(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
        
        {/* Back to Home button for other utility pages */}
        {activeTab !== 'question-paper' && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('question-paper')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 backdrop-blur-md shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোম ও টুলস শোরুমে ফিরে যান</span>
            </button>
            <span className="text-xs font-semibold text-slate-400">
              StudyGen AI Workspace
            </span>
          </div>
        )}

        {/* ==========================================
            TAB 1: FLAGSHIP HOME & PHOTO QUESTION PAPER
           ========================================== */}
        {activeTab === 'question-paper' && (
          <div className="space-y-12 animate-fade-in">
            {/* Hero Header & Brand Showcase */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-black shadow-sm">
                <Sparkles className="w-4 h-4 text-pink-500 animate-spin" />
                <span>StudyGen AI — ফ্ল্যাগশিপ AI Photo to Google Docs Question Suite</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                খাতায় লিখুন, ছবি তুলুন — পেয়ে যান{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                  গুগল ডক এডিটেবল প্রশ্নপত্র
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                হাতে লেখা বা বইয়ের পাতার ছবি আপলোড করলেই এআই স্বয়ংক্রিয়ভাবে সৃজনশীল (CQ), বহুনির্বাচনী (MCQ) ও মান বণ্টন সাজিয়ে <strong>১০০% এডিটেবল .docx</strong> ফাইল তৈরি করে দেয়।
              </p>

              {/* Universal Search & Quick Action Launcher */}
              <UniversalSearchBar
                onSelectTab={setActiveTab}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              />
            </div>

            {/* Live 3-Step Workflow Showcase */}
            <LiveWorkflowShowcase />

            {/* Step 1: Photo Uploader Workspace */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <UploadCloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <span>প্রশ্নপত্রের ছবি আপলোড ওয়ার্কস্পেস</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">আপনার ছবি আপলোড করুন অথবা স্যাম্পল প্রশ্ন দিয়ে সাথে সাথে পরীক্ষা করুন</p>
                </div>
              </div>

              <PhotoUploader
                onPaperGenerated={handlePaperGenerated}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>

            {/* Step 2: Paper Workspace (Editor vs Live Preview) */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 w-full sm:w-auto">
                    মোড নির্বাচন:
                  </span>
                  <div className="flex flex-1 sm:flex-none items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setPaperViewMode('preview')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        paperViewMode === 'preview'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>লাইভ প্রিভিউ (A4)</span>
                    </button>
                    <button
                      onClick={() => setPaperViewMode('edit')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        paperViewMode === 'edit'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>এডিটর মোড</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    ডাউনলোড (.docx / Doc)
                  </button>
                </div>
              </div>

              {/* View Switch */}
              {paperViewMode === 'preview' ? (
                <PaperPreview
                  data={paperData}
                  onToggleColumns={toggleColumns}
                  onOpenExportModal={() => setShowExportModal(true)}
                />
              ) : (
                <div className="space-y-6">
                  <PaperHeaderEditor
                    header={paperData.header}
                    onChange={(newHeader) => setPaperData((prev) => ({ ...prev, header: newHeader }))}
                  />
                  <QuestionEditor
                    sections={paperData.sections}
                    onChange={(newSections) => setPaperData((prev) => ({ ...prev, sections: newSections }))}
                  />
                </div>
              )}
            </div>

            {/* All-in-One Bento Grid Hub (Showcasing all 11+ Tools) */}
            <ToolsBentoGrid onSelectTab={setActiveTab} />
          </div>
        )}

        {/* ==========================================
            TAB: TEXT DIFFERENCE FINDER
           ========================================== */}
        {activeTab === 'text-diff' && (
          <div className="space-y-6 animate-fade-in">
            <TextDiffChecker
              initialTextA={diffTextA}
              initialTextB={diffTextB}
              onSendToGrammarChecker={handleSendToGrammarChecker}
            />
          </div>
        )}

        {/* ==========================================
            TAB: OMR SHEET GENERATOR
           ========================================== */}
        {activeTab === 'omr-generator' && (
          <div className="space-y-6 animate-fade-in">
            <OmrGenerator />
          </div>
        )}

        {/* ==========================================
            TAB: AI STUDY SHEET & SUMMARY
           ========================================== */}
        {activeTab === 'study-summary' && (
          <div className="space-y-6 animate-fade-in">
            <StudySummaryGenerator
              onSendToQuiz={() => {
                setActiveTab('quiz-practice');
              }}
            />
          </div>
        )}

        {/* ==========================================
            TAB: AI GAMIFIED MCQ GAME & FLASHCARDS
           ========================================== */}
        {(activeTab === 'mcq-game' || activeTab === 'quiz-practice') && (
          <div className="space-y-6 animate-fade-in">
            <QuizFlashcardPractice paperData={paperData} />
          </div>
        )}

        {/* ==========================================
            TAB: AI GRAMMAR & SPELL CHECKER
           ========================================== */}
        {activeTab === 'grammar-checker' && (
          <div className="space-y-6 animate-fade-in">
            <GrammarChecker
              initialText={grammarText}
              onCompareDiff={handleCompareDiffInDiffChecker}
            />
          </div>
        )}

        {/* ==========================================
            TAB: EQUATION & MATH SOLVER
           ========================================== */}
        {activeTab === 'math-solver' && (
          <div className="space-y-6 animate-fade-in">
            <EquationSolver />
          </div>
        )}

        {/* ==========================================
            TAB: GPA & GRADE CALCULATOR
           ========================================== */}
        {activeTab === 'gpa-calculator' && (
          <div className="space-y-6 animate-fade-in">
            <GpaCalculator />
          </div>
        )}

        {/* ==========================================
            TAB: BASE & NUMBER CONVERTER
           ========================================== */}
        {activeTab === 'base-converter' && (
          <div className="space-y-6 animate-fade-in">
            <BaseConverter />
          </div>
        )}

        {/* ==========================================
            TAB: FORMULA LIBRARY
           ========================================== */}
        {activeTab === 'formula-library' && (
          <div className="space-y-6 animate-fade-in">
            <FormulaLibrary />
          </div>
        )}

        {/* ==========================================
            TAB: QUICK OCR
           ========================================== */}
        {activeTab === 'quick-ocr' && (
          <div className="space-y-6 animate-fade-in">
            <QuickOcr />
          </div>
        )}

        {/* ==========================================
            TAB: ABOUT & CREATOR PROFILE
           ========================================== */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fade-in">
            <AboutCreator />
          </div>
        )}

      </main>

      {/* Global Command Palette Modal (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onOpenDrafts={() => setIsDraftsDrawerOpen(true)}
        onToggleTimer={() => setIsTimerOpen(true)}
      />

      {/* Recent Drafts & Workspace History Drawer */}
      <RecentDraftsDrawer
        isOpen={isDraftsDrawerOpen}
        onClose={() => setIsDraftsDrawerOpen(false)}
        onRestoreDraft={handleRestoreDraft}
      />

      {/* Focus & Exam Study Timer Widget */}
      <FocusExamTimer
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={paperData}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
