"use client";

import type { KanaItem, ScriptType } from "@/lib/types";

interface KanaMatrixProps {
  items: KanaItem[];
  scriptType: ScriptType;
  selectedKana: KanaItem | null;
  masteredKanas: string[];
  onSelect: (item: KanaItem) => void;
}

export default function KanaMatrix({
  items,
  scriptType,
  selectedKana,
  masteredKanas,
  onSelect,
}: KanaMatrixProps) {
  return (
    <div>
      {/* Header vowel labels */}
      <div className="grid grid-cols-5 gap-2 mb-2 text-center text-[10px] font-bold text-slate-400">
        {["A (あ단)", "I (い단)", "U (う단)", "E (え단)", "O (お단)"].map((v) => (
          <div key={v}>{v}</div>
        ))}
      </div>

      {/* Character grid */}
      <div className="grid grid-cols-5 gap-2">
        {items.map((item, idx) => {
          if (!item || item.type === "none") {
            return (
              <div
                key={idx}
                className="bg-slate-50/20 rounded-xl h-11 border border-dashed border-slate-100"
              />
            );
          }

          const label = scriptType === "hiragana" ? item.h : item.k;
          const isMastered = item.h ? masteredKanas.includes(item.h) : false;
          const isActive = selectedKana?.h === item.h;

          const activeStyle = isActive
            ? "border-rose-500 bg-rose-500 text-white shadow-sm scale-105"
            : "border-slate-100 bg-white hover:border-rose-300 hover:bg-rose-50/20";

          return (
            <button
              key={idx}
              onClick={() => onSelect(item)}
              className={`h-11 rounded-xl border transition-all duration-150 cursor-pointer p-1 flex flex-col justify-between relative overflow-hidden group ${activeStyle}`}
            >
              <div className="flex justify-between items-start w-full">
                <span
                  className={`text-[8px] font-bold uppercase ${
                    isActive ? "text-rose-100" : "text-slate-400"
                  }`}
                >
                  {item.r}
                </span>
                {isMastered && (
                  <span className="text-[7px] text-emerald-500 bg-emerald-50 w-3 h-3 rounded-full flex items-center justify-center font-bold shrink-0">
                    <i className="fa-solid fa-check"></i>
                  </span>
                )}
              </div>
              <div className="text-center pb-0.5">
                <span
                  className={`text-lg leading-none japanese-font ${
                    isActive
                      ? "text-white font-extrabold"
                      : "text-slate-800 font-bold"
                  }`}
                >
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-dashed border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full mr-1.5"></span>
          터치하여 원어민 소리 듣기
        </span>
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 border border-slate-200 bg-slate-50 rounded mr-1.5"></span>
          빈 칸은 없는 발음입니다
        </span>
      </div>
    </div>
  );
}
