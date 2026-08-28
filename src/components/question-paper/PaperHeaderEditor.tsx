'use client';

import React, { useRef } from 'react';
import { ExamHeaderInfo } from '../../types/question-paper';
import { School, Clock, Award, FileText, Image as ImageIcon, Trash2, CheckCircle2, ShieldCheck, PenTool, Palette } from 'lucide-react';

interface PaperHeaderEditorProps {
  header: ExamHeaderInfo;
  onChange: (header: ExamHeaderInfo) => void;
}

export const PaperHeaderEditor: React.FC<PaperHeaderEditorProps> = ({ header, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof ExamHeaderInfo, value: any) => {
    onChange({
      ...header,
      [field]: value
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('লোগোর সাইজ সর্বোচ্চ ২MB হতে পারবে');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleChange('logoUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            পরীক্ষার মূল তথ্যাবলী ও কাস্টম ব্র্যান্ডিং (Header & Branding)
          </h3>
        </div>

        {/* Theme Style selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">স্টাইল:</span>
          {(['standard', 'boxed', 'classic', 'cadet'] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => handleChange('themeStyle', style)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                (header.themeStyle || 'standard') === style
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              {style === 'standard' ? 'স্ট্যান্ডার্ড' : style === 'boxed' ? 'বক্সড' : style === 'classic' ? 'ক্লাসিক' : 'ক্যাডেট'}
            </button>
          ))}
        </div>
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

        {/* Logo Upload & Watermark Row */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
          <label className="block text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            স্কুল / প্রতিষ্ঠানের লোগো
          </label>

          <div className="flex items-center gap-3">
            {header.logoUrl ? (
              <div className="relative w-14 h-14 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={header.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => handleChange('logoUrl', undefined)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white shadow hover:bg-rose-600 transition"
                  title="লোগো মুছুন"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition shrink-0"
              >
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-300 mt-0.5">লোগো দিন</span>
              </div>
            )}

            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
              >
                {header.logoUrl ? 'লোগো পরিবর্তন করুন' : 'লোগো আপলোড করুন'}
              </button>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                PNG, JPG বা SVG (সর্বোচ্চ ২MB)
              </p>
            </div>
          </div>
        </div>

        {/* Watermark & Signatures */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
          <label className="block text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            ওয়াটারমার্ক ও অফিশিয়াল সিল
          </label>

          <input
            type="text"
            value={header.watermarkText || ''}
            onChange={(e) => handleChange('watermarkText', e.target.value)}
            placeholder="যেমন: মতিঝিল আইডিয়াল স্কুল"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />

          <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={header.showSignatures ?? true}
              onChange={(e) => handleChange('showSignatures', e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <PenTool className="w-3 h-3 text-slate-400" /> ইনভিজিলেটর ও প্রধান শিক্ষক স্বাক্ষর বক্স রাখুন
            </span>
          </label>
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

