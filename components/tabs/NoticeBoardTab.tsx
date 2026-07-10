"use client";

import { useState } from "react";
import type { NoticeData, NoticeType, NoticeFilter } from "@/lib/types";
import { formatNow } from "@/lib/utils";
import ConfirmModal from "@/components/ConfirmModal";

interface NoticeBoardTabProps {
  noticesData: NoticeData[];
  usersData: { id: string; name: string }[];
  onAddNotice: (n: NoticeData) => void;
  onDeleteNotice: (id: string) => void;
}

const FILTER_LABELS: { key: NoticeFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "notice", label: "공지사항" },
  { key: "homework", label: "과제" },
  { key: "share", label: "공유사항" },
];

const TYPE_CONFIG: Record<NoticeType, { badge: string; border: string; badgeText: string }> = {
  notice: { badge: "bg-sky-50 text-sky-700 border-sky-100", border: "border-sky-100", badgeText: "공지사항" },
  homework: { badge: "bg-emerald-50 text-emerald-700 border-emerald-100", border: "border-emerald-100", badgeText: "과제" },
  share: { badge: "bg-amber-50 text-amber-700 border-amber-100", border: "border-amber-100", badgeText: "공유사항" },
};

export default function NoticeBoardTab({
  noticesData,
  usersData,
  onAddNotice,
  onDeleteNotice,
}: NoticeBoardTabProps) {
  const [filter, setFilter] = useState<NoticeFilter>("all");
  const [category, setCategory] = useState<NoticeType>("notice");
  const [authorSelect, setAuthorSelect] = useState("custom");
  const [authorCustom, setAuthorCustom] = useState("");
  const [content, setContent] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const author = authorSelect === "custom" ? authorCustom.trim() : authorSelect;
    if (!author || !content.trim()) return;
    const now = formatNow();
    onAddNotice({
      id: "notice_" + Date.now(),
      type: category,
      author,
      content: content.trim(),
      createdAt: now,
    });
    setContent("");
    if (authorSelect === "custom") setAuthorCustom("");
  };

  const filtered =
    filter === "all" ? noticesData : noticesData.filter((n) => n.type === filter);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Delete confirm modal */}
      {confirmId && (
        <ConfirmModal
          message="해당 알림글을 영구히 삭제하시겠습니까?"
          onConfirm={() => {
            onDeleteNotice(confirmId);
            setConfirmId(null);
          }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Left: write form */}
      <div className="space-y-3">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h3 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 bg-sky-100 text-sky-600 rounded-md flex items-center justify-center">
              <i className="fa-solid fa-pen-to-square text-[9px]"></i>
            </span>
            알림 작성
          </h3>
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Category */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">카테고리</label>
              <div className="grid grid-cols-3 gap-1">
                {(["notice", "homework", "share"] as NoticeType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCategory(t)}
                    className={`py-1.5 text-[10px] font-bold rounded-lg border transition ${
                      category === t
                        ? TYPE_CONFIG[t].badge + " border-current"
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {TYPE_CONFIG[t].badgeText}
                  </button>
                ))}
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">작성자</label>
              <select
                value={authorSelect}
                onChange={(e) => setAuthorSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                <option value="custom">직접 입력 / 외부 작성자</option>
                {usersData.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.id})
                  </option>
                ))}
              </select>
              {authorSelect === "custom" && (
                <input
                  type="text"
                  value={authorCustom}
                  onChange={(e) => setAuthorCustom(e.target.value)}
                  placeholder="작성자 이름 입력..."
                  required
                  className="mt-1.5 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              )}
            </div>

            {/* Content */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="알림 내용을 입력해 주세요..."
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl transition text-xs shadow-sm"
            >
              <i className="fa-solid fa-paper-plane mr-1.5"></i>알림 등록
            </button>
          </form>
        </div>
      </div>

      {/* Right: notices stream */}
      <div className="lg:col-span-2 space-y-3">
        {/* Filter bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                filter === key
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-slate-400 font-bold">{filtered.length}건</span>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400 border border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
            <i className="fa-solid fa-folder-open text-2xl mb-2 block text-slate-300"></i>
            등록된 알림 사항이 없습니다. 알림을 가장 먼저 공유해 보세요!
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((notice) => {
              const cfg = TYPE_CONFIG[notice.type];
              return (
                <div
                  key={notice.id}
                  className={`p-4 rounded-xl border bg-white shadow-xs ${cfg.border} flex flex-col justify-between hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 border rounded-full font-bold ${cfg.badge}`}>
                        {cfg.badgeText}
                      </span>
                      <button
                        onClick={() => setConfirmId(notice.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 rounded transition"
                        title="알림 삭제"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-dashed border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-600">
                      <i className="fa-regular fa-user mr-1 text-[9px]"></i>
                      {notice.author}
                    </span>
                    <span>
                      <i className="fa-regular fa-clock mr-1 text-[9px]"></i>
                      {notice.createdAt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
