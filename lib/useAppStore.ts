"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  NotionConfig,
  UserData,
  NoticeData,
} from "./types";
import { defaultNotices, defaultUsers } from "./kanaData";

function getLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function useMasteredKanas() {
  const [masteredKanas, setMasteredKanas] = useState<string[]>([]);

  useEffect(() => {
    setMasteredKanas(getLS<string[]>("masteredKanas", []));
  }, []);

  const toggle = useCallback((hChar: string) => {
    setMasteredKanas((prev) => {
      const next = prev.includes(hChar)
        ? prev.filter((x) => x !== hChar)
        : [...prev, hChar];
      setLS("masteredKanas", next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setMasteredKanas([]);
    localStorage.removeItem("masteredKanas");
  }, []);

  return { masteredKanas, toggle, reset };
}

export function useNotionConfig() {
  // Fallback to env vars when localStorage has no saved config
  const envDefault: NotionConfig = {
    apiKey: process.env.NEXT_PUBLIC_NOTION_API_KEY ?? "",
    dbId: process.env.NEXT_PUBLIC_NOTION_DB_ID ?? "",
  };

  const [notionConfig, setNotionConfig] = useState<NotionConfig>(envDefault);

  useEffect(() => {
    const saved = getLS<NotionConfig | null>("notionConfig", null);
    // Use saved config only if it actually has values; otherwise fall back to env
    if (saved && (saved.apiKey || saved.dbId)) {
      setNotionConfig(saved);
    } else {
      setNotionConfig(envDefault);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback((config: NotionConfig) => {
    setNotionConfig(config);
    setLS("notionConfig", config);
  }, []);

  const clear = useCallback(() => {
    // Remove localStorage and fall back to env vars
    localStorage.removeItem("notionConfig");
    setNotionConfig({
      apiKey: process.env.NEXT_PUBLIC_NOTION_API_KEY ?? "",
      dbId: process.env.NEXT_PUBLIC_NOTION_DB_ID ?? "",
    });
  }, []);

  return { notionConfig, save, clear };
}

export function useUsersData() {
  const [usersData, setUsersData] = useState<UserData[]>([]);

  useEffect(() => {
    // 항상 localStorage 캐시를 초기값으로 표시하고, Notion 동기화 시 덮어씀
    setUsersData(getLS<UserData[]>("localUsersData", defaultUsers));
  }, []);

  const persist = useCallback((data: UserData[]) => {
    setUsersData(data);
    setLS("localUsersData", data);
  }, []);

  return { usersData, setUsersData: persist };
}

// 알림장 전용 Notion DB ID — 환경변수가 클라이언트 번들에 인라인되지 않는 경우를 대비해 직접 주입
const NOTICE_DB_ID =
  process.env.NEXT_PUBLIC_NOTION_NOTICE_DB_ID ?? "39b2b270472280a186fcec1129b557b0";

export function useNoticesData() {
  const [noticesData, setNoticesData] = useState<NoticeData[]>([]);

  useEffect(() => {
    // localStorage 캐시를 초기값으로 표시 — Notion 동기화 시 덮어씀
    setNoticesData(getLS<NoticeData[]>("localNoticesData", defaultNotices));
  }, []);

  const persist = useCallback((data: NoticeData[]) => {
    setNoticesData(data);
    setLS("localNoticesData", data);
  }, []);

  return { noticesData, setNoticesData: persist, noticeDbId: NOTICE_DB_ID };
}
