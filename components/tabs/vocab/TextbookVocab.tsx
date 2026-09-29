"use client";

import { useMemo, useState } from "react";
import { textbookVocab, VOCAB_CATEGORIES, type VocabCategory } from "@/lib/vocabData";
import { matchScore } from "@/lib/korean";
import { speakText } from "@/lib/utils";

type CategoryFilter = "all" | VocabCategory;

const SEARCH_EXAMPLES = ["곤니치와", "고양이", "먹습니다", "ㅌㅂㅁㅅ"];

export default function TextbookVocab() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const pool = category === "all" ? textbookVocab : textbookVocab.filter((w) => w.category === category);
    if (!search.trim()) return pool;
    return pool
      .map((word) => ({
        word,
        score: matchScore(search, [word.koReading, word.meaning, word.kana, word.kanji, word.romaji]),
      }))
      .filter(({ score }) => score !== Infinity)
      .sort((a, b) => a.score - b.score)
      .map(({ word }) => word);
  }, [category, search]);

  const countByCategory = useMemo(() => {
    const counts = new Map<VocabCategory, number>();
    for (const w of textbookVocab) counts.set(w.category, (counts.get(w.category) ?? 0) + 1);
    return counts;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center">
              <span className="w-2.5 h-5 bg-amber-500 rounded-full mr-2"></span>
              교재 기본 단어 (基本単語)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              민나노 니혼고 1권 · JLPT N5 필수 어휘 {textbookVocab.length}개
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <label htmlFor="vocab-search" className="sr-only">
              단어 검색
            </label>
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              id="vocab-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="한글 발음이나 뜻으로 검색 (예: 곤니치와)"
              className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
          <span>검색 예시:</span>
          {SEARCH_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setSearch(ex)}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-700 transition font-medium"
            >
              {ex}
            </button>
          ))}
          <span className="text-slate-400">· 한글 발음, 뜻, 초성, 히라가나, 로마자 모두 가능</span>
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="단어 분류">
          <CategoryChip active={category === "all"} onClick={() => setCategory("all")} label="전체" count={textbookVocab.length} />
          {VOCAB_CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              label={c}
              count={countByCategory.get(c) ?? 0}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500 px-1" aria-live="polite">
        <strong className="text-slate-800">{results.length}</strong>개의 단어
        {search.trim() && (
          <>
            {" · "}&quot;{search.trim()}&quot; 검색 결과
          </>
        )}
      </p>

      {results.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {results.map((word) => (
            <li
              key={word.id}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xl font-black text-slate-800 japanese-font leading-tight break-keep">{word.kana}</p>
                  {word.kanji && <p className="text-xs text-slate-400 japanese-font mt-0.5">{word.kanji}</p>}
                </div>
                <button
                  onClick={() => speakText(word.kana)}
                  className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition shrink-0"
                  aria-label={`${word.kana} 발음 듣기`}
                >
                  <i className="fa-solid fa-volume-high text-xs"></i>
                </button>
              </div>

              <div className="flex flex-col gap-0.5 pt-3 border-t border-dashed border-slate-100">
                <p className="text-sm font-bold text-amber-700">[{word.koReading}]</p>
                <p className="text-sm text-slate-700 leading-relaxed">{word.meaning}</p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-mono text-slate-400">{word.romaji}</span>
                <span className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full">
                  {word.category}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <i className="fa-solid fa-search text-4xl mb-3 opacity-20"></i>
          <p className="text-sm font-bold text-slate-400">검색 결과가 없습니다.</p>
          <p className="text-xs text-slate-400 mt-1">다른 발음 표기나 뜻으로 검색해 보세요.</p>
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-2.5 py-1 text-[11px] rounded-lg border transition ${
        active
          ? "bg-amber-500 border-amber-500 text-white font-bold"
          : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"
      }`}
    >
      {label} <span className={active ? "text-amber-100" : "text-slate-400"}>{count}</span>
    </button>
  );
}
