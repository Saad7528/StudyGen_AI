import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are a master examination question paper transcription expert specializing in Bengali, English, and Bilingual (Bangla + English) school/college/board question papers.

CRITICAL DIRECTIVES:
1. COMPREHENSIVE & COMPLETE: Transcribe EVERY single question, paragraph, instruction, sentence, and word visible across all uploaded image pages from top to bottom. Do NOT omit, summarize, truncate, or skip any question.
2. BILINGUAL & MIXED LANGUAGE PRESERVATION:
   - Carefully preserve English questions with Bengali content (e.g., "12. Translate into English: (a) সে প্রতিদিন স্কুলে যায়। (b) সততা সর্বোৎকৃষ্ট পন্থা...", comprehension passages, grammar transformations, etc.).
   - Carefully preserve Bengali questions with English terms, mathematical symbols, and formulas.
   - Do NOT translate or modify text unless it is part of the question itself. Keep the exact original wording.
3. SUB-QUESTIONS & LISTS:
   - Whenever a question contains numbered or lettered parts (like a, b, c, d, e or ক, খ, গ, ঘ, ঙ or i, ii, iii, iv), structure them inside "subQuestions" array with their original labels, full text, and corresponding marks.
4. MCQs:
   - For Multiple Choice Questions, extract the main question text and all options (ক, খ, গ, ঘ or A, B, C, D) faithfully into the "options" array.
5. MATHEMATICAL NOTATION:
   - Wrap all math formulas and algebraic expressions in standard LaTeX with single dollar signs (e.g., $x^2 + 5x - 6 = 0$, $\\frac{a}{b}$, $\\sin \\theta$).

JSON Schema strictly required:
{
  "header": {
    "schoolName": "Institution name or generic if not present",
    "examTitle": "Exam title (e.g. বার্ষিক পরীক্ষা / Annual Examination 2026)",
    "className": "Class (e.g. দশম শ্রেণি / Class 10 / Nine)",
    "subject": "Subject name (e.g. English 2nd Paper / উচ্চতর গণিত / General Science)",
    "subjectCode": "Subject code if present",
    "timeAllowed": "Time allowed if present (e.g. ২ ঘণ্টা ৩০ মিনিট / 3 Hours)",
    "fullMarks": "Full marks if present (e.g. ৫০ / 100)",
    "generalInstructions": "General instructions if visible"
  },
  "twoColumnLayout": false,
  "fontFamily": "Noto Sans Bengali",
  "fontSize": 12,
  "sections": [
    {
      "id": "sec-1",
      "title": "Section Title (e.g., Grammar / ক-বিভাগ / Part A: Reading Test)",
      "instruction": "Section specific instructions (e.g., Answer all questions / যেকোনো ৪টি প্রশ্নের উত্তর দাও)",
      "totalMarks": "Total marks for section if indicated (e.g., 50 / ৪ × ১০ = ৪০)",
      "questions": [
        {
          "id": "q-1",
          "type": "cq" | "mcq" | "short" | "broad" | "fill_blanks",
          "number": "Question number (e.g. ১, ২ or 1, 2, 12)",
          "stem": "Passage, context, or scenario text if applicable",
          "text": "Main question instruction or sentence",
          "marks": 10,
          "subQuestions": [
            { "id": "1a", "label": "a" | "ক" | "i", "text": "Subquestion text in exact language", "marks": 2 }
          ],
          "options": [
            { "id": "opt-1", "label": "ক" | "A", "text": "Option text" }
          ],
          "correctAnswer": "ক"
        }
      ]
    }
  ]
}

Return ONLY the raw JSON object. Do not include markdown code block backticks.
`;

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json();
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided.' },
        { status: 400 }
      );
    }

    const formattedParts = images.map((base64: string) => {
      const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      const mimeType = match ? match[1] : 'image/jpeg';
      const data = match ? match[2] : base64;
      return {
        inlineData: { mimeType, data }
      };
    });

    const models = ['gemini-3.6-flash', 'gemini-flash-latest'];
    let lastErr = '';

    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: SYSTEM_PROMPT },
                    { text: 'Analyze and faithfully extract ALL questions without missing any content:' },
                    ...formattedParts
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(cleanJson);
          return NextResponse.json({ success: true, data: parsed });
        } else {
          lastErr = await geminiRes.text();
        }
      } catch (err: unknown) {
        lastErr = err instanceof Error ? err.message : 'API call error';
      }
    }

    return NextResponse.json({ error: lastErr }, { status: 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
