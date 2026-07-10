"use client";

import { useRef, useEffect, useCallback } from "react";
import type { KanaItem, ScriptType } from "@/lib/types";
import { speakText } from "@/lib/utils";

interface CharacterDetailProps {
  item: KanaItem;
  scriptType: ScriptType;
  isMastered: boolean;
  onToggleMastery: () => void;
}

export default function CharacterDetail({
  item,
  scriptType,
  isMastered,
  onToggleMastery,
}: CharacterDetailProps) {
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const charToShow = scriptType === "hiragana" ? item.h : item.k;
  const labelType = scriptType === "hiragana" ? "히라가나" : "가타카나";

  const getCoords = (
    e: MouseEvent | Touch,
    canvas: HTMLCanvasElement
  ): [number, number] => {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const clearCanvas = useCallback(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Reset canvas when character changes
  useEffect(() => {
    clearCanvas();
  }, [item.h, clearCanvas]);

  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "#f43f5e";

    const onMouseDown = (e: MouseEvent) => {
      isDrawingRef.current = true;
      const [x, y] = getCoords(e, canvas);
      lastPosRef.current = { x, y };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;
      const [x, y] = getCoords(e, canvas);
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastPosRef.current = { x, y };
    };
    const onMouseUp = () => { isDrawingRef.current = false; };

    const onTouchStart = (e: TouchEvent) => {
      isDrawingRef.current = true;
      const [x, y] = getCoords(e.touches[0], canvas);
      lastPosRef.current = { x, y };
      e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current) return;
      const [x, y] = getCoords(e.touches[0], canvas);
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastPosRef.current = { x, y };
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
  }, []);

  return (
    <div className="bg-gradient-to-b from-rose-50/40 to-orange-50/30 p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center text-center">
      {/* Top row */}
      <div className="w-full flex justify-between items-center mb-3">
        <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
          {labelType}
        </span>
        <button
          onClick={onToggleMastery}
          className={`p-2 rounded-full shadow-sm transition ${
            isMastered
              ? "bg-rose-100 text-rose-600"
              : "bg-white/85 hover:bg-white text-slate-400 hover:text-rose-500"
          }`}
          aria-label="마스터 토글"
        >
          <i
            className={`text-base ${
              isMastered ? "fa-solid fa-check" : "fa-regular fa-bookmark"
            }`}
          ></i>
        </button>
      </div>

      {/* Big character */}
      <div className="relative group my-1">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-400 to-orange-300 opacity-20 blur transition duration-300"></div>
        <button
          className="relative w-24 h-24 bg-white rounded-2xl shadow-sm border border-rose-100 flex items-center justify-center cursor-pointer"
          onClick={() => charToShow && speakText(charToShow)}
          aria-label={`${charToShow} 발음 듣기`}
        >
          <span className="text-5xl font-extrabold text-slate-800 japanese-font">
            {charToShow}
          </span>
          <span className="absolute bottom-1 right-2 text-slate-300">
            <i className="fa-solid fa-volume-high text-xs"></i>
          </span>
        </button>
      </div>

      {/* Romaji / stroke info */}
      <div className="mt-2">
        <h3 className="text-xl font-bold text-rose-600 japanese-font">{item.r}</h3>
        <p className="text-[10px] text-slate-400">
          획수: {item.strokes}획 | 한국어 발음: &apos;{item.ko}&apos;
        </p>
      </div>

      {/* Mini trace canvas */}
      <div className="w-full bg-white rounded-xl border border-orange-100 p-2 mt-3 shadow-inner relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="text-8xl font-black font-serif select-none japanese-font">
            {charToShow}
          </span>
        </div>
        <canvas
          ref={miniCanvasRef}
          className="w-full h-28 bg-transparent relative z-10 cursor-crosshair rounded-lg"
        />
        <div className="flex justify-between items-center mt-1.5 relative z-20">
          <span className="text-[9px] text-slate-400">
            <i className="fa-solid fa-info-circle mr-1"></i>마우스/터치로 획을 그리세요
          </span>
          <button
            onClick={clearCanvas}
            className="px-2 py-0.5 text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition font-bold"
          >
            지우기
          </button>
        </div>
      </div>
    </div>
  );
}
