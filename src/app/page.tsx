'use client';

import React, { useState } from 'react';
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
import { AboutCreator } from '../components/AboutCreator';
import { QuestionPaperData } from '../types/question-paper';
import { SAMPLE_EXAM_PAPERS } from '../lib/sample-data';
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
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('question-paper');
  const [paperViewMode, setPaperViewMode] = useState<'edit' | 'preview'>('preview');
  const [paperData, setPaperData] = useState<QuestionPaperData>(SAMPLE_EXAM_PAPERS[0].data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Cross-tab text sharing states
  const [diffTextA, setDiffTextA] = useState('');
  const [diffTextB, setDiffTextB] = useState('');
  const [grammarText, setGrammarText] = useState('');

  const handleSendToGrammarChecker = (text: string) => {
    setGrammarText(text);
    setActiveTab('grammar-checker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompareDiffInDiffChecker = (originalText: string, correctedText: string) => {
    setDiffTextA(originalText);
    setDiffTextB(correctedText);
    setActiveTab('text-diff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaperGenerated = (data: QuestionPaperData) => {
    setPaperData(data);
    setPaperViewMode('preview');
  };

  const toggleColumns = () => {
    setPaperData((prev) => ({
      ...prev,
      twoColumnLayout: !prev.twoColumnLayout
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
        
        {/* ==========================================
            TAB 1: PHOTO TO QUESTION PAPER (FLAGSHIP)
           ========================================== */}
        {activeTab === 'question-paper' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
                <span>ফ্ল্যাগশিপ ফিচার — AI Photo to Google Docs Question Paper</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                খাতায় লিখুন, ছবি তুলুন — পেয়ে যান{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                  গুগল ডক এডিটেবল প্রশ্নপত্র
                </span>
              </h1>
              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                হাতে লেখা বা বইয়ের প্রশ্নের ছবি আপলোড করলেই এআই স্বয়ংক্রিয়ভাবে সৃজনশীল (CQ), বহুনির্বাচনী (MCQ) ও মান বণ্টন সাজিয়ে <strong>১০০% এডিটেবল .docx</strong> ফাইল তৈরি করে দেয়।
              </p>
            </div>

            {/* Step 1: Photo Uploader */}
            <PhotoUploader
              onPaperGenerated={handlePaperGenerated}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />

            {/* Step 2: Paper Workspace (Editor vs Live Preview) */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 w-full sm:w-auto">
                    মোড নির্বাচন:
                  </span>
                  <div className="flex flex-1 sm:flex-none items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setPaperViewMode('preview')}
                      className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition ${
                        paperViewMode === 'preview'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>প্রিভিউ</span>
                    </button>
                    <button
                      onClick={() => setPaperViewMode('edit')}
                      className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition ${
                        paperViewMode === 'edit'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>এডিটর</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    ডাউনলোড (.docx)
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
            TAB 2: EQUATION & MATH SOLVER
           ========================================== */}
        {activeTab === 'math-solver' && (
          <div className="space-y-6 animate-fade-in">
            <EquationSolver />
          </div>
        )}

        {/* ==========================================
            TAB 3: GPA & GRADE CALCULATOR
           ========================================== */}
        {activeTab === 'gpa-calculator' && (
          <div className="space-y-6 animate-fade-in">
            <GpaCalculator />
          </div>
        )}

        {/* ==========================================
            TAB 4: BASE & NUMBER CONVERTER
           ========================================== */}
        {activeTab === 'base-converter' && (
          <div className="space-y-6 animate-fade-in">
            <BaseConverter />
          </div>
        )}

        {/* ==========================================
            TAB 5: FORMULA LIBRARY
           ========================================== */}
        {activeTab === 'formula-library' && (
          <div className="space-y-6 animate-fade-in">
            <FormulaLibrary />
          </div>
        )}

        {/* ==========================================
            TAB 6: QUICK OCR
           ========================================== */}
        {activeTab === 'quick-ocr' && (
          <div className="space-y-6 animate-fade-in">
            <QuickOcr />
          </div>
        )}

        {/* ==========================================
            TAB 7: ABOUT & CREATOR PROFILE
           ========================================== */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fade-in">
            <AboutCreator />
          </div>
        )}

      </main>

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
