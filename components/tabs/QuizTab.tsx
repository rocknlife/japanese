"use client";

import { useState, useCallback, useEffect } from "react";
import type { KanaItem, ScriptType, QuizType } from "@/lib/types";
import { allKanaList } from "@/lib/kanaData";
import { speakText } from "@/lib/utils";

interface QuizTabProps {
  masteredKanas: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickChoices(correct: KanaItem, pool: KanaItem[]): KanaItem[] {
  const others = shuffle(pool.filter((x) => x.h !== correct.h)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function QuizTab({ masteredKanas }: QuizTabProps) {
  const [quizType, setQuizType] = useState<QuizType>("kana_to_romaji");
  const [scriptType, setScriptType] = useState<ScriptType>("hiragana");
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);

  const [question, setQuestion] = useState<KanaItem | null>(null);
  const [choices, setChoices] = useState<KanaItem[]>([]);
  const [answered, setAnswered] = useState<KanaItem | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [started, setStarted] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const pool = onlyUnmastered
    ? allKanaList.filter((x) => !masteredKanas.includes(x.h ?? ""))
    : allKanaList;

  const generateQuestion = useCallback(() => {
    const available = pool.length >= 4 ? pool : allKanaList;
    const correct = available[Math.floor(Math.random() * available.length)];
    const c = pickChoices(correct, available);
    setQuestion(correct);
    setChoices(c);
    setAnswered(null);
    setResultMessage(null);
  }, [pool]);

  useEffect(() => {
    if (started) generateQuestion();
  }, [started, generateQuestion]);

  const handleStart = () => {
    setScore(0);
    setTotal(0);
    setCombo(0);
    setMaxCombo(0);
    setStarted(true);
  };

  const handleAnswer = (choice: KanaItem) => {
    if (answered) return;
    setAnswered(choice);
    setTotal((t) => t + 1);
    const charToSpeak = scriptType === "hiragana" ? question?.h : question?.k;
    if (choice.h === question?.h) {
      setScore((s) => s + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      const messages = [
        "정답입니다!",
        "완벽해요!",
        "훌륭합니다!",
        "대단해요!",
        combo >= 4 ? `${combo + 1}연속 정답! 완벽합니다!` : "맞았어요!",
      ];
      setResultMessage(messages[Math.min(combo, messages.length - 1)]);
      if (charToSpeak) speakText(charToSpeak);
    } else {
      setCombo(0);
      setResultMessage(`오답! 정답은 '${question?.r}'(${question?.ko}) 입니다.`);
    }
  };

  const handleNext = () => {
    generateQuestion();
  };

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  if (!started) {
    return (
      <section>
        <div className="max-w-md mx-auto py-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl text-rose-500 mx-auto">
              <i className="fa-solid fa-gamepad"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">퀴즈 모드</h2>
              <p className="text-xs text-slate-500 mt-1">가나 문자를 얼마나 기억하고 있나요?</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 font-bold mb-1.5 text-left">퀴즈 유형</p>
                <div className="bg-slate-100 p-1 rounded-xl flex">
                  <button
                    onClick={() => setQuizType("kana_to_romaji")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${quizType === "kana_to_romaji" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}
                  >
                    가나 → 로마자
                  </button>
                  <button
                    onClick={() => setQuizType("food_to_meaning")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${quizType === "food_to_meaning" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}
                  >
                    단어 → 의미
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold mb-1.5 text-left">문자 표기</p>
                <div className="bg-slate-100 p-1 rounded-xl flex">
                  {(["hiragana", "katakana"] as ScriptType[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setScriptType(s)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${scriptType === s ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}
                    >
                      {s === "hiragana" ? "히라가나" : "가타카나"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">미마스터 문자만</span>
                <button
                  onClick={() => setOnlyUnmastered((v) => !v)}
                  className={`w-10 h-5 rounded-full transition-all ${onlyUnmastered ? "bg-rose-500" : "bg-slate-200"}`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${onlyUnmastered ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            </div>
            <button
              onClick={handleStart}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl transition text-sm shadow-md shadow-rose-200"
            >
              <i className="fa-solid fa-play mr-2"></i>퀴즈 시작하기
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "정답", value: `${score}`, icon: "fa-check", color: "text-emerald-600" },
          { label: "총문제", value: `${total}`, icon: "fa-list", color: "text-slate-700" },
          { label: "정답률", value: `${accuracy}%`, icon: "fa-percent", color: "text-blue-600" },
          { label: "콤보", value: `${combo}`, icon: "fa-fire", color: "text-orange-500" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
            <i className={`fa-solid ${icon} ${color} text-lg`}></i>
            <p className={`text-base font-black ${color} mt-1`}>{value}</p>
            <p className="text-[10px] text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Quiz card */}
      {question && (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] text-slate-400 mb-3 font-bold uppercase">
              {quizType === "kana_to_romaji" ? "아래 문자의 로마자 표기는?" : "아래 문자와 연결된 음식 단어는?"}
            </p>
            <button
              onClick={() => {
                const c = scriptType === "hiragana" ? question.h : question.k;
                if (c) speakText(c);
              }}
              className="text-8xl font-black japanese-font text-slate-800 mx-auto block w-32 h-32 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center justify-center hover:bg-rose-100 transition"
            >
              {scriptType === "hiragana" ? question.h : question.k}
            </button>
            {resultMessage && (
              <p
                className={`text-sm font-bold mt-3 ${
                  answered?.h === question.h ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {resultMessage}
              </p>
            )}
          </div>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-3">
            {choices.map((choice) => {
              let style =
                "bg-white border border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50/40";
              if (answered) {
                if (choice.h === question.h) {
                  style = "bg-emerald-500 border-emerald-500 text-white shadow-sm";
                } else if (choice.h === answered.h) {
                  style = "bg-rose-100 border-rose-300 text-rose-700";
                } else {
                  style = "bg-slate-50 border-slate-100 text-slate-300";
                }
              }
              return (
                <button
                  key={choice.h}
                  onClick={() => handleAnswer(choice)}
                  className={`py-3 px-4 rounded-2xl border font-bold text-sm transition ${style}`}
                >
                  {quizType === "kana_to_romaji" ? (
                    <span>{choice.r} <span className="text-[10px] opacity-70">({choice.ko})</span></span>
                  ) : (
                    <span className="japanese-font">{choice.food?.name ?? choice.r}</span>
                  )}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="flex gap-3">
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition text-sm shadow-md shadow-rose-200"
              >
                <i className="fa-solid fa-arrow-right mr-2"></i>다음 문제
              </button>
              <button
                onClick={() => {
                  setStarted(false);
                  setAnswered(null);
                  setQuestion(null);
                }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition text-sm"
              >
                <i className="fa-solid fa-stop mr-1"></i>종료
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
