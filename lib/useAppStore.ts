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
  const defaultConfig: NotionConfig = {
    apiKey: "",
    dbId: "",
    proxy: "https://api.allorigins.win/raw?url=",
  };

  const [notionConfig, setNotionConfig] = useState<NotionConfig>(defaultConfig);

  useEffect(() => {
    setNotionConfig(getLS<NotionConfig>("notionConfig", defaultConfig));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback((config: NotionConfig) => {
    setNotionConfig(config);
    setLS("notionConfig", config);
  }, []);

  const clear = useCallback(() => {
    const reset: NotionConfig = {
      apiKey: "",
      dbId: "",
      proxy: "https://api.allorigins.win/raw?url=",
    };
    setNotionConfig(reset);
    localStorage.removeItem("notionConfig");
  }, []);

  return { notionConfig, save, clear };
}

export function useUsersData() {
  const [usersData, setUsersData] = useState<UserData[]>([]);

  useEffect(() => {
    setUsersData(getLS<UserData[]>("localUsersData", defaultUsers));
  }, []);

  const persist = useCallback((data: UserData[]) => {
    setUsersData(data);
    setLS("localUsersData", data);
  }, []);

  return { usersData, setUsersData: persist };
}

export function useNoticesData() {
  const [noticesData, setNoticesData] = useState<NoticeData[]>([]);

  useEffect(() => {
    setNoticesData(getLS<NoticeData[]>("localNoticesData", defaultNotices));
  }, []);

  const persist = useCallback((data: NoticeData[]) => {
    setNoticesData(data);
    setLS("localNoticesData", data);
  }, []);

  return { noticesData, setNoticesData: persist };
}
