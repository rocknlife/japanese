"use client";

import { useState, useMemo } from "react";
import type { FoodFilter, ScriptType } from "@/lib/types";
import { allKanaList } from "@/lib/kanaData";
import { speakText, highlightCharInFood } from "@/lib/utils";

const FILTERS: { id: FoodFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "vowel", label: "모음단" },
  { id: "consonant", label: "자음단" },
];

interface FoodVocabTabProps {
  masteredKanas: string[];
}

export default function FoodVocabTab({ masteredKanas }: FoodVocabTabProps) {
  const [filter, setFilter] = useState<FoodFilter>("all");
  const [scriptType, setScriptType] = useState<ScriptType>("hiragana");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    return allKanaList.filter((item) => {
      if (!item.food) return false;
      if (filter === "vowel" && item.type !== "vowel") return false;
      if (filter === "consonant" && item.type === "vowel") return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.h?.includes(q) ||
          item.k?.includes(q) ||
          item.r?.includes(q) ||
          item.food.name.includes(q) ||
          item.food.koName.includes(q)
        );
      }
      return true;
    });
  }, [filter, search]);

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center">
            <span className="w-2.5 h-5 bg-amber-500 rounded-full mr-2"></span>
            음식 단어 연상 학습 (単語帳)
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {allKanaList.filter((x) => x.food).length}개의 일식 연상 단어로 익히는 문자 완전 정복
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Script toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {(["hiragana", "katakana"] as ScriptType[]).map((s) => (
              <button
                key={s}
                onClick={() => setScriptType(s)}
                className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  scriptType === s
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {s === "hiragana" ? "히라가나" : "가타카나"}
              </button>
            ))}
          </div>
          {/* Filter */}
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {FILTERS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition ${
                  filter === id
                    ? "bg-white text-slate-800 font-bold shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="글자, 단어 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition w-36"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-500 px-1">
        <strong className="text-slate-800">{items.length}</strong>개의 단어 결과
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((item) => {
          if (!item.food) return null;
          const kanaChar = (scriptType === "hiragana" ? item.h : item.k) ?? "";
          const isMastered = masteredKanas.includes(item.h ?? "");

          const highlightedName = highlightCharInFood(item.food.name, kanaChar);
          const highlightedSentence = highlightCharInFood(item.food.sentence, kanaChar);

          return (
            <article
              key={item.h}
              className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all hover:border-amber-200 flex flex-col"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center text-base shrink-0">
                    {item.food.emoji}
                  </div>
                  <div>
                    <p
                      className="text-base font-black text-slate-800 japanese-font leading-none"
                      dangerouslySetInnerHTML={{ __html: highlightedName }}
                    />
                    <p className="text-[9px] text-slate-500">{item.food.romaji} ({item.food.koName})</p>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                  <span className="text-xl font-extrabold text-slate-700 japanese-font">
                    {kanaChar}
                  </span>
                  <span className="text-[8px] text-rose-500 font-bold">{item.r}</span>
                </div>
              </div>

              {/* Sentence */}
              <div
                className="text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-100 japanese-font text-slate-700 mt-auto cursor-default"
                dangerouslySetInnerHTML={{ __html: highlightedSentence }}
              />
              <p className="text-[9px] text-slate-400 mt-1">{item.food.koSentence}</p>

              {/* Bottom */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-slate-100">
                <div className="flex gap-1 items-center">
                  <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-full">
                    {item.food.tag}
                  </span>
                  {isMastered && (
                    <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-full font-bold">
                      마스터
                    </span>
                  )}
                </div>
                <button
                  onClick={() => item.food && speakText(item.food.name)}
                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                  aria-label="발음 듣기"
                >
                  <i className="fa-solid fa-volume-high text-[10px]"></i>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <i className="fa-solid fa-search text-4xl mb-3 opacity-20"></i>
          <p className="text-sm font-bold text-slate-400">검색 결과가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
