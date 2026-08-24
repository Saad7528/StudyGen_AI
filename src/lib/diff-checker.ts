export type DiffMode = 'char' | 'word' | 'line';

export interface DiffOptions {
  mode: DiffMode;
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
  ignoreEmptyLines?: boolean;
  ignoreLineOrder?: boolean;
  ignorePunctuation?: boolean;
}

export type DiffType = 'added' | 'removed' | 'unchanged' | 'modified';

export interface DiffPart {
  value: string;
  type: DiffType;
  lineNumberA?: number;
  lineNumberB?: number;
  subParts?: DiffPart[];
}

export interface TextStatistics {
  charsWithSpace: number;
  charsWithoutSpace: number;
  words: number;
  sentences: number;
  lines: number;
  nonEmptyLines: number;
  paragraphs: number;
}

export interface DiffSummary {
  similarityPercentage: number;
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
  statsA: TextStatistics;
  statsB: TextStatistics;
}

export interface DiffResult {
  parts: DiffPart[];
  leftLines: { lineNum: number; content: string; type: DiffType; subParts?: DiffPart[] }[];
  rightLines: { lineNum: number; content: string; type: DiffType; subParts?: DiffPart[] }[];
  summary: DiffSummary;
}

/**
 * Calculate comprehensive statistics for a text string.
 */
export function calculateTextStatistics(text: string): TextStatistics {
  if (!text) {
    return {
      charsWithSpace: 0,
      charsWithoutSpace: 0,
      words: 0,
      sentences: 0,
      lines: 0,
      nonEmptyLines: 0,
      paragraphs: 0,
    };
  }

  const charsWithSpace = text.length;
  const charsWithoutSpace = text.replace(/\s/g, '').length;

  // Words: Bengali & English words matching Unicode letters/digits
  const wordsMatch = text.match(/[\p{L}\p{N}_\-]+/gu);
  const words = wordsMatch ? wordsMatch.length : 0;

  // Sentences: splitting by Bengali dari '।', question '?', exclamation '!', or period '.'
  const sentencesMatch = text.match(/[^।?!.\n\r]+[।?!.]+/g);
  let sentences = sentencesMatch ? sentencesMatch.length : 0;
  if (sentences === 0 && text.trim().length > 0) {
    sentences = 1;
  }

  const rawLines = text.split(/\r?\n/);
  const lines = rawLines.length;
  const nonEmptyLines = rawLines.filter((l) => l.trim().length > 0).length;

  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length || (text.trim().length > 0 ? 1 : 0);

  return {
    charsWithSpace,
    charsWithoutSpace,
    words,
    sentences,
    lines,
    nonEmptyLines,
    paragraphs,
  };
}

/**
 * Tokenize string according to DiffMode
 */
function tokenize(text: string, mode: DiffMode, options: DiffOptions): string[] {
  if (!text) return [];

  if (mode === 'char') {
    return Array.from(text);
  }

  if (mode === 'word') {
    const tokens: string[] = [];
    const regex = /([\p{L}\p{N}_\-]+|[^\p{L}\p{N}_\-\s]+|\s+)/gu;
    let match;
    while ((match = regex.exec(text)) !== null) {
      tokens.push(match[0]);
    }
    return tokens;
  }

  // Line mode
  let rawLines = text.split(/\r?\n/);
  if (options.ignoreEmptyLines) {
    rawLines = rawLines.filter((l) => l.trim().length > 0);
  }
  if (options.ignoreLineOrder) {
    rawLines = [...rawLines].sort();
  }
  return rawLines;
}

/**
 * Myers / LCS Algorithm implementation for finding sequence differences.
 */
