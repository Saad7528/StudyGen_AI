'use client';

import React, { useState } from 'react';
import { QuestionPaperData } from '../../types/question-paper';
import { generateQuestionPaperDocx } from '../../lib/docx-generator';
import { Download, FileText, ExternalLink, Check, Copy, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuestionPaperData;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  const [filename, setFilename] = useState(
    `${data.header.subject || 'Question_Paper'}_${data.header.examTitle || 'Exam'}`.replace(/\s+/g, '_')
  );
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadDocx = async () => {
    setIsExporting(true);
    try {
      await generateQuestionPaperDocx(data, filename);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      alert('ফাইল জেনারেট করতে সমস্যা হয়েছে।');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyFormattedText = () => {
    let text = `${data.header.schoolName}\n${data.header.examTitle}\n`;
    if (data.header.className || data.header.subject) {
      text += `শ্রেণি: ${data.header.className} | বিষয়: ${data.header.subject}\n`;
    }
    text += `সময়: ${data.header.timeAllowed} | পূর্ণমান: ${data.header.fullMarks}\n\n`;

    data.sections.forEach((sec) => {
      text += `[ ${sec.title} ]\n`;
      sec.questions.forEach((q) => {
        if (q.type === 'cq') {
          text += `${q.number}। ${q.stem || q.text}\n`;
          q.subQuestions?.forEach((sub) => {
            text += `   (${sub.label}) ${sub.text} (${sub.marks})\n`;
          });
        } else if (q.type === 'mcq') {
          text += `${q.number}। ${q.text}\n`;
          q.options?.forEach((opt) => {
            text += `   (${opt.label}) ${opt.text}\n`;
          });
        } else {
          text += `${q.number}। ${q.text} (${q.marks})\n`;
        }
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPdf = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              প্রশ্নপত্র ডাউনলোড ও এক্সপোর্ট
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              গুগল ডক (.docx), সরাসরি PDF বা টেক্সট ফরম্যাটে সংরক্ষণ করুন
            </p>
          </div>
        </div>

        {/* Filename Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            ফাইলের নাম (File Name)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-xs font-bold text-slate-400">.docx</span>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadDocx}
            disabled={isExporting}
            className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-1.5 transition"
          >
            {isExporting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'তৈরি হচ্ছে...' : 'ডাউনলোড .docx'}
          </button>

          <button
            onClick={handlePrintPdf}
            className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            PDF / প্রিন্ট
          </button>

          <button
            onClick={handleCopyFormattedText}
            className="w-full py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'কপি হয়েছে!' : 'টেক্সট কপি'}
          </button>
        </div>

        {/* Step-by-Step Google Docs Guide */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/40 border border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              গুগল ডকে (Google Docs) ওপেন করার সহজ নিয়ম:
            </h4>
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              Google Drive যান <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              উপরের <strong>ডাউনলোড .docx ফাইল</strong> বাটনে ক্লিক করে ফাইলটি সেভ করুন।
            </li>
            <li>
              আপনার ব্রাউজারে <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline font-medium">drive.google.com</a> ওপেন করে ফাইলটি আপলোড করুন।
            </li>
            <li>
              আপলোড করা ফাইলে ডাবল ক্লিক করে <strong>Open with Google Docs</strong> এ চাপুন।
            </li>
            <li>
              ব্যাস! পুরো প্রশ্নপত্রটি আপনার গুগল ডকে <strong>১০০% এডিটেবল</strong> ও প্রিন্ট উপযোগী ফরম্যাটে খুলে যাবে!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
