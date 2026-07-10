export interface FoodData {
  name: string;
  koName: string;
  romaji: string;
  emoji: string;
  tag: string;
  sentence: string;
  koSentence: string;
}

export interface KanaItem {
  h: string | null;
  k: string | null;
  r: string | null;
  ko: string | null;
  strokes: number;
  type: "vowel" | "consonant" | "voiced" | "handakuon" | "yoon" | "none";
  food?: FoodData;
}

export interface KanaData {
  basic: KanaItem[];
  voiced: KanaItem[];
  yoon: KanaItem[];
}

export type ScriptType = "hiragana" | "katakana";
export type KanaCategory = "basic" | "voiced" | "yoon";
export type TabId = "chart" | "food" | "drawing" | "quiz" | "notice" | "attendance";
export type AttendanceStatus = "none" | "present" | "absent";
export type ToastType = "success" | "error" | "info";
export type QuizType = "kana_to_romaji" | "food_to_meaning";
export type NoticeType = "notice" | "homework" | "share";
export type FoodFilter = "all" | "vowel" | "consonant";
export type NoticeFilter = "all" | "notice" | "homework" | "share";

export interface UserData {
  pageId?: string;
  id: string;
  name: string;
  attendance: string[];
}

export interface NoticeData {
  id: string;
  type: NoticeType;
  author: string;
  content: string;
  createdAt: string;
}

export interface NotionConfig {
  apiKey: string;
  dbId: string;
  proxy: string;
}

export interface QuizQuestion {
  target: KanaItem;
  choices: KanaItem[];
}
