'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, Trash2, Zap, AlertCircle } from 'lucide-react';
import { QuestionPaperData } from '../../types/question-paper';
import { SAMPLE_EXAM_PAPERS } from '../../lib/sample-data';
import { analyzeQuestionImages } from '../../lib/gemini-api';
import confetti from 'canvas-confetti';

interface PhotoUploaderProps {
  onPaperGenerated: (data: QuestionPaperData) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPaperGenerated,
  isProcessing,
  setIsProcessing
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) আপলোড করুন।');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_EXAM_PAPERS.find((s) => s.id === sampleId);
    if (sample) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      onPaperGenerated(sample.data);
    }
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      setErrorMessage('অনুগ্রহ করে প্রথমে অন্তত একটি খাতার ছবি আপলোড করুন অথবা নিচের স্যাম্পল ব্যবহার করুন।');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const result = await analyzeQuestionImages(images);

    setIsProcessing(false);

    if (result.success && result.data) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      onPaperGenerated(result.data);
    } else {
      setErrorMessage(result.error || 'ছবি থেকে প্রশ্ন এক্সট্রাক্ট করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all duration-300 ${
          dragOver
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700/80 bg-white/40 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-500/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[22px] flex items-center justify-center">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 animate-bounce" />
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              খাতার হাতে লেখা বা বইয়ের প্রশ্নের ছবি এখানে আপলোড করুন
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              ড্র্যাগ অ্যান্ড ড্রপ করুন অথবা ডিভাইস থেকে সিলেক্ট করুন (একাধিক পাতা একসাথে দেওয়া যাবে)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <ImageIcon className="w-4 h-4" />
              ছবি ফাইল নির্বাচন করুন
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition"
            >
              <Camera className="w-4 h-4 text-pink-500" />
              ক্যামেরা দিয়ে তুলুন
            </button>
          </div>
        </div>
      </div>

      {/* Uploaded Images Thumbnails */}
      {images.length > 0 && (
        <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              নির্বাচিত ছবি ({images.length}টি পাতা)
            </span>
            <button
              onClick={() => setImages([])}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> সবগুলো মুছুন
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[3/4] bg-slate-100 dark:bg-slate-950">
                <img src={img} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeImage(idx)}
                    className="p-1.5 rounded-full bg-rose-600 text-white hover:scale-110 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white">
                  পাতা {idx + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Process Button */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 animate-spin" />
              {isProcessing ? 'এআই ছবি বিশ্লেষণ করছে...' : 'প্রশ্নপত্র তৈরি শুরু করুন (AI Generate)'}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">মনোযোগ দিন:</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Quick Test Samples */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            তাৎক্ষণিক টেস্ট করুন (বিল্ট-ইন রেডিমেড পরীক্ষার নমুনা)
          </h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          ছবি না থাকলেও নিচের যে কোনো একটি স্যাম্পলে ক্লিক করে এখনই সম্পূর্ণ সিস্টেম ও গুগল ডক এক্সপোর্ট টেস্ট করুন:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_EXAM_PAPERS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample.id)}
              className="p-3.5 text-left rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {sample.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                  লোড করুন ↗
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {sample.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
