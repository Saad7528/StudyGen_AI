'use client';

import React, { useState } from 'react';
import { Binary, Copy, Check, ArrowRightLeft } from 'lucide-react';

export const BaseConverter: React.FC = () => {
  const [decimalVal, setDecimalVal] = useState('255');
  const [binaryVal, setBinaryVal] = useState('11111111');
  const [octalVal, setOctalVal] = useState('377');
  const [hexVal, setHexVal] = useState('FF');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const updateFromDecimal = (val: string) => {
    setDecimalVal(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setBinaryVal(num.toString(2));
      setOctalVal(num.toString(8));
      setHexVal(num.toString(16).toUpperCase());
    }
  };

  const updateFromBinary = (val: string) => {
    setBinaryVal(val);
    const num = parseInt(val, 2);
    if (!isNaN(num)) {
      setDecimalVal(num.toString(10));
      setOctalVal(num.toString(8));
      setHexVal(num.toString(16).toUpperCase());
    }
  };

  const updateFromOctal = (val: string) => {
    setOctalVal(val);
    const num = parseInt(val, 8);
    if (!isNaN(num)) {
      setDecimalVal(num.toString(10));
      setBinaryVal(num.toString(2));
      setHexVal(num.toString(16).toUpperCase());
    }
  };

  const updateFromHex = (val: string) => {
    setHexVal(val);
    const num = parseInt(val, 16);
    if (!isNaN(num)) {
      setDecimalVal(num.toString(10));
      setBinaryVal(num.toString(2));
      setOctalVal(num.toString(8));
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fields = [
    { key: 'dec', label: 'দশমিক (Decimal - Base 10)', val: decimalVal, onChange: updateFromDecimal, hint: '0, 1, 2, ..., 9' },
    { key: 'bin', label: 'বাইনারি (Binary - Base 2)', val: binaryVal, onChange: updateFromBinary, hint: '0 এবং 1' },
    { key: 'oct', label: 'অক্টাল (Octal - Base 8)', val: octalVal, onChange: updateFromOctal, hint: '0 থেকে 7' },
    { key: 'hex', label: 'হেক্সাডেসিমেল (Hexadecimal - Base 16)', val: hexVal, onChange: updateFromHex, hint: '0-9 এবং A-F' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              সংখ্যা পদ্ধতি ও বেস কনভার্টার (Number Base Converter)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যেকোনো ঘরে লিখলেই সাথে সাথে অন্য সকল বেসে রূপান্তর হবে
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div
              key={f.key}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {f.label}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">{f.hint}</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={f.val}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(f.val, f.key)}
                  className="absolute right-2 top-2.5 p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  title="কপি করুন"
                >
                  {copiedKey === f.key ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>এইচএসসি আইসিটি (ICT) এবং কম্পিউটার সায়েন্সের নাম্বার সিস্টেম কনভার্শনের জন্য আদর্শ টুল।</span>
        </div>
      </div>
    </div>
  );
};
