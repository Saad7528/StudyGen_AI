'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Copy, Check, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuickOcr: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!image) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/quick-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'টেক্সট এক্সট্রাক্ট করা যায়নি।');
      }

      const text = resJson.text || 'কোনো লেখা পাওয়া যায়নি।';
      setExtractedText(text);
      confetti({ particleCount: 50, spread: 70 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'টেক্সট এক্সট্রাক্ট করতে সমস্যা হয়েছে।';
      setExtractedText(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              কুইক ওসিআর টেক্সট এক্সট্রাক্টর (Quick OCR)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যেকোনো ডকুমেন্ট বা বইয়ের পাতার ছবি থেকে সরাসরি টেক্সট কপি করুন
            </p>
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 transition min-h-[260px] bg-slate-50 dark:bg-slate-950/60"
          >
            {image ? (
              <img src={image} alt="Uploaded" className="max-h-56 object-contain rounded-xl" />
            ) : (
              <div className="space-y-3">
                <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto animate-bounce" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  ছবি আপলোড করতে ক্লিক করুন
                </p>
                <span className="text-[11px] text-slate-400">JPG, PNG, WEBP</span>
              </div>
            )}
          </div>

          {/* Extracted Text Area */}
          <div className="flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                এক্সট্রাক্ট করা টেক্সট
              </span>
              {extractedText && (
                <button
                  onClick={copyText}
                  className="text-xs text-indigo-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'কপি হয়েছে' : 'টেক্সট কপি'}
                </button>
              )}
            </div>

            <textarea
              rows={8}
              readOnly
              value={extractedText}
              placeholder="ছবি বিশ্লেষণ করলে এখানে লেখা ফুটে উঠবে..."
              className="w-full flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none resize-none"
            />

            <button
              onClick={handleExtract}
              disabled={!image || isProcessing}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isProcessing ? 'এক্সট্রাক্ট হচ্ছে...' : 'টেক্সট বের করুন (Extract Text)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
