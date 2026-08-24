'use client';

import React from 'react';
import { QuestionSection, QuestionItem, QuestionType } from '../../types/question-paper';
import { Plus, Trash2, Copy, MoveUp, MoveDown, Layers, HelpCircle, CheckSquare, AlignLeft } from 'lucide-react';
import { KaTeXViewer } from '../KaTeXViewer';

interface QuestionEditorProps {
  sections: QuestionSection[];
  onChange: (sections: QuestionSection[]) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ sections, onChange }) => {
  const handleAddSection = () => {
    const newSec: QuestionSection = {
      id: `sec-${Date.now()}`,
      title: `বিভাগ ${String.fromCharCode(0x0995 + sections.length)}`,
      instruction: 'যেকোনো ৪টি প্রশ্নের উত্তর দাও',
      totalMarks: '৪ × ১০ = ৪০',
      questions: []
    };
    onChange([...sections, newSec]);
  };

  const handleUpdateSection = (secIdx: number, updated: Partial<QuestionSection>) => {
    const newSections = [...sections];
    newSections[secIdx] = { ...newSections[secIdx], ...updated };
    onChange(newSections);
  };

  const handleDeleteSection = (secIdx: number) => {
    if (sections.length <= 1) return;
    onChange(sections.filter((_, i) => i !== secIdx));
  };

  const handleAddQuestion = (secIdx: number, type: QuestionType) => {
    const sec = sections[secIdx];
    const qCount = sec.questions.length + 1;
    const bengaliNumbers = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০', '১১', '১২'];
    const qNum = bengaliNumbers[qCount - 1] || `${qCount}`;

    let newQ: QuestionItem;

    if (type === 'cq') {
      newQ = {
        id: `q-${Date.now()}`,
        type: 'cq',
        number: qNum,
        stem: 'উদ্দীপক এখানে লিখুন...',
        text: '',
        marks: 10,
        subQuestions: [
          { id: 'a', label: 'ক', text: 'জ্ঞানমূলক প্রশ্ন লিখুন', marks: 1 },
          { id: 'b', label: 'খ', text: 'অনুধাবনমূলক প্রশ্ন লিখুন', marks: 2 },
          { id: 'c', label: 'গ', text: 'প্রয়োগমূলক প্রশ্ন লিখুন', marks: 3 },
          { id: 'd', label: 'ঘ', text: 'উচ্চতর দক্ষতামূলক প্রশ্ন লিখুন', marks: 4 }
        ]
      };
    } else if (type === 'mcq') {
      newQ = {
        id: `q-${Date.now()}`,
        type: 'mcq',
        number: qNum,
        text: 'বহুনির্বাচনী প্রশ্ন বাক্য এখানে লিখুন...',
        marks: 1,
        options: [
          { id: 'opt-1', label: 'ক', text: 'বিকল্প ১' },
          { id: 'opt-2', label: 'খ', text: 'বিকল্প ২' },
          { id: 'opt-3', label: 'গ', text: 'বিকল্প ৩' },
          { id: 'opt-4', label: 'ঘ', text: 'বিকল্প ৪' }
        ],
        correctAnswer: 'ক'
      };
    } else {
      newQ = {
        id: `q-${Date.now()}`,
        type: 'short',
        number: qNum,
        text: 'সংক্ষিপ্ত বা সাধারণ বর্ণনামূলক প্রশ্ন লিখুন...',
        marks: 5
      };
    }

    const newSections = [...sections];
    newSections[secIdx].questions.push(newQ);
    onChange(newSections);
  };

  const handleUpdateQuestion = (secIdx: number, qIdx: number, updated: Partial<QuestionItem>) => {
    const newSections = [...sections];
    newSections[secIdx].questions[qIdx] = { ...newSections[secIdx].questions[qIdx], ...updated };
    onChange(newSections);
  };

  const handleDeleteQuestion = (secIdx: number, qIdx: number) => {
    const newSections = [...sections];
    newSections[secIdx].questions = newSections[secIdx].questions.filter((_, i) => i !== qIdx);
    onChange(newSections);
  };

  const handleDuplicateQuestion = (secIdx: number, qIdx: number) => {
    const newSections = [...sections];
    const source = newSections[secIdx].questions[qIdx];
    const cloned: QuestionItem = {
      ...JSON.parse(JSON.stringify(source)),
      id: `q-${Date.now()}`
    };
    newSections[secIdx].questions.splice(qIdx + 1, 0, cloned);
    onChange(newSections);
  };

  const handleMoveQuestion = (secIdx: number, qIdx: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIdx = direction === 'up' ? qIdx - 1 : qIdx + 1;
    if (targetIdx < 0 || targetIdx >= newSections[secIdx].questions.length) return;
    const temp = newSections[secIdx].questions[qIdx];
    newSections[secIdx].questions[qIdx] = newSections[secIdx].questions[targetIdx];
    newSections[secIdx].questions[targetIdx] = temp;
    onChange(newSections);
  };

  return (
    <div className="space-y-6">
      {sections.map((sec, secIdx) => (
        <div
          key={sec.id || secIdx}
          className="p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-5"
        >
          {/* Section Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <Layers className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={sec.title}
                onChange={(e) => handleUpdateSection(secIdx, { title: e.target.value })}
                placeholder="বিভাগের নাম (যেমন: ক-বিভাগ: সৃজনশীল প্রশ্ন)"
                className="w-full sm:w-80 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <input
                type="text"
                value={sec.instruction || ''}
                onChange={(e) => handleUpdateSection(secIdx, { instruction: e.target.value })}
                placeholder="নির্দেশনা (যেমন: যেকোনো ৫টি প্রশ্নের উত্তর দাও)"
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 w-44"
              />
              <input
                type="text"
                value={sec.totalMarks || ''}
                onChange={(e) => handleUpdateSection(secIdx, { totalMarks: e.target.value })}
                placeholder="মান (যেমন: ৫ x ১০ = ৫০)"
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 w-28 text-right"
              />
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteSection(secIdx)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition"
                  title="বিভাগ মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Question List inside Section */}
          <div className="space-y-4">
            {sec.questions.map((q, qIdx) => (
              <div
                key={q.id || qIdx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-3 group"
              >
                {/* Question Header Line */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                      {q.number}
                    </span>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {q.type === 'cq' ? 'সৃজনশীল (CQ)' : q.type === 'mcq' ? 'বহুনির্বাচনী (MCQ)' : 'বর্ণনামূলক'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveQuestion(secIdx, qIdx, 'up')}
                      disabled={qIdx === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white disabled:opacity-30"
                      title="উপরে নিন"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveQuestion(secIdx, qIdx, 'down')}
                      disabled={qIdx === sec.questions.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white disabled:opacity-30"
                      title="নিচে নিন"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(secIdx, qIdx)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="ডুপ্লিকেট করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(secIdx, qIdx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500"
                      title="প্রশ্ন মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Creative Question (CQ) UI */}
                {q.type === 'cq' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        উদ্দীপক (Stem / Scenario)
                      </label>
                      <textarea
                        rows={2}
                        value={q.stem || ''}
                        onChange={(e) => handleUpdateQuestion(secIdx, qIdx, { stem: e.target.value })}
                        placeholder="উদ্দীপক লিখুন..."
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      />
                      {q.stem?.includes('$') && (
                        <div className="mt-1 p-2 rounded-lg bg-indigo-500/5 text-xs text-indigo-600 dark:text-indigo-300">
                          <span className="font-semibold">ম্যাথ প্রিভিউ:</span>{' '}
                          <KaTeXViewer content={q.stem} />
                        </div>
                      )}
                    </div>

                    {/* Sub Questions (ক, খ, গ, ঘ) */}
                    <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-indigo-500/30">
                      {q.subQuestions?.map((sub, sIdx) => (
                        <div key={sub.id || sIdx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-500 w-5">({sub.label})</span>
                          <input
                            type="text"
                            value={sub.text}
                            onChange={(e) => {
                              const newSubs = [...(q.subQuestions || [])];
                              newSubs[sIdx].text = e.target.value;
                              handleUpdateQuestion(secIdx, qIdx, { subQuestions: newSubs });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                          <div className="flex items-center gap-1 w-16">
                            <span className="text-[10px] text-slate-400">মান:</span>
                            <input
                              type="number"
                              value={sub.marks || 0}
                              onChange={(e) => {
                                const newSubs = [...(q.subQuestions || [])];
                                newSubs[sIdx].marks = parseInt(e.target.value) || 0;
                                handleUpdateQuestion(secIdx, qIdx, { subQuestions: newSubs });
                              }}
                              className="w-10 px-1.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-center text-slate-900 dark:text-white font-bold"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multiple Choice Question (MCQ) UI */}
                {q.type === 'mcq' && (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => handleUpdateQuestion(secIdx, qIdx, { text: e.target.value })}
                        placeholder="প্রশ্ন বাক্য লিখুন..."
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                      {q.text?.includes('$') && (
                        <div className="mt-1 p-2 rounded-lg bg-indigo-500/5 text-xs text-indigo-600 dark:text-indigo-300">
                          <span className="font-semibold">ম্যাথ প্রিভিউ:</span>{' '}
                          <KaTeXViewer content={q.text} />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt, optIdx) => (
                        <div key={opt.id || optIdx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 w-5">({opt.label})</span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const newOpts = [...(q.options || [])];
                              newOpts[optIdx].text = e.target.value;
                              handleUpdateQuestion(secIdx, qIdx, { options: newOpts });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short / Broad Question UI */}
                {q.type !== 'cq' && q.type !== 'mcq' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => handleUpdateQuestion(secIdx, qIdx, { text: e.target.value })}
                      placeholder="প্রশ্ন বাক্য লিখুন..."
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">মান:</span>
                      <input
                        type="number"
                        value={q.marks || 0}
                        onChange={(e) => handleUpdateQuestion(secIdx, qIdx, { marks: parseInt(e.target.value) || 0 })}
                        className="w-14 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-center font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Question Button Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              নতুন প্রশ্ন যোগ করুন:
            </span>
            <button
              type="button"
              onClick={() => handleAddQuestion(secIdx, 'cq')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-bold border border-indigo-500/20 flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" /> + সৃজনশীল (CQ)
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion(secIdx, 'mcq')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-bold border border-purple-500/20 flex items-center gap-1.5 transition"
            >
              <CheckSquare className="w-3.5 h-3.5" /> + বহুনির্বাচনী (MCQ)
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion(secIdx, 'short')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
            >
              <AlignLeft className="w-3.5 h-3.5" /> + সংক্ষিপ্ত প্রশ্ন
            </button>
          </div>
        </div>
      ))}

      {/* Add New Section Button */}
      <button
        type="button"
        onClick={handleAddSection}
        className="w-full py-4 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition group"
      >
        <Plus className="w-5 h-5 text-indigo-500 group-hover:scale-125 transition-transform" />
        নতুন পরীক্ষা বিভাগ যোগ করুন (Add Section)
      </button>
    </div>
  );
};
