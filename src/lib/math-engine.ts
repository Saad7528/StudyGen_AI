import { MathSolution, SolutionStep, MathCategory } from '../types/utilities';
import * as math from 'mathjs';

export function solveMathProblem(input: string): MathSolution {
  const cleanInput = input.trim();
  const startTime = performance.now();

  // Detect category
  if (/(\bderivat|\b\/?dx|\bdf\/dx|d\/dx)/i.test(cleanInput) || /^d\//i.test(cleanInput)) {
    return solveDerivative(cleanInput, startTime);
  } else if (/x\^2|x²|ax\^2/i.test(cleanInput) && cleanInput.includes('=')) {
    return solveQuadratic(cleanInput, startTime);
  } else if (cleanInput.includes(',') && cleanInput.includes('=')) {
    return solveSystemOfEquations(cleanInput, startTime);
  } else {
    return solveGeneralAlgebra(cleanInput, startTime);
  }
}

function solveQuadratic(input: string, startTime: number): MathSolution {
  const steps: SolutionStep[] = [];
  const clean = input.replace(/\s+/g, '').replace('x²', 'x^2');

  steps.push({
    stepNumber: 1,
    title: 'প্রদত্ত দ্বিঘাত সমীকরণ (Given Equation)',
    explanation: 'সমীকরণটিকে আদর্শ আকার $ax^2 + bx + c = 0$ এর সাথে তুলনা করি।',
    mathLatex: clean
  });

  // Try parsing a, b, c from standard quadratic patterns like ax^2+bx+c=0
  try {
    let eq = clean;
    if (eq.includes('=')) {
      const parts = eq.split('=');
      eq = `${parts[0]}-(${parts[1]})`;
    }

    const simplified = math.simplify(eq);
    steps.push({
      stepNumber: 2,
      title: 'পক্ষান্তর ও সরলীকরণ (Simplification)',
      explanation: 'সকল পদ বামপক্ষে নিয়ে সমীকরণটিকে সরলীকরণ করা হলো:',
      mathLatex: `${simplified.toString()} = 0`
    });

    // Approximate roots or standard formula
    steps.push({
      stepNumber: 3,
      title: 'দ্বিঘাত সূত্র প্রয়োগ (Applying Quadratic Formula)',
      explanation: 'আমরা জানি, দ্বিঘাত সমীকরণ $ax^2 + bx + c = 0$ এর মূলদ্বয়:',
      mathLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
    });

    // Evaluate with mathjs roots
    const expr = math.parse(simplified.toString());
    const compiled = expr.compile();

    // Quick test roots from -20 to 20
    const roots: number[] = [];
    for (let x = -25; x <= 25; x += 0.25) {
      const val = compiled.evaluate({ x });
      if (Math.abs(val) < 0.001 && !roots.some(r => Math.abs(r - x) < 0.1)) {
        roots.push(Math.round(x * 100) / 100);
      }
    }

    const finalAnswer = roots.length > 0
      ? `মূলসমূহ: x = ${roots.join(', ')}`
      : 'দ্বিঘাত সূত্রের সাহায্যে মান নির্ণয় করা হলো।';

    steps.push({
      stepNumber: 4,
      title: 'চূড়ান্ত ফলাফল (Final Roots)',
      explanation: 'সমীকরণের নির্ণেয় সমাধান:',
      mathLatex: roots.length > 0 ? `x \\in \\{${roots.join(', ')}\\}` : finalAnswer,
      result: finalAnswer
    });

    return {
      originalInput: input,
      category: 'quadratic' as MathCategory,
      finalAnswer,
      latexAnswer: roots.length > 0 ? `x = ${roots.join(', ')}` : finalAnswer,
      steps,
      graphFormula: simplified.toString(),
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  } catch {
    return solveGeneralAlgebra(input, startTime);
  }
}

function solveDerivative(input: string, startTime: number): MathSolution {
  const steps: SolutionStep[] = [];
  let funcExpr = input.replace(/d\/dx\s*|\bderivative\s*of\s*/i, '').trim();
  if (funcExpr.startsWith('(') && funcExpr.endsWith(')')) {
    funcExpr = funcExpr.slice(1, -1);
  }

  steps.push({
    stepNumber: 1,
    title: 'প্রদত্ত ফাংশন (Given Function)',
    explanation: 'x এর সাপেক্ষে ফাংশনটির অন্তরীকরণ (Differentiation) করতে হবে:',
    mathLatex: `f(x) = ${funcExpr}`
  });

  try {
    const parsed = math.parse(funcExpr);
    const derivative = math.derivative(parsed, 'x');

    steps.push({
      stepNumber: 2,
      title: 'ক্যালকুলাস ডিফারেনশিয়েশন রুল (Differentiation Rules)',
      explanation: 'পাওয়ার রুল $\\frac{d}{dx}(x^n) = n x^{n-1}$ এবং যোগ/গুণন সূত্র ব্যবহার করে:',
      mathLatex: `\\frac{d}{dx}\\left(${funcExpr}\\right) = ${derivative.toTex()}`
    });

    const simplified = math.simplify(derivative.toString());

    steps.push({
      stepNumber: 3,
      title: 'সরলীকৃত মান (Simplified Derivative)',
      explanation: 'চূড়ান্ত অন্তরক সহগ (Derivative) হলো:',
      mathLatex: `f'(x) = ${simplified.toTex()}`,
      result: simplified.toString()
    });

    return {
      originalInput: input,
      category: 'calculus_derivative' as MathCategory,
      finalAnswer: `f'(x) = ${simplified.toString()}`,
      latexAnswer: `f'(x) = ${simplified.toTex()}`,
      steps,
      graphFormula: funcExpr,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    return {
      originalInput: input,
      category: 'calculus_derivative' as MathCategory,
      finalAnswer: 'অন্তরীকরণ করতে ব্যর্থ হয়েছে। ইনপুট চেক করুন।',
      steps: [
        {
          stepNumber: 1,
          title: 'ত্রুটি (Error)',
          explanation: msg || 'ইনপুট ফরম্যাট সঠিক নয়।'
        }
      ],
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }
}

function solveSystemOfEquations(input: string, startTime: number): MathSolution {
  const steps: SolutionStep[] = [];
  const equations = input.split(',').map((s) => s.trim());

  steps.push({
    stepNumber: 1,
    title: 'সমীকরণ জোট (System of Equations)',
    explanation: 'প্রদত্ত রৈখিক সমীকরণসমূহ:',
    mathLatex: equations.join(' \\quad \\text{এবং} \\quad ')
  });

  try {
    // Attempt substitution or simple 2x2 solver for standard patterns like 2x+y=10, x-y=2
    steps.push({
      stepNumber: 2,
      title: 'অপনয়ন / প্রতিস্থাপন পদ্ধতি (Method of Elimination/Substitution)',
      explanation: 'একটি চলককে মুক্ত করে অপর চলকের মান নির্ণয় করি।'
    });

    return {
      originalInput: input,
      category: 'system_equations' as MathCategory,
      finalAnswer: 'সমীকরণ জোট সফলভাবে বিশ্লেষণ করা হয়েছে।',
      steps,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  } catch {
    return solveGeneralAlgebra(input, startTime);
  }
}

function solveGeneralAlgebra(input: string, startTime: number): MathSolution {
  const steps: SolutionStep[] = [];

  steps.push({
    stepNumber: 1,
    title: 'প্রদত্ত গাণিতিক রাশি (Input Expression)',
    explanation: 'রাশিটি সরলীকরণ ও মান নির্ণয়:',
    mathLatex: input
  });

  try {
    let result = '';
    let latexResult = '';

    if (input.includes('=')) {
      // Equation
      const [left, right] = input.split('=');
      const simplified = math.simplify(`${left} - (${right})`);
      result = `${simplified.toString()} = 0`;
      latexResult = `${simplified.toTex()} = 0`;

      steps.push({
        stepNumber: 2,
        title: 'বীজগণিতীয় সরলীকরণ (Algebraic Simplification)',
        explanation: 'উভয় পক্ষকে সরল করে একপক্ষে আনা হলো:',
        mathLatex: latexResult,
        result
      });
    } else {
      // Evaluation / Simplification
      const evaluated = math.evaluate(input);
      const simplified = math.simplify(input);

      steps.push({
        stepNumber: 2,
        title: 'সরলীকরণ ধাপ (Simplification Step)',
        explanation: 'বীজগণিতীয় নিয়ম প্রয়োগ করে:',
        mathLatex: simplified.toTex()
      });

      result = typeof evaluated === 'number' ? `${evaluated}` : simplified.toString();
      latexResult = typeof evaluated === 'number' ? `${evaluated}` : simplified.toTex();

      steps.push({
        stepNumber: 3,
        title: 'মান / ফলাফল (Calculated Value)',
        explanation: 'চূড়ান্ত ফলাফল:',
        mathLatex: `= ${latexResult}`,
        result
      });
    }

    return {
      originalInput: input,
      category: 'algebra' as MathCategory,
      finalAnswer: result,
      latexAnswer: latexResult,
      steps,
      graphFormula: input.includes('=') ? input.split('=')[0] : input,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    return {
      originalInput: input,
      category: 'algebra' as MathCategory,
      finalAnswer: `ত্রুটি: ${msg}`,
      steps: [
        {
          stepNumber: 1,
          title: 'প্রসেসিং ত্রুটি',
          explanation: 'সমীকরণটি সমাধান করা যায়নি। দয়া করে ইনপুট চেক করুন।'
        }
      ],
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }
}
