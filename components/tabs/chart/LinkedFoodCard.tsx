"use client";

import type { KanaItem, ScriptType } from "@/lib/types";
import { speakText, highlightChar } from "@/lib/utils";

interface LinkedFoodCardProps {
  item: KanaItem;
  scriptType: ScriptType;
}

export default function LinkedFoodCard({ item, scriptType }: LinkedFoodCardProps) {
  const food = item.food;
  if (!food) return null;

  const charToShow = (scriptType === "hiragana" ? item.h : item.k) ?? "";
  const highlightedName = highlightChar(food.name, charToShow);
  const highlightedSentence = highlightChar(food.sentence, charToShow);

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400">연상 단어 (일식)</span>
          <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
            {food.tag}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shrink-0">
            {food.emoji}
          </div>
          <div className="flex-grow">
            <h4
              className="text-base font-bold text-slate-800 tracking-wide japanese-font"
              dangerouslySetInnerHTML={{ __html: highlightedName }}
            />
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
              <span className="font-bold text-slate-700">{food.romaji}</span>
              <span>•</span>
              <span>{food.koName}</span>
            </div>
          </div>
          <button
            onClick={() => speakText(food.name)}
            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg transition shrink-0"
            aria-label="단어 발음 듣기"
          >
            <i className="fa-solid fa-volume-high text-xs"></i>
          </button>
        </div>
      </div>

      {/* Example sentence */}
      <div className="mt-3 pt-3 border-t border-dashed border-slate-100 bg-slate-50/50 p-2.5 rounded-xl">
        <div className="flex justify-between items-start gap-1">
          <div>
            <p className="text-[9px] font-bold text-slate-400 mb-1">한눈에 읽는 예문</p>
            <p
              className="text-xs font-bold text-slate-800 tracking-wide japanese-font"
              dangerouslySetInnerHTML={{ __html: highlightedSentence }}
            />
            <p className="text-[10px] text-slate-500 mt-0.5">{food.koSentence}</p>
          </div>
          <button
            onClick={() => speakText(food.sentence)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded transition shrink-0"
            aria-label="예문 발음 듣기"
          >
            <i className="fa-solid fa-volume-high text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
