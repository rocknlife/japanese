"use client";

import { useState, useEffect } from "react";
import type { NotionConfig } from "@/lib/types";

interface NotionModalProps {
  config: NotionConfig;
  onSave: (config: NotionConfig) => void;
  onClear: () => void;
  onClose: () => void;
  onShowToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function NotionModal({
  config,
  onSave,
  onClear,
  onClose,
  onShowToast,
}: NotionModalProps) {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [dbId, setDbId] = useState(config.dbId);
  const [proxy, setProxy] = useState(config.proxy);

  useEffect(() => {
    setApiKey(config.apiKey);
    setDbId(config.dbId);
    setProxy(config.proxy);
  }, [config]);

  const handleSave = () => {
    if (!apiKey.trim() || !dbId.trim()) {
      onShowToast("Notion API 키와 데이터베이스 ID를 모두 입력해주세요.", "error");
      return;
    }
    onSave({ apiKey: apiKey.trim(), dbId: dbId.trim(), proxy: proxy.trim() });
    onShowToast("Notion 설정이 정상적으로 저장되었습니다.", "success");
    onClose();
  };

  const handleClear = () => {
    onClear();
    setApiKey("");
    setDbId("");
    setProxy("https://api.allorigins.win/raw?url=");
    onShowToast("Notion 연동 해제. 로컬 시뮬레이션 브라우저 모드로 작동합니다.", "info");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl p-5 md:p-6 max-w-md w-full mx-4 shadow-2xl relative z-10 border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-full transition"
          aria-label="닫기"
        >
          <i className="fa-solid fa-xmark w-4 h-4 flex items-center justify-center"></i>
        </button>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-brands fa-notion"></i>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Notion API 데이터베이스 연동 설정
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
              Notion 통합 토큰 및 데이터베이스 ID를 등록해 데이터를 공유합니다.
              설정 전이나 빈 값일 경우 로컬 시뮬레이션 모드로 동작합니다.
            </p>
          </div>
          <div className="space-y-3 text-xs border-t border-slate-100 pt-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Notion Integration API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="secret_로 시작하는 토큰 입력..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-violet-500 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Notion Database ID
              </label>
              <input
                type="text"
                value={dbId}
                onChange={(e) => setDbId(e.target.value)}
                placeholder="32자리 데이터베이스 해시값 입력..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-violet-500 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                우회 CORS Proxy 서버 주소
              </label>
              <input
                type="text"
                value={proxy}
                onChange={(e) => setProxy(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-violet-500 transition text-slate-500 font-mono text-[9px]"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1.5">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition text-[11px] shadow-sm"
            >
              설정 저장 및 연동하기
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition text-[11px]"
            >
              연동 해제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
