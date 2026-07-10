"use client";

import type { TabId } from "@/lib/types";

const NAV_ITEMS: { id: TabId; icon: string; label: string }[] = [
  { id: "chart", icon: "fa-table-cells", label: "문자학습" },
  { id: "food", icon: "fa-utensils", label: "단어장" },
  { id: "drawing", icon: "fa-pen-nib", label: "따라쓰기" },
  { id: "quiz", icon: "fa-gamepad", label: "퀴즈" },
  { id: "notice", icon: "fa-clipboard-list", label: "알림장" },
  { id: "attendance", icon: "fa-calendar-check", label: "출석부" },
];

interface HeaderProps {
  activeTab: TabId;
  masteredCount: number;
  notionConnected: boolean;
  onTabChange: (tab: TabId) => void;
  onOpenNotionModal: () => void;
  onOpenInfoModal: () => void;
}

export default function Header({
  activeTab,
  masteredCount,
  notionConnected,
  onTabChange,
  onOpenNotionModal,
  onOpenInfoModal,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <button
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onTabChange("chart")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-rose-200 shrink-0">
            <span className="text-xl font-black japanese-font">お</span>
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent flex flex-col leading-none py-0.5">
              <span>오이시이</span>
              <span className="mt-0.5">일본어</span>
            </h1>
            <p className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5">
              Delicious Japanese
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAV_ITEMS.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === id
                  ? "text-rose-600 bg-rose-50 font-bold shadow-sm border border-rose-100/50"
                  : "text-slate-600 hover:text-rose-600 hover:bg-rose-50/50"
              }`}
            >
              <i className={`fa-solid ${icon} mr-1.5`}></i>
              {label}
            </button>
          ))}
        </nav>

        {/* Right indicators */}
        <div className="flex items-center space-x-2">
          <div className="bg-rose-50 border border-rose-100 px-2.5 py-1.5 rounded-xl text-[10px] flex items-center shadow-sm shrink-0">
            <i className="fa-solid fa-graduation-cap text-rose-500 mr-1.5"></i>
            <span className="font-bold text-slate-700">
              마스터:{" "}
              <span className="text-rose-600 font-black">{masteredCount}</span>
              /104
            </span>
          </div>
          <button
            onClick={onOpenNotionModal}
            className="p-2 text-rose-500 hover:text-rose-600 rounded-xl bg-rose-50/80 hover:bg-rose-50 transition shrink-0"
            title="Notion API 연동 설정"
          >
            <i
              className={`fa-solid fa-network-wired text-sm ${
                notionConnected
                  ? "text-emerald-500"
                  : "text-amber-500 animate-pulse"
              }`}
            ></i>
          </button>
          <button
            onClick={onOpenInfoModal}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition shrink-0"
          >
            <i className="fa-solid fa-circle-info text-base"></i>
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden flex border-t border-slate-100 overflow-x-auto">
        {NAV_ITEMS.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 min-w-0 py-2 flex flex-col items-center gap-0.5 text-[9px] font-bold transition shrink-0 ${
              activeTab === id
                ? "text-rose-600 border-t-2 border-rose-500"
                : "text-slate-400"
            }`}
          >
            <i className={`fa-solid ${icon} text-sm`}></i>
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
