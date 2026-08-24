'use client';

import React, { useState } from 'react';
import { FORMULA_COLLECTION } from '../../lib/utility-helpers';
import { KaTeXViewer } from '../KaTeXViewer';
import { BookOpen, Search, Copy, Check, Filter } from 'lucide-react';

export const FormulaLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const subjects = ['All', 'Higher Math', 'Physics', 'Chemistry', 'ICT'];

  const filteredFormulas = FORMULA_COLLECTION.filter((item) => {
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleCopyLatex = (latex: string, id: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Filter Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ম্যাথ, ফিজিক্স ও সায়েন্স ফর্মুলা লাইব্রেরি
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                পরীক্ষার জন্য প্রয়োজনীয় সকল গুরুত্বপূর্ণ সূত্র ও চিটশিট
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="সূত্র বা বিষয় খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> বিষয়:
          </span>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sub === 'All' ? 'সকল বিষয়' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg flex flex-col justify-between space-y-4 group hover:border-indigo-500/50 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {item.subject} • {item.topic}
                </span>
                <button
                  onClick={() => handleCopyLatex(item.formulaLatex, item.id)}
                  className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 font-medium"
                  title="LaTeX কপি করুন"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'কপি হয়েছে' : 'LaTeX'}</span>
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>

              {/* KaTeX Math Box */}
              <div className="my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-center overflow-x-auto">
                <KaTeXViewer content={`$$${item.formulaLatex}$$`} />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>

            {item.variables.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">চলকসমূহ:</span>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {item.variables.map((v, i) => (
                    <span key={i}>
                      <strong>{v.symbol}</strong> = {v.meaning}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