function lcsDiff<T>(
  a: T[],
  b: T[],
  equals: (x: T, y: T) => boolean = (x, y) => x === y
): { type: 'unchanged' | 'added' | 'removed'; itemA?: T; itemB?: T }[] {
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (equals(a[i], b[j])) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const result: { type: 'unchanged' | 'added' | 'removed'; itemA?: T; itemB?: T }[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && equals(a[i - 1], b[j - 1])) {
      result.unshift({ type: 'unchanged', itemA: a[i - 1], itemB: b[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', itemB: b[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ type: 'removed', itemA: a[i - 1] });
      i--;
    }
  }

  return result;
}

/**
 * Main Comparison Function
 */
export function computeDiff(
  originalText: string,
  modifiedText: string,
  options: DiffOptions
): DiffResult {
  const statsA = calculateTextStatistics(originalText);
  const statsB = calculateTextStatistics(modifiedText);

  const compareEquality = (x: string, y: string) => {
    let nx = x;
    let ny = y;
    if (options.ignoreCase) {
      nx = nx.toLowerCase();
      ny = ny.toLowerCase();
    }
    if (options.ignoreWhitespace) {
      nx = nx.trim().replace(/\s+/g, ' ');
      ny = ny.trim().replace(/\s+/g, ' ');
    }
    if (options.ignorePunctuation) {
      nx = nx.replace(/[।.,\/#!$%\^&\*;:{}=\-_`~()?"'\[\]]/g, '');
      ny = ny.replace(/[।.,\/#!$%\^&\*;:{}=\-_`~()?"'\[\]]/g, '');
    }
    return nx === ny;
  };

  const tokensA = tokenize(originalText, options.mode, options);
  const tokensB = tokenize(modifiedText, options.mode, options);

  const diffRaw = lcsDiff(tokensA, tokensB, compareEquality);

  const parts: DiffPart[] = [];
  let addedCount = 0;
  let removedCount = 0;
  let unchangedCount = 0;

  for (const entry of diffRaw) {
    if (entry.type === 'unchanged') {
      unchangedCount++;
      parts.push({
        value: entry.itemA ?? '',
        type: 'unchanged',
      });
    } else if (entry.type === 'added') {
      addedCount++;
      parts.push({
        value: entry.itemB ?? '',
        type: 'added',
      });
    } else if (entry.type === 'removed') {
      removedCount++;
      parts.push({
        value: entry.itemA ?? '',
        type: 'removed',
      });
    }
  }

  const totalTokens = addedCount + removedCount + unchangedCount * 2;
  const similarityPercentage =
    totalTokens > 0 ? Math.round(((unchangedCount * 2) / totalTokens) * 100) : 100;

  // Build Split Line Diff (Side-by-Side View)
  const linesA = originalText.split(/\r?\n/);
  const linesB = modifiedText.split(/\r?\n/);
  const lineDiffRaw = lcsDiff(linesA, linesB, compareEquality);

  const leftLines: { lineNum: number; content: string; type: DiffType; subParts?: DiffPart[] }[] = [];
  const rightLines: { lineNum: number; content: string; type: DiffType; subParts?: DiffPart[] }[] = [];

  let lineNumA = 1;
  let lineNumB = 1;

  for (const item of lineDiffRaw) {
    if (item.type === 'unchanged') {
      leftLines.push({ lineNum: lineNumA++, content: item.itemA || '', type: 'unchanged' });
      rightLines.push({ lineNum: lineNumB++, content: item.itemB || '', type: 'unchanged' });
    } else if (item.type === 'removed') {
      leftLines.push({ lineNum: lineNumA++, content: item.itemA || '', type: 'removed' });
      rightLines.push({ lineNum: 0, content: '', type: 'unchanged' });
    } else if (item.type === 'added') {
      leftLines.push({ lineNum: 0, content: '', type: 'unchanged' });
      rightLines.push({ lineNum: lineNumB++, content: item.itemB || '', type: 'added' });
    }
  }

  return {
    parts,
    leftLines,
    rightLines,
    summary: {
      similarityPercentage,
      addedCount,
      removedCount,
      unchangedCount,
      statsA,
      statsB,
    },
  };
}
