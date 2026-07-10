"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserData, NotionConfig } from "@/lib/types";
import { getMondayOfDate, getWeekDates, getAttendanceStatus } from "@/lib/utils";
import {
  fetchUsersFromNotion,
  createUserInNotion,
  updateAttendanceInNotion,
  archivePageInNotion,
} from "@/lib/notionClient";
import ConfirmModal from "@/components/ConfirmModal";
import NotionModal from "@/components/NotionModal";

interface AttendanceTabProps {
  usersData: UserData[];
  notionConfig: NotionConfig;
  onUsersChange: (users: UserData[]) => void;
  onNotionConfigSave: (cfg: NotionConfig) => void;
  onNotionConfigClear: () => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const DAYS_SHORT = ["월", "화", "수", "목", "금", "토", "일"];

export default function AttendanceTab({
  usersData,
  notionConfig,
  onUsersChange,
  onNotionConfigSave,
  onNotionConfigClear,
  showToast,
}: AttendanceTabProps) {
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOfDate(new Date()));
  const [syncing, setSyncing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showNotion, setShowNotion] = useState(false);
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");

  const weekDates = getWeekDates(weekStart);

  const navigateWeek = (dir: -1 | 0 | 1) => {
    if (dir === 0) {
      setWeekStart(getMondayOfDate(new Date()));
    } else {
      setWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + dir * 7);
        return d;
      });
    }
  };

  const cycleAttendance = useCallback(
    async (userIndex: number, targetDate: string) => {
      const user = usersData[userIndex];
      const currentStatus = getAttendanceStatus(user, targetDate);
      const updated = user.attendance.filter((item) => !item.startsWith(targetDate));
      let nextStatus: "none" | "present" | "absent" = "none";

      if (currentStatus === "none") {
        updated.push(`${targetDate}:Y`);
        nextStatus = "present";
      } else if (currentStatus === "present") {
        updated.push(`${targetDate}:N`);
        nextStatus = "absent";
      }

      const newUsers = usersData.map((u, i) =>
        i === userIndex ? { ...u, attendance: updated } : u
      );
      onUsersChange(newUsers);

      const statusLabels = { present: "참석", absent: "불참", none: "미체크" };
      const label = statusLabels[nextStatus];

      // Notion 우선: pageId 없으면 Notion 등록이 안 된 사원이므로 로컬 저장
      if (!user.pageId) {
        showToast(`[로컬 저장] ${user.name}: ${targetDate} [${label}]`, "success");
        return;
      }

      try {
        await updateAttendanceInNotion(notionConfig, user.pageId, updated);
        showToast(`${user.name}: ${targetDate} [${label}] — Notion 동기화 완료`, "success");
      } catch {
        showToast("Notion 전송 실패. 화면에는 반영됐으나 DB 저장은 실패했습니다.", "error");
      }
    },
    [usersData, notionConfig, onUsersChange, showToast]
  );

  const loadFromNotion = useCallback(async () => {
    setSyncing(true);
    const hasNotion = notionConfig.apiKey && notionConfig.dbId;
    if (!hasNotion) {
      setSyncing(false);
      return;
    }

    try {
      const fetched = await fetchUsersFromNotion(notionConfig);
      onUsersChange(fetched);
      showToast("Notion DB와 동기화되었습니다.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      showToast(`Notion API 통신 실패: ${msg}`, "error");
    } finally {
      setSyncing(false);
    }
  }, [notionConfig, onUsersChange, showToast]);

  // Auto-sync from Notion when tab mounts and connection is available
  useEffect(() => {
    if (notionConfig.apiKey && notionConfig.dbId) {
      loadFromNotion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const idVal = empId.trim();
    const nameVal = empName.trim();
    if (!idVal || !nameVal) return;
    if (usersData.some((u) => u.id === idVal)) {
      showToast(`이미 등록된 사번입니다: ${idVal}`, "error");
      return;
    }

    const isNotionReady = notionConfig.apiKey && notionConfig.dbId;

    if (isNotionReady) {
      showToast("Notion에 사원 생성 중...", "info");
      try {
        await createUserInNotion(notionConfig, idVal, nameVal);
        setEmpId("");
        setEmpName("");
        showToast(`${nameVal} 사원이 Notion DB에 등록되었습니다.`, "success");
        await loadFromNotion();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "알 수 없는 오류";
        showToast(`Notion 등록 실패: ${msg}`, "error");
      }
    } else {
      onUsersChange([...usersData, { id: idVal, name: nameVal, attendance: [] }]);
      showToast(`[로컬 저장] ${nameVal} 사원이 등록되었습니다.`, "success");
      setEmpId("");
      setEmpName("");
    }
  };

  const deleteUser = useCallback(
    async (index: number) => {
      const user = usersData[index];
      if (!user.pageId) {
        // Notion에 등록되지 않은 로컬 전용 사원
        const newUsers = usersData.filter((_, i) => i !== index);
        onUsersChange(newUsers);
        showToast(`[로컬 삭제] ${user.name} 사원이 삭제되었습니다.`, "success");
        return;
      }
      try {
        await archivePageInNotion(notionConfig, user.pageId);
        showToast(`${user.name} 사원이 Notion DB에서 삭제되었습니다.`, "success");
        await loadFromNotion();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "알 수 없는 오류";
        showToast(`Notion 삭제 요청 실패: ${msg}`, "error");
      }
    },
    [usersData, notionConfig, onUsersChange, showToast, loadFromNotion]
  );

  const isConnected = !!(notionConfig.apiKey && notionConfig.dbId);

  return (
    <section className="space-y-4">
      {/* Modals */}
      {confirmDelete !== null && (
        <ConfirmModal
          message={`'${usersData[confirmDelete]?.name} (${usersData[confirmDelete]?.id})' 사원을 영구히 삭제하시겠습니까?`}
          onConfirm={() => {
            deleteUser(confirmDelete);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {showNotion && (
        <NotionModal
          config={notionConfig}
          onSave={(cfg) => {
            onNotionConfigSave(cfg);
            setShowNotion(false);
            loadFromNotion();
          }}
          onClear={() => {
            onNotionConfigClear();
            setShowNotion(false);
          }}
          onClose={() => setShowNotion(false)}
          onShowToast={showToast}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${isConnected ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
            {isConnected ? "NOTION CONNECTED" : "LOCAL SIMULATED MODE"}
          </div>
          <p className="text-[10px] text-slate-400">
            {isConnected ? `DB ID: ${notionConfig.dbId.substring(0, 8)}...` : "Notion 설정 미등록"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNotion(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-[10px] rounded-xl transition shadow-sm"
          >
            <i className="fa-solid fa-gear text-[9px]"></i>Notion 설정
          </button>
          <button
            onClick={loadFromNotion}
            disabled={syncing || !isConnected}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-[10px] rounded-xl transition shadow-sm disabled:opacity-40"
          >
            <i className={`fa-solid fa-rotate-right text-[9px] ${syncing ? "animate-spin" : ""}`}></i>동기화
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: registration + directory */}
        <div className="space-y-3">
          {/* Register form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 bg-violet-100 text-violet-600 rounded-md flex items-center justify-center">
                <i className="fa-solid fa-user-plus text-[9px]"></i>
              </span>
              사원 등록
            </h3>
            <form onSubmit={registerUser} className="space-y-2">
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="사번 (예: M005)"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <input
                type="text"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                placeholder="이름 (예: 김민준)"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <button
                type="submit"
                className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl transition text-[10px] shadow-sm"
              >
                등록하기
              </button>
            </form>
          </div>

          {/* Directory */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 bg-slate-100 text-slate-600 rounded-md flex items-center justify-center">
                <i className="fa-solid fa-users text-[9px]"></i>
              </span>
              사원 목록
              <span className="ml-auto text-[10px] text-slate-400 font-bold">{usersData.length}명</span>
            </h3>
            {usersData.length === 0 ? (
              <div className="text-center py-4 text-[10px] text-slate-400 border border-dashed border-slate-100 rounded-xl">
                등록된 사원이 없습니다.
              </div>
            ) : (
              <div className="space-y-1.5">
                {usersData.map((user, idx) => {
                  const totalPresent = user.attendance.filter((x) => !x.endsWith(":N")).length;
                  const totalAbsent = user.attendance.filter((x) => x.endsWith(":N")).length;
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-[11px] border border-slate-100 gap-1.5 hover:bg-slate-100/60 transition"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-grow">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0"></span>
                        <span className="font-bold text-slate-700 truncate">{user.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0">({user.id})</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex flex-col text-[8px] leading-tight items-end">
                          <span className="text-emerald-600 font-extrabold">참석 {totalPresent}회</span>
                          <span className="text-rose-500 font-extrabold">불참 {totalAbsent}회</span>
                        </div>
                        <button
                          onClick={() => setConfirmDelete(idx)}
                          className="p-1 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                          title="사원 삭제"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: weekly attendance table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-black text-slate-800">주간 출석부</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  기간: {weekDates[0]} (월) ~ {weekDates[6]} (일)
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigateWeek(-1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition text-xs"
                >
                  <i className="fa-solid fa-chevron-left text-[9px]"></i>
                </button>
                <button
                  onClick={() => navigateWeek(0)}
                  className="px-2.5 h-7 flex items-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition text-[10px]"
                >
                  이번 주
                </button>
                <button
                  onClick={() => navigateWeek(1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition text-xs"
                >
                  <i className="fa-solid fa-chevron-right text-[9px]"></i>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="p-3 text-left font-bold text-slate-600 sticky left-0 bg-slate-50 z-10 min-w-[100px]">
                      사원
                    </th>
                    {DAYS_SHORT.map((day, i) => {
                      const dateObj = new Date(weekDates[i]);
                      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
                      const d = String(dateObj.getDate()).padStart(2, "0");
                      const isWeekend = i >= 5;
                      return (
                        <th
                          key={day}
                          className={`p-2 text-center font-bold ${isWeekend ? "text-rose-400" : "text-slate-600"}`}
                        >
                          {day}
                          <br />
                          <span className="text-[9px] text-slate-400 font-mono">{m}/{d}</span>
                        </th>
                      );
                    })}
                    <th className="p-2 text-center font-bold text-slate-600 bg-slate-50">합계</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400 font-bold text-xs">
                        <i className="fa-solid fa-users-slash text-xl mb-1.5 block text-slate-300"></i>
                        등록된 사원이 없습니다. 왼쪽에서 등록해 주세요.
                      </td>
                    </tr>
                  ) : (
                    usersData.map((user, uIdx) => {
                      const weeklyPresent = user.attendance.filter((item) => {
                        const d = item.split(":")[0];
                        return weekDates.includes(d) && !item.endsWith(":N");
                      }).length;
                      const weeklyAbsent = user.attendance.filter((item) => {
                        const d = item.split(":")[0];
                        return weekDates.includes(d) && item.endsWith(":N");
                      }).length;

                      return (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                          <td className="p-3 border-r border-slate-100 bg-white sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                            <div className="font-bold text-slate-800">{user.name}</div>
                            <div className="text-[9px] text-slate-400 font-mono">{user.id}</div>
                          </td>
                          {weekDates.map((date, i) => {
                            const status = getAttendanceStatus(user, date);
                            let btnStyle = "bg-slate-50 border-slate-200 text-slate-300 hover:bg-slate-100 hover:text-slate-400";
                            let icon = <i className="fa-solid fa-minus text-[10px]"></i>;
                            let title = "미체크 (클릭 시 참석)";
                            if (status === "present") {
                              btnStyle = "bg-emerald-500 border-emerald-500 text-white shadow-sm scale-105";
                              icon = <i className="fa-solid fa-check text-xs"></i>;
                              title = "참석 (클릭 시 불참)";
                            } else if (status === "absent") {
                              btnStyle = "bg-rose-500 border-rose-500 text-white shadow-sm scale-105";
                              icon = <i className="fa-solid fa-xmark text-xs"></i>;
                              title = "불참 (클릭 시 미체크)";
                            }
                            return (
                              <td key={date} className={`p-2.5 text-center border-r border-slate-50 ${i >= 5 ? "bg-slate-50/50" : ""}`}>
                                <button
                                  onClick={() => cycleAttendance(uIdx, date)}
                                  title={title}
                                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all transform active:scale-90 hover:scale-105 mx-auto ${btnStyle}`}
                                >
                                  {icon}
                                </button>
                              </td>
                            );
                          })}
                          <td className="p-2 text-center bg-slate-50/50">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[9px] px-1.5 py-0.5 rounded-lg bg-emerald-100/70 text-emerald-700 font-extrabold flex items-center gap-0.5">
                                <i className="fa-solid fa-circle-check text-[8px]"></i>{" "}
                                {weeklyPresent}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-lg bg-rose-100/70 text-rose-700 font-extrabold flex items-center gap-0.5">
                                <i className="fa-solid fa-circle-xmark text-[8px]"></i>{" "}
                                {weeklyAbsent}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
