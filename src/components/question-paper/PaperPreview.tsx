'use client';

import React from 'react';
import { QuestionPaperData, QuestionItem } from '../../types/question-paper';
import { KaTeXViewer } from '../KaTeXViewer';
import { Columns, Layout, Printer, Download, Copy, Check, Sparkles, FileDown, ShieldCheck } from 'lucide-react';
import { formatMathAndTextForDocx } from '../../lib/docx-generator';

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

  const handleCopyText = async () => {
    // 1. Clean plain text version
    let plain = `${formatMathAndTextForDocx(data.header.schoolName)}\n${formatMathAndTextForDocx(data.header.examTitle)}\n`;
    if (data.header.className || data.header.subject) {
      plain += `শ্রেণি: ${data.header.className} | বিষয়: ${data.header.subject}\n`;
    }
    plain += `সময়: ${data.header.timeAllowed} | পূর্ণমান: ${data.header.fullMarks}\n`;
    plain += `--------------------------------------------------\n\n`;

    // 2. Rich HTML version formatted specifically for Google Docs & Word paste
    let html = `<div style="font-family: 'Noto Sans Bengali', Arial, sans-serif; font-size: 12pt; color: #000000; line-height: 1.5;">`;

    if (data.header.schoolName) {
      html += `<div style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 4px;">${formatMathAndTextForDocx(data.header.schoolName)}</div>`;
    }
    if (data.header.examTitle) {
      html += `<div style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 6px;">${formatMathAndTextForDocx(data.header.examTitle)}</div>`;
    }

    const classSub = [
      data.header.className ? `শ্রেণি: ${data.header.className}` : '',
      data.header.subject ? `বিষয়: ${data.header.subject}` : '',
      data.header.subjectCode ? `(বিষয় কোড: ${data.header.subjectCode})` : ''
    ].filter(Boolean).join('  |  ');

    if (classSub) {
      html += `<div style="text-align: center; font-size: 11pt; font-weight: bold; margin-bottom: 8px;">${formatMathAndTextForDocx(classSub)}</div>`;
    }

    // Header Table for Time & Full Marks
    html += `<table style="width: 100%; border-collapse: collapse; border-bottom: 1.5px solid #333; margin-bottom: 12px; font-weight: bold; font-size: 11pt;">
      <tr>
        <td style="text-align: left; padding: 4px 0;">${data.header.timeAllowed ? 'সময়: ' + formatMathAndTextForDocx(data.header.timeAllowed) : ''}</td>
        <td style="text-align: right; padding: 4px 0;">${data.header.fullMarks ? 'পূর্ণমান: ' + formatMathAndTextForDocx(data.header.fullMarks) : ''}</td>
      </tr>
    </table>`;

    if (data.header.generalInstructions) {
      html += `<div style="text-align: center; font-style: italic; font-size: 10.5pt; margin-bottom: 14px;">[ ${formatMathAndTextForDocx(data.header.generalInstructions)} ]</div>`;
    }

    data.sections.forEach((sec) => {
      plain += `\n[ ${formatMathAndTextForDocx(sec.title)} ]\n${formatMathAndTextForDocx(sec.instruction || '')} (${formatMathAndTextForDocx(sec.totalMarks || '')})\n\n`;

      html += `<div style="text-align: center; font-weight: bold; font-size: 13pt; text-decoration: underline; margin-top: 18px; margin-bottom: 4px;">${formatMathAndTextForDocx(sec.title)}</div>`;

      if (sec.instruction || sec.totalMarks) {
        html += `<div style="text-align: center; font-style: italic; font-weight: bold; font-size: 10.5pt; margin-bottom: 10px;">${formatMathAndTextForDocx(sec.instruction || '')} ${sec.totalMarks ? '(' + formatMathAndTextForDocx(sec.totalMarks) + ')' : ''}</div>`;
      }

      sec.questions.forEach((q) => {
        if (q.type === 'cq') {
          const stemText = q.stem ? `${q.number}। ${formatMathAndTextForDocx(q.stem)}` : `${q.number}। ${formatMathAndTextForDocx(q.text)}`;
          plain += `${stemText}\n`;
          html += `<div style="margin-top: 10px; margin-bottom: 4px; font-weight: ${q.stem ? 'normal' : 'bold'};">${stemText}</div>`;

          q.subQuestions?.forEach((sub) => {
            plain += `   (${sub.label}) ${formatMathAndTextForDocx(sub.text)} [${formatMathAndTextForDocx(sub.marks)}]\n`;
            html += `<div style="margin-left: 24px; margin-bottom: 3px;"><b>(${sub.label})</b> ${formatMathAndTextForDocx(sub.text)} ${sub.marks ? '<b>[' + formatMathAndTextForDocx(sub.marks) + ']</b>' : ''}</div>`;
          });
        } else if (q.type === 'mcq') {
          const mcqText = `${q.number}। ${formatMathAndTextForDocx(q.text)}`;
          plain += `${mcqText}\n`;
          html += `<div style="margin-top: 8px; margin-bottom: 4px;">${mcqText} ${q.marks ? '<b>[' + formatMathAndTextForDocx(q.marks) + ']</b>' : ''}</div>`;

          if (q.options?.length) {
            html += `<table style="width: 100%; border-collapse: collapse; margin-left: 20px; margin-bottom: 6px;">`;
            for (let i = 0; i < q.options.length; i += 2) {
              const opt1 = q.options[i];
              const opt2 = q.options[i + 1];
              html += `<tr>
                <td style="width: 50%; padding: 2px 0;"><b>(${opt1.label})</b> ${formatMathAndTextForDocx(opt1.text)}</td>
                <td style="width: 50%; padding: 2px 0;">${opt2 ? '<b>(' + opt2.label + ')</b> ' + formatMathAndTextForDocx(opt2.text) : ''}</td>
              </tr>`;
              plain += `   (${opt1.label}) ${formatMathAndTextForDocx(opt1.text)}        ${opt2 ? '(' + opt2.label + ') ' + formatMathAndTextForDocx(opt2.text) : ''}\n`;
            }
            html += `</table>`;
          }
        } else {
          const standardText = `${q.number}। ${formatMathAndTextForDocx(q.text || q.stem || '')}`;
          plain += `${standardText} [${formatMathAndTextForDocx(q.marks)}]\n`;
          html += `<div style="margin-top: 8px; margin-bottom: 4px;"><b>${q.number}।</b> ${formatMathAndTextForDocx(q.text || q.stem || '')} ${q.marks ? '<b>[' + formatMathAndTextForDocx(q.marks) + ']</b>' : ''}</div>`;

          q.subQuestions?.forEach((sub) => {
            plain += `   (${sub.label}) ${formatMathAndTextForDocx(sub.text)} [${formatMathAndTextForDocx(sub.marks)}]\n`;
            html += `<div style="margin-left: 24px; margin-bottom: 3px;"><b>(${sub.label})</b> ${formatMathAndTextForDocx(sub.text)} ${sub.marks ? '<b>[' + formatMathAndTextForDocx(sub.marks) + ']</b>' : ''}</div>`;
          });
        }
        plain += '\n';
      });
    });

    html += `</div>`;

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const textBlob = new Blob([plain], { type: 'text/plain' });
        const htmlBlob = new Blob([html], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob
        });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(plain);
      }
    } catch (e) {
      await navigator.clipboard.writeText(plain);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };


  return (
    <div className="space-y-5">
      {/* Ultra-Premium Glassmorphic Action Toolbar */}
      <div className="relative overflow-hidden p-3 sm:p-4 rounded-3xl bg-gradient-to-r from-white/90 via-indigo-50/40 to-white/90 dark:from-slate-900/90 dark:via-indigo-950/30 dark:to-slate-900/90 border border-indigo-100/80 dark:border-indigo-900/40 backdrop-blur-2xl shadow-xl shadow-indigo-500/5 transition-all">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Layout Mode Segmented Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>লেআউট মোড:</span>
            </div>

            <div className="flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
              <button
                type="button"
                onClick={onToggleColumns}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
                  data.twoColumnLayout
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
                title="বোর্ড স্ট্যান্ডার্ড ২-কলাম প্রশ্নপত্র ফরম্যাট"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>২-কলাম (বোর্ড)</span>
                {data.twoColumnLayout && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                )}
              </button>

              <button
                type="button"
                onClick={onToggleColumns}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
                  !data.twoColumnLayout
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
                title="১-কলাম ক্লাসিক প্রশ্নপত্র ফরম্যাট"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>১-কলাম স্ট্যান্ডার্ড</span>
                {!data.twoColumnLayout && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                )}
              </button>
            </div>
          </div>

          {/* Right: Premium Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
              title="গুগল ডকে সরাসরি পেস্ট করার জন্য ফরম্যাটেড টেক্সট কপি করুন"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>কপি টেক্সট</span>
                </>
              )}
            </button>

            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="group relative px-4 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              title="সরাসরি শুধুমাত্র প্রশ্নপত্রটিকে A4 সাইজে প্রিন্ট বা PDF হিসেবে সেভ করুন"
            >
              <div className="p-1 rounded-lg bg-white/10 dark:bg-slate-900/10 group-hover:rotate-12 transition-transform">
                <Printer className="w-3.5 h-3.5 text-cyan-400 dark:text-indigo-600" />
              </div>
              <span>প্রিন্ট / PDF</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 dark:text-indigo-600 font-extrabold">
                A4 রেডি
              </span>
            </button>

            {/* .docx Export Flagship Button */}
            <button
              type="button"
              onClick={onOpenExportModal}
              className="relative px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 flex items-center gap-2 transition-all overflow-hidden group"
              title="সম্পূর্ণ ১০০% এডিটেবল Microsoft Word (.docx) ফাইল ডাউনলোড করুন"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Download className="w-3.5 h-3.5 animate-bounce relative z-10" />
              <span className="relative z-10">.docx এক্সপোর্ট</span>
            </button>
          </div>

        </div>
      </div>

      {/* Real Paper Preview Container (A4 Look) */}

      <div 
        id="printable-question-paper" 
        className={`relative bg-white text-slate-900 shadow-2xl rounded-2xl p-6 sm:p-12 md:p-14 border border-slate-200 max-w-4xl mx-auto min-h-[750px] sm:min-h-[950px] font-sans antialiased select-text overflow-hidden ${
          data.header.themeStyle === 'boxed' ? 'border-2 border-slate-900 m-2 sm:m-4' : ''
        }`}
      >
        {/* Optional Watermark Overlay */}
        {data.header.watermarkText && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden -z-0">
            <div className="text-slate-300/35 font-black text-4xl sm:text-6xl md:text-7xl -rotate-45 tracking-widest uppercase text-center max-w-lg leading-tight">
              {data.header.watermarkText}
            </div>
          </div>
        )}

        <div className="relative z-10">
          {/* Header Block */}
          <div className={`pb-3 border-b-2 border-slate-900 mb-6 ${

            data.header.themeStyle === 'classic' ? 'border-b-4 border-double border-slate-900' : ''
          }`}>
            <div className="flex items-center justify-center gap-4 relative">
              {/* Optional Logo */}
              {data.header.logoUrl && (
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.header.logoUrl}
                    alt="School Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}

              <div className="text-center flex-1 space-y-1">
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
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 pt-0.5">
                  {data.header.className && <span>শ্রেণি: {data.header.className}</span>}
                  {data.header.className && data.header.subject && <span>•</span>}
                  {data.header.subject && <span>বিষয়: {data.header.subject}</span>}
                  {data.header.subjectCode && <span>(বিষয় কোড: {data.header.subjectCode})</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 pt-2 border-t border-slate-400 mt-3">
              <span>সময়: {data.header.timeAllowed || '২ ঘণ্টা ৩০ মিনিট'}</span>
              <span>পূর্ণমান: {data.header.fullMarks || '১০০'}</span>
            </div>

            {data.header.generalInstructions && (
              <p className="text-[11px] sm:text-xs italic text-slate-600 pt-1 text-center">
                [ {data.header.generalInstructions} ]
              </p>
            )}
          </div>

          {/* Questions Body (Support 1-column or 2-column) */}
          <div
            className={`mt-4 ${
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

          {/* Footer Signature Boxes */}
          {(data.header.showSignatures ?? true) && (
            <div className="mt-12 pt-8 border-t border-dashed border-slate-300 flex justify-between items-end text-xs font-bold text-slate-800 break-inside-avoid">
              <div className="text-center w-40 border-t border-slate-900 pt-1">
                <span>কক্ষ পরিদর্শকের স্বাক্ষর</span>
              </div>
              <div className="text-center w-40 border-t border-slate-900 pt-1">
                <span>প্রধান শিক্ষক / পরীক্ষা নিয়ন্ত্রক</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

