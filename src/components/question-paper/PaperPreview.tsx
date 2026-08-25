'use client';

import React from 'react';
import { QuestionPaperData, QuestionItem } from '../../types/question-paper';
import { KaTeXViewer } from '../KaTeXViewer';
import { Columns, Layout, Printer, Download, Copy, Check } from 'lucide-react';

interface PaperPreviewProps {
  data: QuestionPaperData;
  onToggleColumns: () => void;
  onOpenExportModal: () => void;
}

export const PaperPreview: React.FC<PaperPreviewProps> = ({
  data,
  onToggleColumns,
  onOpenExportModal
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyText = () => {
    // Generate clean plain text formatted for quick pasting
    let text = `${data.header.schoolName}\n${data.header.examTitle}\n`;
    if (data.header.className || data.header.subject) {
      text += `শ্রেণি: ${data.header.className} | বিষয়: ${data.header.subject}\n`;
    }
    text += `সময়: ${data.header.timeAllowed} | পূর্ণমান: ${data.header.fullMarks}\n`;
    text += `--------------------------------------------------\n\n`;

    data.sections.forEach((sec) => {
      text += `\n[ ${sec.title} ]\n${sec.instruction || ''} (${sec.totalMarks || ''})\n\n`;
      sec.questions.forEach((q) => {
        if (q.type === 'cq') {
          text += `${q.number}। ${q.stem || ''}\n`;
          q.subQuestions?.forEach((sub) => {
            text += `   (${sub.label}) ${sub.text} [${sub.marks}]\n`;
          });
        } else if (q.type === 'mcq') {
          text += `${q.number}। ${q.text}\n`;
          q.options?.forEach((opt) => {
            text += `   (${opt.label}) ${opt.text}\n`;
          });
        } else {
          text += `${q.number}। ${q.text} [${q.marks}]\n`;
        }
        text += '\n';
      });
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-full sm:w-auto">
            লেআউট মোড:
          </span>
          <button
            type="button"
            onClick={onToggleColumns}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              data.twoColumnLayout
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> ২-কলাম (বোর্ড)
          </button>
          <button
            type="button"
            onClick={onToggleColumns}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              !data.twoColumnLayout
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Layout className="w-3.5 h-3.5" /> ১-কলাম স্ট্যান্ডার্ড
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            title="গুগল ডকে সরাসরি পেস্ট করার জন্য কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'কপি হয়েছে!' : 'কপি'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            title="সরাসরি প্রিন্ট অথবা পিডিএফ (Save as PDF) হিসেবে ডাউনলোড করুন"
          >
            <Printer className="w-3.5 h-3.5" /> প্রিন্ট / PDF
          </button>
          <button
            type="button"
            onClick={onOpenExportModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> .docx এক্সপোর্ট
          </button>
        </div>
      </div>

      {/* Real Paper Preview Container (A4 Look) */}
      <div 
        id="printable-question-paper" 
        className="bg-white text-slate-900 shadow-2xl rounded-2xl p-4 sm:p-10 md:p-14 border border-slate-200 max-w-4xl mx-auto min-h-[700px] sm:min-h-[900px] font-sans antialiased select-text overflow-x-auto"
      >
        {/* Header Block */}
        <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900">
          {data.header.schoolName && (
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-serif">
              {data.header.schoolName}
            </h2>
          )}
          {data.header.examTitle && (
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              {data.header.examTitle}
            </h3>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 pt-1">
            {data.header.className && <span>শ্রেণি: {data.header.className}</span>}
            {data.header.className && data.header.subject && <span>•</span>}
            {data.header.subject && <span>বিষয়: {data.header.subject}</span>}
            {data.header.subjectCode && <span>(বিষয় কোড: {data.header.subjectCode})</span>}
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 pt-2 border-t border-slate-400 mt-2">
            <span>সময়: {data.header.timeAllowed || '২ ঘণ্টা ৩০ মিনিট'}</span>
            <span>পূর্ণমান: {data.header.fullMarks || '১০০'}</span>
          </div>

          {data.header.generalInstructions && (
            <p className="text-[11px] sm:text-xs italic text-slate-600 pt-1">
              [ {data.header.generalInstructions} ]
            </p>
          )}
        </div>

        {/* Questions Body (Support 1-column or 2-column) */}
        <div
          className={`mt-6 ${
            data.twoColumnLayout
              ? 'columns-1 md:columns-2 gap-8 [column-rule:1px_dashed_#cbd5e1]'
              : 'space-y-6'
          }`}
        >
          {data.sections.map((sec, sIdx) => (
            <div key={sec.id || sIdx} className="mb-6 break-inside-avoid">
              {/* Section Title */}
              <div className="text-center mb-3">
                <span className="inline-block font-bold text-sm sm:text-base border-b border-slate-900 pb-0.5 px-3">
                  {sec.title}
                </span>
                {(sec.instruction || sec.totalMarks) && (
                  <p className="text-xs italic font-semibold text-slate-700 mt-1">
                    {sec.instruction} {sec.totalMarks && `(${sec.totalMarks})`}
                  </p>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {sec.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="break-inside-avoid text-xs sm:text-sm">
                    {/* CQ Item */}
                    {q.type === 'cq' && (
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-1 font-normal leading-relaxed text-slate-900">
                          <span className="font-bold">{q.number}।</span>
                          <div className="flex-1">
                            <KaTeXViewer content={q.stem || q.text} />
                          </div>
                        </div>

                        {q.subQuestions && q.subQuestions.length > 0 && (
                          <div className="pl-4 sm:pl-6 space-y-1">
                            {q.subQuestions.map((sub, subIdx) => (
                              <div key={sub.id || subIdx} className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-1 flex-1">
                                  <span className="font-bold text-slate-900">({sub.label})</span>
                                  <span>
                                    <KaTeXViewer content={sub.text} />
                                  </span>
                                </div>
                                <span className="font-bold text-slate-900 shrink-0 text-right w-6">
                                  {sub.marks}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* MCQ Item */}
                    {q.type === 'mcq' && (
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-1 leading-relaxed">
                          <span className="font-bold">{q.number}।</span>
                          <div className="flex-1">
                            <KaTeXViewer content={q.text} />
                          </div>
                        </div>

                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 pl-4 sm:pl-6 text-[11px] sm:text-xs">
                            {q.options.map((opt, optIdx) => (
                              <div key={opt.id || optIdx} className="flex items-center gap-1">
                                <span className="font-bold">({opt.label})</span>
                                <span>
                                  <KaTeXViewer content={opt.text} />
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Short / Broad / Translation Item */}
                    {q.type !== 'cq' && q.type !== 'mcq' && (
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2 leading-relaxed">
                          <div className="flex items-start gap-1 flex-1">
                            <span className="font-bold">{q.number}।</span>
                            <span>
                              <KaTeXViewer content={q.text || q.stem || ''} />
                            </span>
                          </div>
                          {q.marks && (
                            <span className="font-bold text-slate-900 shrink-0">
                              {q.marks}
                            </span>
                          )}
                        </div>

                        {q.subQuestions && q.subQuestions.length > 0 && (
                          <div className="pl-4 sm:pl-6 space-y-1">
                            {q.subQuestions.map((sub, subIdx) => (
                              <div key={sub.id || subIdx} className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-1 flex-1">
                                  <span className="font-bold text-slate-900">({sub.label})</span>
                                  <span>
                                    <KaTeXViewer content={sub.text} />
                                  </span>
                                </div>
                                {sub.marks ? (
                                  <span className="font-bold text-slate-900 shrink-0 text-right w-6">
                                    {sub.marks}
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
