'use client';

import React, { useState } from 'react';
import { GpaSubject, GpaResult } from '../../types/utilities';
import { calculateSscHscGpa } from '../../lib/utility-helpers';
import { Award, Plus, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GpaCalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<GpaSubject[]>([
    { id: '1', name: 'বাংলা (Bangla)', gradePoint: 5.0, letterGrade: 'A+' },
    { id: '2', name: 'ইংরেজি (English)', gradePoint: 5.0, letterGrade: 'A+' },
    { id: '3', name: 'সাধারণ গণিত (General Math)', gradePoint: 5.0, letterGrade: 'A+' },
    { id: '4', name: 'পদার্থবিজ্ঞান (Physics)', gradePoint: 5.0, letterGrade: 'A+' },
    { id: '5', name: 'রসায়ন (Chemistry)', gradePoint: 5.0, letterGrade: 'A+' },
    { id: '6', name: 'জীববিজ্ঞান (Biology)', gradePoint: 5.0, letterGrade: 'A+' },
    { id: '7', name: 'উচ্চতর গণিত (Higher Math - ৪র্থ বিষয়)', gradePoint: 5.0, letterGrade: 'A+', isOptional: true },
  ]);

  const [result, setResult] = useState<GpaResult>(calculateSscHscGpa(subjects));

  const gradeOptions = [
    { label: 'A+ (৫.০০)', point: 5.0, grade: 'A+' },
    { label: 'A (৪.০০)', point: 4.0, grade: 'A' },
    { label: 'A- (৩.৫০)', point: 3.5, grade: 'A-' },
    { label: 'B (৩.০০)', point: 3.0, grade: 'B' },
    { label: 'C (২.০০)', point: 2.0, grade: 'C' },
    { label: 'D (১.০০)', point: 1.0, grade: 'D' },
    { label: 'F (০.০০ - ফেল)', point: 0.0, grade: 'F' },
  ];

  const handleUpdateGrade = (id: string, point: number, grade: string) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, gradePoint: point, letterGrade: grade } : s));
    setSubjects(updated);
    setResult(calculateSscHscGpa(updated));
  };

  const handleToggleOptional = (id: string) => {
    const updated = subjects.map((s) => ({
      ...s,
      isOptional: s.id === id ? !s.isOptional : false
    }));
    setSubjects(updated);
    setResult(calculateSscHscGpa(updated));
  };

  const handleAddSubject = () => {
    const newSub: GpaSubject = {
      id: `${Date.now()}`,
      name: `নতুন বিষয় ${subjects.length + 1}`,
      gradePoint: 5.0,
      letterGrade: 'A+'
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    setResult(calculateSscHscGpa(updated));
  };

  const handleDeleteSubject = (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    setResult(calculateSscHscGpa(updated));
  };

  const handleReset = () => {
    const reset = subjects.map((s) => ({ ...s, gradePoint: 5.0, letterGrade: 'A+' }));
    setSubjects(reset);
    setResult(calculateSscHscGpa(reset));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Result Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
              SSC / HSC গ্রেডিং সিস্টেম (৫.০০ স্কেল)
            </span>
            <div className="flex items-baseline gap-3 pt-2">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight">
                GPA {result.gpa.toFixed(2)}
              </h2>
              <span className="text-2xl sm:text-3xl font-bold text-amber-300">
                ({result.letterGrade})
              </span>
            </div>
            <p className="text-sm text-indigo-100 font-medium pt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> {result.remarks}
            </p>
          </div>

          <button
            onClick={() => {
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            }}
            className="px-6 py-3 rounded-2xl bg-white text-indigo-600 font-bold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition"
          >
            🎉 ফলাফল সেলিব্রেট করুন
          </button>
        </div>
      </div>

      {/* Subject List Editor */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              বিষয়ভিত্তিক গ্রেড নির্বাচন
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-indigo-500 flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> রিসেট
          </button>
        </div>

        <div className="space-y-3">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                sub.isOptional
                  ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) => {
                    const updated = subjects.map((s) => (s.id === sub.id ? { ...s, name: e.target.value } : s));
                    setSubjects(updated);
                  }}
                  className="bg-transparent font-semibold text-xs sm:text-sm text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none flex-1"
                />
                {sub.isOptional && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    ৪র্থ বিষয় (+বোনাছ)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleOptional(sub.id)}
                  className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border transition ${
                    sub.isOptional
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {sub.isOptional ? '৪র্থ বিষয় হিসেবে সক্রিয়' : '৪র্থ বিষয় নির্ধারণ'}
                </button>

                <select
                  value={`${sub.gradePoint}`}
                  onChange={(e) => {
                    const selected = gradeOptions.find((g) => g.point === parseFloat(e.target.value));
                    if (selected) {
                      handleUpdateGrade(sub.id, selected.point, selected.grade);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.grade} value={opt.point}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleDeleteSubject(sub.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddSubject}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:border-indigo-500 flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> আরও বিষয় যোগ করুন
        </button>
      </div>
    </div>
  );
};
