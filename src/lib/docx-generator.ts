import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  convertInchesToTwip,
  Header,
  Footer,
  PageNumber
} from 'docx';
import { saveAs } from 'file-saver';
import { QuestionPaperData, QuestionItem } from '../types/question-paper';

/**
 * Converts LaTeX formulas and raw math syntax into authentic Unicode symbols
 * so Google Docs and Microsoft Word display clean, readable math without scrambled code.
 */
export function formatMathAndTextForDocx(text?: string | number | null): string {
  if (text === null || text === undefined) return '';
  let clean = String(text);


  // 1. Replace fractions \frac{a}{b} -> (a/b)
  clean = clean.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1/$2)');
  clean = clean.replace(/\\dfrac\{([^{}]+)\}\{([^{}]+)\}/g, '($1/$2)');

  // 2. Replace square roots \sqrt{x} -> √(x), \sqrt[n]{x} -> ⁿ√(x)
  clean = clean.replace(/\\sqrt\[([^{}]+)\]\{([^{}]+)\}/g, '$1√($2)');
  clean = clean.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');

  // 3. LaTeX symbols map to authentic Unicode characters
  const latexSymbolMap: [RegExp, string][] = [
    [/\\times\b/g, '×'],
    [/\\cdot\b/g, '·'],
    [/\\div\b/g, '÷'],
    [/\\pm\b/g, '±'],
    [/\\mp\b/g, '∓'],
    [/\\approx\b/g, '≈'],
    [/\\neq\b|\\ne\b/g, '≠'],
    [/\\leq\b|\\le\b/g, '≤'],
    [/\\geq\b|\\ge\b/g, '≥'],
    [/\\infty\b/g, '∞'],
    [/\\degree\b|\^\\circ\b/g, '°'],
    [/\\pi\b/g, 'π'],
    [/\\theta\b/g, 'θ'],
    [/\\alpha\b/g, 'α'],
    [/\\beta\b/g, 'β'],
    [/\\gamma\b/g, 'γ'],
    [/\\lambda\b/g, 'λ'],
    [/\\mu\b/g, 'μ'],
    [/\\Delta\b/g, 'Δ'],
    [/\\delta\b/g, 'δ'],
    [/\\sigma\b/g, 'σ'],
    [/\\omega\b/g, 'ω'],
    [/\\Omega\b/g, 'Ω'],
    [/\\rightarrow\b|\\to\b/g, '→'],
    [/\\leftarrow\b/g, '←'],
    [/\\leftrightarrow\b/g, '↔'],
    [/\\sum\b/g, '∑'],
    [/\\int\b/g, '∫'],
    [/\\partial\b/g, '∂'],
    [/\\quad\b|\\qquad\b/g, '   '],
    [/\\,/g, ' '],
    [/\\;/g, ' '],
    [/\\:/g, ' '],
    [/\\!/g, ''],
    [/\\left\(/g, '('],
    [/\\right\)/g, ')'],
    [/\\left\[/g, '['],
    [/\\right\]/g, ']'],
    [/\\text\{([^{}]+)\}/g, '$1'],
    [/\\textbf\{([^{}]+)\}/g, '$1'],
    [/\\textit\{([^{}]+)\}/g, '$1'],
    [/\\mathrm\{([^{}]+)\}/g, '$1'],
    [/\\mathbf\{([^{}]+)\}/g, '$1'],
    [/\\overline\{([^{}]+)\}/g, '$1̄'],
    [/\\bar\{([^{}]+)\}/g, '$1̄'],
    [/\\hat\{([^{}]+)\}/g, '$1̂'],
    [/\\vec\{([^{}]+)\}/g, '$1⃗'],
    [/\\oplus\b/g, '⊕'],
    [/\\otimes\b/g, '⊗'],
    [/\\odot\b/g, '⊙'],
    [/\\lor\b/g, '∨'],
    [/\\land\b/g, '∧'],
    [/\\neg\b/g, '¬'],
    [/\\in\b/g, '∈'],
    [/\\notin\b/g, '∉'],
    [/\\subset\b/g, '⊂'],
    [/\\subseteq\b/g, '⊆'],
    [/\\cup\b/g, '∪'],
    [/\\cap\b/g, '∩'],
    [/\\emptyset\b/g, '∅'],
  ];

  for (const [pattern, replacement] of latexSymbolMap) {
    clean = clean.replace(pattern, replacement);
  }

  // 4. Superscript conversion
  const superscriptMap: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
    'n': 'ⁿ', 'i': 'ⁱ', 'x': 'ˣ', 'y': 'ʸ'
  };

  clean = clean.replace(/\^{([^{}]+)}/g, (_, exp) => {
    return exp.split('').map((char: string) => superscriptMap[char] || char).join('');
  });
  clean = clean.replace(/\^([0-9+\-nixy])/g, (_, exp) => superscriptMap[exp] || exp);

  // 5. Subscript conversion
  const subscriptMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
    'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
    'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
    'v': 'ᵥ', 'x': 'ₓ'
  };

  clean = clean.replace(/_{([^{}]+)}/g, (_, sub) => {
    return sub.split('').map((char: string) => subscriptMap[char] || char).join('');
  });
  clean = clean.replace(/_([0-9+\-aehijklmnoprstuvx])/g, (_, sub) => subscriptMap[sub] || sub);

  // 6. Strip remaining math delimiters
  clean = clean.replace(/\$+/g, '');
  clean = clean.replace(/\\([a-zA-Z]+)/g, '$1');

  return clean.trim();
}

