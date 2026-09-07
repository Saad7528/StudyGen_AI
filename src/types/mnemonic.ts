export interface MnemonicBreakdownItem {
  code: string;
  meaning: string;
  highlightColor?: string;
  phoneticHint?: string;
}

export type MnemonicCategory = 'acronym' | 'phonetic' | 'number_code' | 'association' | 'general';
export type SketchTheme = 'map' | 'cartoon' | 'historical' | 'humorous' | 'metaphor';

export interface VisualCueData {
  description: string;
  sketch_prompt: string;
  sketch_theme: SketchTheme;
  cartoon_dialogue?: string;
  character_left?: string;
  character_right?: string;
  map_highlight?: string;
  svg_pattern?: string;
  image_url?: string;
}

export interface MnemonicItem {
  id: string;
  topic: string;
  question: string;
  correct_answer: string;
  mnemonic_formula: string;
  category: MnemonicCategory;
  breakdown: MnemonicBreakdownItem[];
  mcq_avoid_confusion_tip?: string;
  visual_cue: VisualCueData;
  image_url?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  exam_target?: string; // e.g. 'বিসিএস / ব্যাংক / বিশ্ববিদ্যালয়'
}

export interface MnemonicGenerationResponse {
  success: boolean;
  data: MnemonicItem[];
  modelUsed?: string;
  error?: string;
}

export interface PresetTopic {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  question: string;
  answer?: string;
  tags: string[];
}
