"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { KanaItem, ScriptType, KanaCategory } from "@/lib/types";
import { kanaData, allKanaList } from "@/lib/kanaData";
import { speakText } from "@/lib/utils";

interface DrawingPracticeTabProps {
  masteredKanas: string[];
  onToggleMastery: (hChar: string) => void;
  onShowToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function DrawingPracticeTab({
  masteredKanas,
  onToggleMastery,
  onShowToast,
}: DrawingPracticeTabProps) {
  const [scriptType, setScriptType] = useState<ScriptType>("hiragana");
  const [category, setCategory] = useState<KanaCategory>("basic");
  const [selectedKana, setSelectedKana] = useState<KanaItem>(
    kanaData.basic.find((x) => !!x.h)!
  );
  const [penColor, setPenColor] = useState("#f43f5e");
  const [penWidth, setPenWidth] = useState(5);
  const [showGuide, setShowGuide] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const charToShow =
    (scriptType === "hiragana" ? selectedKana.h : selectedKana.k) ?? "";

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [selectedKana, clearCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = penWidth;
    ctx.strokeStyle = penColor;

    const getCoords = (
      e: MouseEvent | Touch
    ): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
    };

    const onStart = (x: number, y: number) => {
      isDrawingRef.current = true;
      lastPosRef.current = { x, y };
    };
    const onMove = (x: number, y: number) => {
      if (!isDrawingRef.current) return;
      ctx.lineWidth = penWidth;
      ctx.strokeStyle = penColor;
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastPosRef.current = { x, y };
    };

    const onMouseDown = (e: MouseEvent) => { const [x, y] = getCoords(e); onStart(x, y); };
    const onMouseMove = (e: MouseEvent) => { const [x, y] = getCoords(e); onMove(x, y); };
    const onMouseUp = () => { isDrawingRef.current = false; };

    const onTouchStart = (e: TouchEvent) => {
      const [x, y] = getCoords(e.touches[0]);
      onStart(x, y);
      e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      const [x, y] = getCoords(e.touches[0]);
      onMove(x, y);
      e.preventDefault();
    };
    const onTouchEnd = () => { isDrawingRef.current = false; };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseout", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [penColor, penWidth]);

  const handleToggleMastery = () => {
    if (!selectedKana.h) return;
    const wasMastered = masteredKanas.includes(selectedKana.h);
    onToggleMastery(selectedKana.h);
    onShowToast(
      wasMastered ? `'${selectedKana.h}' 마스터 해제` : `'${selectedKana.h}' 마스터 등록!`,
      wasMastered ? "info" : "success"
    );
  };

  const CATEGORIES: { id: KanaCategory; label: string }[] = [
    { id: "basic", label: "오십음" },
    { id: "voiced", label: "탁/반탁" },
    { id: "yoon", label: "요음" },
  ];

  const PEN_COLORS = ["#f43f5e", "#1d4ed8", "#059669", "#d97706", "#111827"];

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center">
            <span className="w-2.5 h-5 bg-violet-500 rounded-full mr-2"></span>
            따라쓰기 & 트레이싱 연습
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">
            글자 이미지를 반투명 가이드로 보며 펜으로 직접 획을 따라 그으세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {(["hiragana", "katakana"] as ScriptType[]).map((s) => (
              <button
                key={s}
                onClick={() => setScriptType(s)}
                className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  scriptType === s
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {s === "hiragana" ? "히라가나" : "가타카나"}
              </button>
            ))}
          </div>
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setCategory(id);
                  const firstValid = kanaData[id].find((x) => x && x.h);
                  if (firstValid) setSelectedKana(firstValid);
                }}
                className={`px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition ${
                  category === id
                    ? "bg-white text-slate-800 font-bold shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: character picker */}
        <div className="lg:col-span-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
            글자 선택
          </p>
          <div className="grid grid-cols-4 gap-1.5 max-h-96 overflow-y-auto pr-0.5">
            {kanaData[category].map((item, idx) => {
              if (!item || !item.h) return (
                <div key={idx} className="h-9 rounded-lg bg-slate-50 border border-dashed border-slate-100" />
              );
              const char = scriptType === "hiragana" ? item.h : item.k;
              const isActive = selectedKana.h === item.h;
              const isMastered = masteredKanas.includes(item.h);
              return (
                <button
                  key={item.h}
                  onClick={() => setSelectedKana(item)}
                  className={`h-9 rounded-lg text-sm font-bold japanese-font transition flex items-center justify-center relative ${
                    isActive
                      ? "bg-violet-500 text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-violet-50 hover:text-violet-600 border border-slate-100"
                  }`}
                >
                  {char}
                  {isMastered && (
                    <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: canvas + tools */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            {/* Pen tools */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {PEN_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setPenColor(c)}
                      className={`w-5 h-5 rounded-full border-2 transition ${
                        penColor === c ? "border-violet-600 scale-110" : "border-transparent"
                      }`}
                      style={{ background: c }}
                      aria-label={`펜 색상 ${c}`}
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-1 text-[10px]">
                  <span className="text-slate-400">굵기</span>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    value={penWidth}
                    onChange={(e) => setPenWidth(parseInt(e.target.value))}
                    className="w-16 accent-violet-500"
                  />
                  <span className="text-slate-600 font-bold w-4">{penWidth}</span>
                </div>
                <button
                  onClick={() => setShowGuide((v) => !v)}
                  className={`px-2 py-1 text-[9px] rounded-lg border transition font-bold ${
                    showGuide
                      ? "bg-violet-100 text-violet-600 border-violet-200"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}
                >
                  <i className="fa-solid fa-eye mr-1"></i>가이드
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => charToShow && speakText(charToShow)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] rounded-xl transition"
                >
                  <i className="fa-solid fa-volume-high mr-1"></i>듣기
                </button>
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] rounded-xl transition"
                >
                  <i className="fa-solid fa-rotate-left mr-1"></i>지우기
                </button>
                <button
                  onClick={handleToggleMastery}
                  className={`px-3 py-1.5 font-bold text-[10px] rounded-xl transition ${
                    selectedKana.h && masteredKanas.includes(selectedKana.h)
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-violet-100 text-violet-600 hover:bg-violet-200"
                  }`}
                >
                  <i className={`fa-solid ${masteredKanas.includes(selectedKana.h ?? "") ? "fa-check" : "fa-graduation-cap"} mr-1`}></i>
                  마스터
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-2xl overflow-hidden border border-violet-100 shadow-inner bg-white">
              {showGuide && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-[22vw] md:text-[10rem] font-black japanese-font text-violet-200 opacity-90 leading-none">
                    {charToShow}
                  </span>
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={800}
                height={480}
                className="w-full h-56 md:h-80 cursor-crosshair relative z-10 bg-transparent"
              />
            </div>

            {/* Info bar */}
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span>
                <strong className="text-slate-700 text-sm japanese-font">{charToShow}</strong>
                &nbsp;&middot;&nbsp;{selectedKana.r}&nbsp;&middot;&nbsp;{selectedKana.strokes}획
              </span>
              <span className="text-violet-600 font-bold">
                {masteredKanas.length} / 104 마스터
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
