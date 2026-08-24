import { FormulaItem, GpaSubject, GpaResult } from '../types/utilities';

export const FORMULA_COLLECTION: FormulaItem[] = [
  {
    id: 'f-1',
    subject: 'Higher Math',
    topic: 'দ্বিঘাত সমীকরণ',
    title: 'দ্বিঘাত সমীকরণের মূল নির্ণয় (Quadratic Formula)',
    formulaLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'যে কোনো দ্বিঘাত সমীকরণ ax^2 + bx + c = 0 এর মূলদ্বয় বের করতে ব্যবহৃত হয়।',
    variables: [
      { symbol: 'a', meaning: 'x^2 এর সহগ' },
      { symbol: 'b', meaning: 'x এর সহগ' },
      { symbol: 'c', meaning: 'ধ্রুবক পদ' },
      { symbol: 'b^2 - 4ac', meaning: 'নিশ্চায়ক (Discriminant)' }
    ]
  },
  {
    id: 'f-2',
    subject: 'Higher Math',
    topic: 'ত্রিকোণমিতি',
    title: 'ত্রিকোণমিতিক মৌলিক অভেদাবলী',
    formulaLatex: '\\sin^2\\theta + \\cos^2\\theta = 1, \\quad 1 + \\tan^2\\theta = \\sec^2\\theta, \\quad 1 + \\cot^2\\theta = \\csc^2\\theta',
    description: 'ত্রিকোণমিতির তিনটি মৌলিক বর্গ সংক্রান্ত সূত্র।',
    variables: [
      { symbol: '\\theta', meaning: 'কোণের মান (রেডিয়ান বা ডিগ্রি এককে)' }
    ]
  },
  {
    id: 'f-3',
    subject: 'Higher Math',
    topic: 'ক্যালকুলাস',
    title: 'অন্তরীকরণ মৌলিক সূত্র (Derivative Power Rule)',
    formulaLatex: '\\frac{d}{dx}(x^n) = n x^{n-1}, \\quad \\frac{d}{dx}(\\sin x) = \\cos x, \\quad \\frac{d}{dx}(e^x) = e^x',
    description: 'ফাংশনের পরিবর্তনের হার ও ঢাল বের করার সূত্র।',
    variables: [
      { symbol: 'n', meaning: 'ঘাত বা সূচক' }
    ]
  },
  {
    id: 'f-4',
    subject: 'Physics',
    topic: 'গতি ও বলবিদ্যা',
    title: 'গতির সমীকরণসমূহ (Equations of Motion)',
    formulaLatex: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 = u^2 + 2as',
    description: 'সুষম ত্বরণে চলমান কোনো বস্তুর গতিসংক্রান্ত সূত্র।',
    variables: [
      { symbol: 'u', meaning: 'আদিবেগ (m/s)' },
      { symbol: 'v', meaning: 'শেষবেগ (m/s)' },
      { symbol: 'a', meaning: 'ত্বরণ (m/s²)' },
      { symbol: 's', meaning: 'অতিক্রান্ত দূরত্ব (m)' },
      { symbol: 't', meaning: 'সময় (s)' }
    ]
  },
  {
    id: 'f-5',
    subject: 'Physics',
    topic: 'কাজ, ক্ষমতা ও শক্তি',
    title: 'গতিশক্তি ও বিভব শক্তি (Kinetic & Potential Energy)',
    formulaLatex: 'E_k = \\frac{1}{2}mv^2, \\quad E_p = mgh, \\quad P = \\frac{W}{t} = Fv',
    description: 'যান্ত্রিক শক্তির রূপভেদ ও ক্ষমতার হিসাব।',
    variables: [
      { symbol: 'm', meaning: 'ভর (kg)' },
      { symbol: 'g', meaning: 'অভিকর্ষজ ত্বরণ (9.8 m/s²)' },
      { symbol: 'h', meaning: 'উচ্চতা (m)' },
      { symbol: 'P', meaning: 'ক্ষমতা (Watt)' }
    ]
  },
  {
    id: 'f-6',
    subject: 'Chemistry',
    topic: 'মোল ও গ্যাসের সূত্র',
    title: 'আদর্শ গ্যাস সমীকরণ (Ideal Gas Law)',
    formulaLatex: 'PV = nRT = \\frac{w}{M}RT',
    description: 'চাপ, আয়তন ও তাপমাত্রার মধ্যে আন্তঃসম্পর্ক।',
    variables: [
      { symbol: 'P', meaning: 'চাপ (atm বা Pa)' },
      { symbol: 'V', meaning: 'আয়তন (L বা m³)' },
      { symbol: 'n', meaning: 'মোল সংখ্যা' },
      { symbol: 'R', meaning: 'সার্বজনীন গ্যাস ধ্রুবক (0.0821 L·atm/mol·K)' },
      { symbol: 'T', meaning: 'কেলভিন তাপমাত্রা (K)' }
    ]
  },
  {
    id: 'f-7',
    subject: 'ICT',
    topic: 'সংখ্যা পদ্ধতি ও ডিজিটাল লজিক',
    title: 'ডি-মরগানের উপপাদ্য (De Morgan\'s Laws)',
    formulaLatex: '\\overline{A + B} = \\overline{A} \\cdot \\overline{B}, \\quad \\overline{A \\cdot B} = \\overline{A} + \\overline{B}',
    description: 'বুলিয়ান বীজগণিতে লজিক গেট সরলীকরণের উপপাদ্য।',
    variables: [
      { symbol: 'A, B', meaning: 'বুলিয়ান চলক (0 বা 1)' }
    ]
  }
];

