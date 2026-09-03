'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Clock, 
  FileText, 
  Sparkles, 
  GitCompare, 
  Layers, 
  ExternalLink,
  BookOpen,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

export interface DraftItem {
  id: string;
  toolId: string;
  toolName: string;
  title: string;
  previewSnippet: string;
  timestamp: number;
  data: any;
}

interface RecentDraftsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreDraft: (draft: DraftItem) => void;
}

export const STORAGE_KEY_DRAFTS = 'studygen_user_drafts';

export const saveDraftToStorage = (toolId: string, toolName: string, title: string, previewSnippet: string, data: any) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRAFTS);
    const list: DraftItem[] = raw ? JSON.parse(raw) : [];
    
    // Filter out existing with same toolId and identical title if any to update
    const filtered = list.filter(item => !(item.toolId === toolId && item.title === title));
    
    const newItem: DraftItem = {
      id: `${toolId}_${Date.now()}`,
      toolId,
      toolName,
      title: title || 'আনটাইটেল্ড ড্রাফট',
      previewSnippet: previewSnippet.slice(0, 150),
      timestamp: Date.now(),
      data
    };

    // Keep up to 20 recent drafts
    const updated = [newItem, ...filtered].slice(0, 20);
    localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save draft:', err);
  }
};

export const RecentDraftsDrawer: React.FC<RecentDraftsDrawerProps> = ({
  isOpen,
  onClose,
  onRestoreDraft
}) => {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadDrafts = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DRAFTS);
      if (raw) {
        setDrafts(JSON.parse(raw));
      } else {
        setDrafts([]);
      }
    } catch {
      setDrafts([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = drafts.filter(d => d.id !== id);
      setDrafts(updated);
      localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('আপনি কি সব সেভ করা হিস্ট্রি মুছে ফেলতে চান?')) {
      localStorage.removeItem(STORAGE_KEY_DRAFTS);
      setDrafts([]);
    }
  };

  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'question-paper': return FileText;
      case 'omr-generator': return Layers;
      case 'study-summary': return Sparkles;
      case 'text-diff': return GitCompare;
      default: return BookOpen;
    }
  };

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'এইমাত্র';
    if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ঘণ্টা আগে`;
    return new Date(ts).toLocaleDateString('bn-BD', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm transition-all duration-300">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">রিসেন্ট ড্রাফট ও হিস্ট্রি</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">আপনার ব্রাউজারে স্বয়ংক্রিয়ভাবে সংরক্ষিত কাজ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {drafts.length === 0 ? (
            <div className="py-20 text-center space-y-3 px-4">
              <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">কোনো পূর্ববর্তী ড্রাফট পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                আপনি যখনই প্রশ্নপত্র তৈরি করবেন, টেক্সট ডিফারেন্স চেক করবেন বা স্টাডি নোট তৈরি করবেন, তা স্বয়ংক্রিয়ভাবে এখানে সেভ হয়ে থাকবে।
              </p>
            </div>
          ) : (
            drafts.map(draft => {
              const Icon = getToolIcon(draft.toolId);
              return (
                <div
                  key={draft.id}
                  onClick={() => {
                    onRestoreDraft(draft);
                    onClose();
                  }}
                  className="group relative p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition cursor-pointer shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                        {draft.toolName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(draft.timestamp)}
                      </span>
                      <button
                        onClick={(e) => handleDelete(draft.id, e)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition opacity-0 group-hover:opacity-100"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white truncate">
                    {draft.title}
                  </h4>

                  {draft.previewSnippet && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {draft.previewSnippet}
                    </p>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      রিস্টোর ও ওপেন করুন
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {drafts.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              মোট সেভ করা ড্রাফট: {drafts.length}
            </span>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              সব মুছে ফেলুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
