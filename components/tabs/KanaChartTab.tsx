"use client";

import { useState } from "react";
import type { KanaItem, ScriptType, KanaCategory } from "@/lib/types";
import { kanaData } from "@/lib/kanaData";
import { speakText } from "@/lib/utils";
import KanaMatrix from "./chart/KanaMatrix";
import CharacterDetail from "./chart/CharacterDetail";
import LinkedFoodCard from "./chart/LinkedFoodCard";

interface KanaChartTabProps {
  masteredKanas: string[];
  onToggleMastery: (hChar: string) => void;
  onShowToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function KanaChartTab({
  masteredKanas,
  onToggleMastery,
  onShowToast,
}: KanaChartTabProps) {
  const [scriptType, setScriptType] = useState<ScriptType>("hiragana");
  const [category, setCategory] = useState<KanaCategory>("basic");
  const [selectedKana, setSelectedKana] = useState<KanaItem>(
    kanaData.basic.find((x) => !!x.h)!
  );

  const handleToggleMastery = () => {
    if (!selectedKana.h) return;
    const wasMastered = masteredKanas.includes(selectedKana.h);
    onToggleMastery(selectedKana.h);
    onShowToast(
      wasMastered
        ? `'${selectedKana.h}' 마스터 등록을 해제했습니다.`
        : `'${selectedKana.h}' 문자를 마스터 완료!`,
      wasMastered ? "info" : "success"
    );
  };

  const handleCategoryChange = (cat: KanaCategory) => {
    setCategory(cat);
    const firstValid = kanaData[cat].find((x) => x && x.h);
    if (firstValid) setSelectedKana(firstValid);
  };

  const handleScriptChange = (s: ScriptType) => {
    setScriptType(s);
  };

  const isMastered = selectedKana.h
    ? masteredKanas.includes(selectedKana.h)
    : false;

  const CATEGORIES: { id: KanaCategory; label: string }[] = [
    { id: "basic", label: "오십음" },
    { id: "voiced", label: "탁/반탁" },
    { id: "yoon", label: "요음" },
  ];

  return (
    <section className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center">
            <span className="w-2.5 h-5 bg-rose-500 rounded-full mr-2"></span>
            문자 학습판 (かな表)
          </h2>
          <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">
            글자를 탭하여 완벽한 발음과 자필 획순 가이드를 확인해 보세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Script toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {(["hiragana", "katakana"] as ScriptType[]).map((s) => (
              <button
                key={s}
                onClick={() => handleScriptChange(s)}
                className={`px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition ${
                  scriptType === s
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {s === "hiragana" ? "히라가나 (あ)" : "가타카나 (ア)"}
              </button>
            ))}
          </div>
          {/* Category filter */}
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleCategoryChange(id)}
                className={`px-2.5 py-1.5 text-[10px] md:text-xs font-medium rounded-lg transition ${
                  category === id
                    ? "bg-white text-slate-800 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: matrix */}
        <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <KanaMatrix
            items={kanaData[category]}
            scriptType={scriptType}
            selectedKana={selectedKana}
            masteredKanas={masteredKanas}
            onSelect={(item) => {
              setSelectedKana(item);
              const char = scriptType === "hiragana" ? item.h : item.k;
              if (char) speakText(char);
            }}
          />
        </div>

        {/* Right: detail panel */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <CharacterDetail
            item={selectedKana}
            scriptType={scriptType}
            isMastered={isMastered}
            onToggleMastery={handleToggleMastery}
          />
          <LinkedFoodCard item={selectedKana} scriptType={scriptType} />
        </div>
      </div>
    </section>
  );
}
