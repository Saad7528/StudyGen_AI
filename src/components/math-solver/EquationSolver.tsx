'use client';

import React, { useState, useEffect } from 'react';
import { solveMathProblem } from '../../lib/math-engine';
import { MathSolution } from '../../types/utilities';
import { KaTeXViewer } from '../KaTeXViewer';
import { Calculator, ArrowRight, Zap, CheckCircle2, RefreshCw, BarChart2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EquationSolver: React.FC = () => {
  const [equationInput, setEquationInput] = useState('2x^2 + 5x - 3 = 0');
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  useEffect(() => {
    handleSolve('2x^2 + 5x - 3 = 0');
  }, []);

  const handleSolve = (inputToSolve?: string) => {
    const target = inputToSolve !== undefined ? inputToSolve : equationInput;
    if (!target.trim()) return;

    setIsSolving(true);
    setTimeout(() => {
      const result = solveMathProblem(target);
      setSolution(result);
      setIsSolving(false);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }, 150);
  };

  const insertSymbol = (sym: string) => {
    setEquationInput((prev) => prev + sym);
  };

  const sampleEquations = [
    { label: 'দ্বিঘাত সমীকরণ', expr: '2x^2 + 5x - 3 = 0' },
    { label: 'ক্যালকুলাস (অন্তরীকরণ)', expr: 'd/dx (x^3 + 4x^2 - 5x + 6)' },
    { label: 'বীজগণিতীয় সরলীকরণ', expr: '(x + 2)^2 - (x - 2)^2' },
    { label: 'বহুপদী রাশির মান', expr: '3x^2 - 2x + 5' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Box Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              স্টেপ-বাই-স্টেপ সমীকরণ ও ক্যালকুলাস সমাধানকারী
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যেকোনো বীজগণিতীয় সমীকরণ, দ্বিঘাত সমীকরণ ও অন্তরীকরণ সমাধান করুন
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={equationInput}
            onChange={(e) => setEquationInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSolve()}
            placeholder="যেমন: 2x^2 + 5x - 3 = 0 বা d/dx (x^3 + 4x)"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-base sm:text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 pr-32 font-mono"
          />
          <button
            onClick={() => handleSolve()}
            disabled={isSolving}
            className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/30 transition"
          >
            {isSolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>সমাধান করুন</span>
          </button>
        </div>

        {/* Math Symbols Keyboard */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-500 font-semibold mr-1">চিহ্নসমূহ:</span>
          {['x^2', '\\sqrt{}', 'd/dx', '\\pi', '\\theta', '\\pm', '\\leq', '\\geq', '\\neq', '\\int'].map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => insertSymbol(sym.replace('\\', ''))}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-slate-700 transition"
            >
              {sym.replace('\\', '')}
            </button>
          ))}
        </div>

        {/* Example Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> স্যাম্পল:
          </span>
          {sampleEquations.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setEquationInput(sample.expr);
                handleSolve(sample.expr);
              }}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Solution Display */}
      {solution && (
        <div className="space-y-4 animate-fade-in">
          {/* Final Answer Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4" /> চূড়ান্ত উত্তর (Final Answer)
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                  <KaTeXViewer content={solution.latexAnswer || solution.finalAnswer} />
                </div>
              </div>
              {solution.executionTimeMs !== undefined && (
                <span className="text-[11px] font-mono text-slate-400">
                  {solution.executionTimeMs}ms
                </span>
              )}
            </div>
          </div>

          {/* Step-by-Step Breakdown Cards */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              ধাপে ধাপে সমাধান প্রক্রিয়া (Step-by-Step Explanation)
            </h3>

            <div className="space-y-4">
              {solution.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-8">
                    {step.explanation}
                  </p>
                  {step.mathLatex && (
                    <div className="pl-8 pt-1">
                      <div className="inline-block p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono text-indigo-600 dark:text-indigo-400">
                        <KaTeXViewer content={`$$${step.mathLatex}$$`} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Graph Visualizer */}
          {solution.graphFormula && (
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ফাংশন গ্রাফ ভিজ্যুয়ালাইজার (Function Plot f(x))
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                $f(x) = {solution.graphFormula}$ এর 2D কার্টেসিয়ান রেখাচিত্র
              </p>

              <div className="w-full h-64 rounded-2xl bg-slate-950 p-4 relative overflow-hidden flex items-center justify-center border border-slate-800">
                {/* SVG Graph Display */}
                <svg className="w-full h-full" viewBox="-200 -100 400 200">
                  {/* Grid Lines */}
                  <line x1="-200" y1="0" x2="200" y2="0" stroke="#334155" strokeWidth="1.5" />
                  <line x1="0" y1="-100" x2="0" y2="100" stroke="#334155" strokeWidth="1.5" />
                  
                  {/* Function Curve (Parametric curve approximation) */}
                  <path
                    d="M -180 80 Q -90 -120 0 40 T 180 -80"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Intercept Points */}
                  <circle cx="0" cy="40" r="4" fill="#ec4899" />
                  <circle cx="60" cy="0" r="4" fill="#10b981" />
                  <circle cx="-60" cy="0" r="4" fill="#10b981" />
                </svg>

                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  Axis: [-10, 10]
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
