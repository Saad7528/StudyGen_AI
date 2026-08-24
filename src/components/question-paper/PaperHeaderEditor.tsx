'use client';

import React from 'react';
import { ExamHeaderInfo } from '../../types/question-paper';
import { School, Clock, Award, BookOpen, FileText } from 'lucide-react';

interface PaperHeaderEditorProps {
  header: ExamHeaderInfo;
  onChange: (header: ExamHeaderInfo) => void;
}

export const PaperHeaderEditor: React.FC<PaperHeaderEditorProps> = ({ header, onChange }) => {
  const handleChange = (field: keyof ExamHeaderInfo, value: string) => {
    onChange({
      ...header,
      [field]: value
    });
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <School className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          পরীক্ষার মূল তথ্যাবলী (Institution & Exam Header)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* School Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            প্রতিষ্ঠান / স্কুলের নাম
          </label>
          <div className="relative">
            <input
              type="text"
              value={header.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder="যেমন: মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
        </div>

        {/* Exam Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            পরীক্ষার নাম
          </label>
          <div className="relative">
            <input
              type="text"
              value={header.examTitle}
              onChange={(e) => handleChange('examTitle', e.target.value)}
              placeholder="যেমন: বার্ষিক পরীক্ষা — ২০২৬"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Class */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            শ্রেণি
          </label>
          <input
            type="text"
            value={header.className}
            onChange={(e) => handleChange('className', e.target.value)}
            placeholder="যেমন: দশম শ্রেণি"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            বিষয়
          </label>
          <div className="relative">
            <input
              type="text"
              value={header.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="যেমন: উচ্চতর গণিত"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Subject Code */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            বিষয় কোড
          </label>
          <input
            type="text"
            value={header.subjectCode || ''}
            onChange={(e) => handleChange('subjectCode', e.target.value)}
            placeholder="যেমন: ১২৬"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Time Allowed */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> সময়
          </label>
          <input
            type="text"
            value={header.timeAllowed}
            onChange={(e) => handleChange('timeAllowed', e.target.value)}
            placeholder="যেমন: ২ ঘণ্টা ৩০ মিনিট"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Full Marks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" /> পূর্ণমান
          </label>
          <input
            type="text"
            value={header.fullMarks}
            onChange={(e) => handleChange('fullMarks', e.target.value)}
            placeholder="যেমন: ৫০ বা ১০০"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* General Instructions */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-500" /> সাধারণ নির্দেশাবলী
          </label>
          <textarea
            rows={2}
            value={header.generalInstructions || ''}
            onChange={(e) => handleChange('generalInstructions', e.target.value)}
            placeholder="যেমন: বিশেষ দ্রষ্টব্য: ডানপাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক।"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
