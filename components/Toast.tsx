"use client";

import { useEffect, useState } from "react";
import type { ToastType } from "@/lib/types";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastMessage | null;
}

export default function Toast({ toast }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  const iconBgClass =
    toast.type === "success"
      ? "bg-emerald-500"
      : toast.type === "error"
      ? "bg-rose-500"
      : "bg-sky-500";

  const iconClass =
    toast.type === "success"
      ? "fa-circle-check"
      : toast.type === "error"
      ? "fa-triangle-exclamation"
      : "fa-circle-info";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl transition-all duration-300 text-xs max-w-xs ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`w-6 h-6 ${iconBgClass} rounded-lg flex items-center justify-center text-xs text-white shrink-0`}
      >
        <i className={`fa-solid ${iconClass}`}></i>
      </div>
      <p className="font-bold text-white leading-normal">{toast.message}</p>
    </div>
  );
}