export function calculateSscHscGpa(subjects: GpaSubject[]): GpaResult {
  if (!subjects.length) {
    return { gpa: 0, totalGradePoints: 0, letterGrade: 'F', passed: false, remarks: 'কোনো বিষয় যোগ করা হয়নি' };
  }

  const mandatory = subjects.filter(s => !s.isOptional);
  const optional = subjects.find(s => s.isOptional);

  // Check if failed in any mandatory
  const hasFail = mandatory.some(s => s.gradePoint === 0);
  if (hasFail) {
    return {
      gpa: 0.00,
      totalGradePoints: 0,
      letterGrade: 'F',
      passed: false,
      remarks: 'বাধ্যতামূলক বিষয়ে অনুত্তীর্ণ (Failed)'
    };
  }

  let totalGP = mandatory.reduce((sum, s) => sum + s.gradePoint, 0);

  // 4th subject bonus (anything above 2.00 is added)
  if (optional && optional.gradePoint > 2.0) {
    const bonus = optional.gradePoint - 2.0;
    totalGP += bonus;
  }

  let gpa = totalGP / mandatory.length;
  if (gpa > 5.0) gpa = 5.0;
  gpa = Math.round(gpa * 100) / 100;

  let letterGrade = 'F';
  if (gpa === 5.0) letterGrade = 'A+';
  else if (gpa >= 4.0) letterGrade = 'A';
  else if (gpa >= 3.5) letterGrade = 'A-';
  else if (gpa >= 3.0) letterGrade = 'B';
  else if (gpa >= 2.0) letterGrade = 'C';
  else if (gpa >= 1.0) letterGrade = 'D';

  return {
    gpa,
    totalGradePoints: totalGP,
    letterGrade,
    passed: true,
    remarks: gpa === 5.0 ? 'দারুণ! গোল্ডেন A+ অর্জন করেছেন 🎉' : 'কৃতকার্য (Passed)'
  };
}

export function convertBase(value: string, fromBase: number, toBase: number): string {
  try {
    const decimal = parseInt(value, fromBase);
    if (isNaN(decimal)) return 'অকার্যকর ইনপুট';
    return decimal.toString(toBase).toUpperCase();
  } catch {
    return 'ত্রুটি';
  }
}
