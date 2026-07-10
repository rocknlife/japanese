"use client";

import type { TabId } from "@/lib/types";

interface FooterProps {
  onTabChange: (tab: TabId) => void;
  onOpenInfoModal: () => void;
  onResetProgress: () => void;
}

export default function Footer({
  onTabChange,
  onOpenInfoModal,
  onResetProgress,
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white text-sm font-bold japanese-font">
            お
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-200">
              오이시이 일본어 &amp; 스마트 주간 출석 매니저
            </p>
            <p className="text-[8px] text-slate-500">
              Copyright &copy; 2026. All rights reserved.
            </p>
          </div>
        </div>
        <div className="flex space-x-4 text-[10px]">
          <button
            onClick={onOpenInfoModal}
            className="hover:text-slate-200 transition"
          >
            앱 정보
          </button>
          <button
            onClick={() => onTabChange("chart")}
            className="hover:text-slate-200 transition"
          >
            문자학습
          </button>
          <button
            onClick={() => onTabChange("attendance")}
            className="hover:text-slate-200 transition"
          >
            출석부
          </button>
          <button
            onClick={onResetProgress}
            className="text-rose-500 hover:text-rose-400 transition"
          >
            학습 통계 초기화
          </button>
        </div>
      </div>
    </footer>
  );
}