export async function generateQuestionPaperDocx(
  data: QuestionPaperData,
  filename?: string
): Promise<Blob> {
  const primaryFont = data.fontFamily || 'Noto Sans Bengali';
  const baseFontSize = (data.fontSize || 12) * 2; // half-points (12pt = 24)

  const docChildren: (Paragraph | Table)[] = [];

  // ==========================================
  // 1. INSTITUTION & EXAM HEADER
  // ==========================================

  // School Name
  if (data.header.schoolName) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: formatMathAndTextForDocx(data.header.schoolName),
            bold: true,
            size: baseFontSize + 8, // 16pt
            font: primaryFont
          })
        ]
      })
    );
  }

  // Exam Title
  if (data.header.examTitle) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: formatMathAndTextForDocx(data.header.examTitle),
            bold: true,
            size: baseFontSize + 2, // 13pt
            font: primaryFont
          })
        ]
      })
    );
  }

  // Class & Subject Line
  const classSubjectText = [
    data.header.className ? `শ্রেণি / Class: ${data.header.className}` : '',
    data.header.subject ? `বিষয় / Subject: ${data.header.subject}` : '',
    data.header.subjectCode ? `(বিষয় কোড: ${data.header.subjectCode})` : ''
  ]
    .filter(Boolean)
    .join('  |  ');

  if (classSubjectText) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [
          new TextRun({
            text: formatMathAndTextForDocx(classSubjectText),
            bold: true,
            size: baseFontSize,
            font: primaryFont
          })
        ]
      })
    );
  }

  // Time & Full Marks (Clean full-width Table with explicit DXA twips for 100% Google Docs compatibility)
  const timeText = data.header.timeAllowed ? `সময়: ${data.header.timeAllowed}` : '';
  const marksText = data.header.fullMarks ? `পূর্ণমান: ${data.header.fullMarks}` : '';

  if (timeText || marksText) {
    const noBorder = { style: BorderStyle.NONE, size: 0, color: 'auto' };
    const headerTable = new Table({
      width: { size: convertInchesToTwip(7.0), type: WidthType.DXA },
      columnWidths: [convertInchesToTwip(3.5), convertInchesToTwip(3.5)],
      borders: {
        top: noBorder,
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '666666' },
        left: noBorder,
        right: noBorder,
        insideHorizontal: noBorder,
        insideVertical: noBorder
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: convertInchesToTwip(3.5), type: WidthType.DXA },
              borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { before: 40, after: 80 },
                  children: [
                    new TextRun({
                      text: formatMathAndTextForDocx(timeText),
                      bold: true,
                      size: baseFontSize,
                      font: primaryFont
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: convertInchesToTwip(3.5), type: WidthType.DXA },
              borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 40, after: 80 },
                  children: [
                    new TextRun({
                      text: formatMathAndTextForDocx(marksText),
                      bold: true,
                      size: baseFontSize,
                      font: primaryFont
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    docChildren.push(headerTable);
  }

  // General Instructions
  if (data.header.generalInstructions) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 160 },
        children: [
          new TextRun({
            text: `[ ${formatMathAndTextForDocx(data.header.generalInstructions)} ]`,
            italics: true,
            size: baseFontSize - 2,
            font: primaryFont
          })
        ]
      })
    );
  } else {
    docChildren.push(
      new Paragraph({
        spacing: { before: 0, after: 100 },
        children: []
      })
    );
  }

  // ==========================================
  // 2. SECTIONS & QUESTIONS
  // ==========================================
  for (const section of data.sections) {
    // Section Header
    if (section.title) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 60 },
          children: [
            new TextRun({
              text: formatMathAndTextForDocx(section.title),
              bold: true,
              size: baseFontSize + 2,
              font: primaryFont,
              underline: {}
            })
          ]
        })
      );
    }

    // Section Instructions & Marks
    if (section.instruction || section.totalMarks) {
      const secMetaParts = [
        section.instruction ? formatMathAndTextForDocx(section.instruction) : '',
        section.totalMarks ? `(${formatMathAndTextForDocx(section.totalMarks)})` : ''
      ].filter(Boolean).join(' ');

      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 140 },
          children: [
            new TextRun({
              text: secMetaParts,
              italics: true,
              bold: true,
              size: baseFontSize - 1,
              font: primaryFont
            })
          ]
        })
      );
    }

    // Questions in this section
    for (const q of section.questions) {
      renderQuestionToDocx(q, docChildren, primaryFont, baseFontSize);
    }
  }

  // Create document
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: primaryFont,
            size: baseFontSize
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75)
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: data.header.schoolName ? `${formatMathAndTextForDocx(data.header.schoolName)} — ${formatMathAndTextForDocx(data.header.subject || '')}` : '',
                    size: 16,
                    font: primaryFont,
                    color: '777777'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'পৃষ্ঠা ', size: 16, font: primaryFont }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16 }),
                  new TextRun({ text: ' / ', size: 16 }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16 })
                ]
              })
            ]
          })
        },
        children: docChildren
      }
    ]
  });

  const blob = await Packer.toBlob(doc);

  if (filename) {
    saveAs(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);
  }

  return blob;
}

