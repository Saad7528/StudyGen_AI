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
            text: data.header.schoolName,
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
            text: data.header.examTitle,
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
            text: classSubjectText,
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
                      text: timeText,
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
                      text: marksText,
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
            text: `[ ${data.header.generalInstructions} ]`,
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
              text: section.title,
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
      const secMetaParts = [section.instruction, section.totalMarks ? `(${section.totalMarks})` : ''].filter(Boolean).join(' ');
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
                    text: data.header.schoolName ? `${data.header.schoolName} — ${data.header.subject || ''}` : '',
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
  const cleanMath = (text: string) => text.replace(/\$/g, '');

  if (q.type === 'cq') {
    // Creative Question (CQ)
    const mainQuestionText = q.stem ? `${q.number}। ${cleanMath(q.stem)}` : `${q.number}। ${cleanMath(q.text)}`;
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
                text: `  [${q.marks}]`,
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
                text: cleanMath(sub.text),
                size: baseFontSize,
                font
              }),
              ...(sub.marks
                ? [
                  new TextRun({
                    text: `   [${sub.marks}]`,
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
    const mcqHeader = `${q.number}। ${cleanMath(q.text || '')}`;
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
                text: `   [${q.marks}]`,
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
      // Clean 2-column or list paragraph for options
      const optA = q.options[0];
      const optB = q.options[1];
      const optC = q.options[2];
      const optD = q.options[3];

      if (optA && optB) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.3) },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: `(${optA.label}) `, bold: true, size: baseFontSize - 1, font }),
              new TextRun({ text: `${cleanMath(optA.text)}               `, size: baseFontSize - 1, font }),
              new TextRun({ text: `(${optB.label}) `, bold: true, size: baseFontSize - 1, font }),
              new TextRun({ text: cleanMath(optB.text), size: baseFontSize - 1, font })
            ]
          })
        );
      }

      if (optC || optD) {
        children.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.3) },
            spacing: { before: 20, after: 20 },
            children: [
              ...(optC
                ? [
                  new TextRun({ text: `(${optC.label}) `, bold: true, size: baseFontSize - 1, font }),
                  new TextRun({ text: `${cleanMath(optC.text)}               `, size: baseFontSize - 1, font })
                ]
                : []),
              ...(optD
                ? [
                  new TextRun({ text: `(${optD.label}) `, bold: true, size: baseFontSize - 1, font }),
                  new TextRun({ text: cleanMath(optD.text), size: baseFontSize - 1, font })
                ]
                : [])
            ]
          })
        );
      }
    }
  } else {
    // Standard Question (Short / Broad / Translation / Fill in the Blanks)
    const displayText = cleanMath(q.text || q.stem || '');
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
                text: `   [${q.marks}]`,
                bold: true,
                size: baseFontSize,
                font
              })
            ]
            : [])
        ]
      })
    );

    // If subquestions exist (e.g. Translation sentences a, b, c, d...)
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
                text: cleanMath(sub.text),
                size: baseFontSize,
                font
              }),
              ...(sub.marks
                ? [
                  new TextRun({
                    text: `   [${sub.marks}]`,
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
