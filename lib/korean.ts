import { allKanaList } from "./kanaData";

const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONG_N = 4;
const JONG_S = 19;

// Japanese words are transliterated inconsistently in Korean (곤니치와/콘니치와, 츠/쯔/쓰, 곰방와/콘방와),
// so loose matching folds tense/aspirated initials and nasal finals together.
const LOOSE_CHO: Record<number, number> = { 1: 0, 15: 0, 4: 3, 16: 3, 8: 7, 17: 7, 13: 12, 14: 12, 10: 9 };
const LOOSE_JONG: Record<number, number> = { 20: 19, 21: 4, 16: 4 };

function isSyllable(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return code >= HANGUL_START && code <= HANGUL_END;
}

function decompose(ch: string) {
  const offset = ch.charCodeAt(0) - HANGUL_START;
  return { cho: Math.floor(offset / 588), jung: Math.floor((offset % 588) / 28), jong: offset % 28 };
}

function compose(cho: number, jung: number, jong: number): string {
  return String.fromCharCode(HANGUL_START + cho * 588 + jung * 28 + jong);
}

export function normalizeQuery(text: string): string {
  return text.toLowerCase().replace(/[\s~〜()（）·・/,.'’\-]/g, "");
}

function toChosung(text: string): string {
  return [...text].map((ch) => (isSyllable(ch) ? CHO[decompose(ch).cho] : ch)).join("");
}

function toLoose(text: string): string {
  return [...text]
    .map((ch) => {
      if (!isSyllable(ch)) return ch;
      const { cho, jung, jong } = decompose(ch);
      return compose(LOOSE_CHO[cho] ?? cho, jung, LOOSE_JONG[jong] ?? jong);
    })
    .join("");
}

/**
 * Lower score = better match. Returns Infinity when nothing matches.
 * 0 exact · 1 prefix · 2 contains · 3 loose Korean spelling · 4 초성
 */
export function matchScore(query: string, targets: (string | null | undefined)[]): number {
  const q = normalizeQuery(query);
  if (!q) return 0;
  const isChosungOnly = /^[ㄱ-ㅎ]+$/.test(q);
  const looseQ = toLoose(q);
  let best = Infinity;

  for (const target of targets) {
    if (!target) continue;
    const t = normalizeQuery(target);
    let score = Infinity;
    if (t === q) score = 0;
    else if (t.startsWith(q)) score = 1;
    else if (t.includes(q)) score = 2;
    else if (toLoose(t).includes(looseQ)) score = 3;
    else if (isChosungOnly && toChosung(t).includes(q)) score = 4;
    if (score < best) best = score;
    if (best === 0) break;
  }
  return best;
}

const KANA_TO_KO = new Map<string, string>();
for (const item of allKanaList) {
  if (!item.ko) continue;
  if (item.h) KANA_TO_KO.set(item.h, item.ko);
  if (item.k) KANA_TO_KO.set(item.k, item.ko);
}

function appendFinal(out: string[], jong: number) {
  const last = out[out.length - 1];
  if (last && isSyllable(last)) {
    const { cho, jung, jong: current } = decompose(last);
    if (current === 0) out[out.length - 1] = compose(cho, jung, jong);
  }
}

/** Approximate Korean pronunciation of a kana string, e.g. "らーめん" → "라멘". */
export function kanaToHangul(kana: string): string {
  const out: string[] = [];
  const chars = [...kana];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const pair = ch + (chars[i + 1] ?? "");
    if (pair.length === 2 && KANA_TO_KO.has(pair)) {
      out.push(KANA_TO_KO.get(pair)!);
      i++;
    } else if (ch === "ん" || ch === "ン") {
      appendFinal(out, JONG_N);
    } else if (ch === "っ" || ch === "ッ") {
      appendFinal(out, JONG_S);
    } else if (ch === "ー") {
      continue;
    } else {
      out.push(KANA_TO_KO.get(ch) ?? ch);
    }
  }
  return out.join("");
}
