'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '../../../types/quiz';
import { createAndPublishCommunityQuiz } from '../../../lib/community-quiz-store';
import { 
  X, 
  Sparkles, 
  Share2, 
  Save, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  User, 
  Flame,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SaveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  onSaved: () => void;
}

export const SaveQuizModal: React.FC<SaveQuizModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSaved
}) => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('সাধারণ বিষয়');
  const [authorName, setAuthorName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    createAndPublishCommunityQuiz(
      title,
      topic,
      authorName || 'লার্নার (User)',
      questions
    );

    setIsSuccess(true);
    confetti({ particleCount: 70, spread: 60 });
    setTimeout(() => {
      setIsSuccess(false);
      onSaved();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                কমিউনিটি ডাটাবেজে গেমটি সেভ ও পাবলিশ করুন
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                মোট {questions.length}টি প্রশ্ন কমিউনিটির সাথে শেয়ার হবে
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              🎉 সফলভাবে পাবলিশ হয়েছে!
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              আপনার গেমটি কমিউনিটি ডাটাবেজে যুক্ত হয়েছে। ১০ জন লাইক দিলে এটি চিরস্থায়ীভাবে ফিচার্ড হবে!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Rule Tip Box */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
              <div className="flex items-center gap-1.5 font-black">
                <Flame className="w-4 h-4 text-pink-500" />
                <span>কমিউনিটি রুলস:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                • গেমটি পাবলিশ করার পর অন্য শিক্ষার্থীরা এতে ভোট দিতে পারবে।<br />
                • <strong>১০ জন লাইক দিলে</strong> গেমটি সারাজীবনের জন্য পার্মানেন্ট ফিচার্ড হবে।<br />
                • <strong>৫ জন ডিসলাইক দিলে</strong> গেমটি স্বয়ংক্রিয়ভাবে ব্লক হয়ে যাবে।
              </p>
            </div>

            {/* Quiz Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                কুইজ গেমের নাম <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: এইচএসসি পদার্থবিজ্ঞান ২য় পত্র ফাইনাল প্রস্তুতি"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            {/* Topic / Subject */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                বিষয় বা টপিক:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="যেমন: পদার্থবিজ্ঞান / ICT / সাধারণ জ্ঞান"
                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Author Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                আপনার নাম (Creator / Author):
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="যেমন: এস এম আমিরুল ইসলাম"
                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-purple-500/25 flex items-center gap-2 cursor-pointer transition hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
                <span>সেভ ও পাবলিশ করুন</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