function renderQuestionToDocx(
  q: QuestionItem,
  children: (Paragraph | Table)[],
  font: string,
  baseFontSize: number
) {
  if (q.type === 'cq') {
    // Creative Question (CQ)
    const mainQuestionText = q.stem
      ? `${q.number}। ${formatMathAndTextForDocx(q.stem)}`
      : `${q.number}। ${formatMathAndTextForDocx(q.text)}`;

    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: mainQuestionText,
            bold: !q.stem,
            size: baseFontSize,
            font
          }),
          ...(q.marks && !q.subQuestions?.length
            ? [
              new TextRun({
                text: `  [${formatMathAndTextForDocx(q.marks)}]`,
                bold: true,
                size: baseFontSize,
                font
              })
            ]
            : [])
        ]
      })
    );

    if (q.subQuestions && q.subQuestions.length > 0) {
      for (const sub of q.subQuestions) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.3) },
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: `(${sub.label}) `,
                bold: true,
                size: baseFontSize,
                font
              }),
              new TextRun({
                text: formatMathAndTextForDocx(sub.text),
                size: baseFontSize,
                font
              }),
              ...(sub.marks
                ? [
                  new TextRun({
                    text: `   [${formatMathAndTextForDocx(sub.marks)}]`,
                    bold: true,
                    size: baseFontSize,
                    font
                  })
                ]
                : [])
            ]
          })
        );
      }
    }
  } else if (q.type === 'mcq') {
    // MCQ Question
    const mcqHeader = `${q.number}। ${formatMathAndTextForDocx(q.text || '')}`;
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 100, after: 40 },
        children: [
          new TextRun({
            text: mcqHeader,
            bold: false,
            size: baseFontSize,
            font
          }),
          ...(q.marks
            ? [
              new TextRun({
                text: `   [${formatMathAndTextForDocx(q.marks)}]`,
                bold: true,
                size: baseFontSize,
                font
              })
            ]
            : [])
        ]
      })
    );

    if (q.options && q.options.length > 0) {
      const noBorder = { style: BorderStyle.NONE, size: 0, color: 'auto' };
      const tableRows: TableRow[] = [];

      for (let i = 0; i < q.options.length; i += 2) {
        const opt1 = q.options[i];
        const opt2 = q.options[i + 1];

        const cells: TableCell[] = [
          new TableCell({
            width: { size: convertInchesToTwip(3.5), type: WidthType.DXA },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
            children: [
              new Paragraph({
                indent: { left: convertInchesToTwip(0.3) },
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({ text: `(${opt1.label}) `, bold: true, size: baseFontSize - 1, font }),
                  new TextRun({ text: formatMathAndTextForDocx(opt1.text), size: baseFontSize - 1, font })
                ]
              })
            ]
          })
        ];

        if (opt2) {
          cells.push(
            new TableCell({
              width: { size: convertInchesToTwip(3.5), type: WidthType.DXA },
              borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
              children: [
                new Paragraph({
                  indent: { left: convertInchesToTwip(0.3) },
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({ text: `(${opt2.label}) `, bold: true, size: baseFontSize - 1, font }),
                    new TextRun({ text: formatMathAndTextForDocx(opt2.text), size: baseFontSize - 1, font })
                  ]
                })
              ]
            })
          );
        } else {
          cells.push(
            new TableCell({
              width: { size: convertInchesToTwip(3.5), type: WidthType.DXA },
              borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
              children: [new Paragraph({ children: [] })]
            })
          );
        }

        tableRows.push(new TableRow({ children: cells }));
      }

      children.push(
        new Table({
          width: { size: convertInchesToTwip(7.0), type: WidthType.DXA },
          columnWidths: [convertInchesToTwip(3.5), convertInchesToTwip(3.5)],
          borders: {
            top: noBorder,
            bottom: noBorder,
            left: noBorder,
            right: noBorder,
            insideHorizontal: noBorder,
            insideVertical: noBorder
          },
          rows: tableRows
        })
      );
    }
  } else {
    // Standard Question (Short / Broad / Translation / Fill in the Blanks)
    const displayText = formatMathAndTextForDocx(q.text || q.stem || '');
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: `${q.number}। `,
            bold: true,
            size: baseFontSize,
            font
          }),
          new TextRun({
            text: displayText,
            size: baseFontSize,
            font
          }),
          ...(q.marks
            ? [
              new TextRun({
                text: `   [${formatMathAndTextForDocx(q.marks)}]`,
                bold: true,
                size: baseFontSize,
                font
              })
            ]
            : [])
        ]
      })
    );

    // If subquestions exist
    if (q.subQuestions && q.subQuestions.length > 0) {
      for (const sub of q.subQuestions) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.3) },
            spacing: { before: 25, after: 25 },
            children: [
              new TextRun({
                text: `(${sub.label}) `,
                bold: true,
                size: baseFontSize,
                font
              }),
              new TextRun({
                text: formatMathAndTextForDocx(sub.text),
                size: baseFontSize,
                font
              }),
              ...(sub.marks
                ? [
                  new TextRun({
                    text: `   [${formatMathAndTextForDocx(sub.marks)}]`,
                    bold: true,
                    size: baseFontSize,
                    font
                  })
                ]
                : [])
            ]
          })
        );
      }
    }
  }
}
