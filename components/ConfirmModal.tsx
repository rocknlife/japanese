"use client";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-100">
        <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center text-lg mb-3">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 className="text-sm font-bold text-slate-800">주의 및 안내 확인</h3>
        <p className="text-xs text-slate-500 mt-1 leading-normal">{message}</p>
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition text-xs shadow-sm"
          >
            실행하기
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition text-xs"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
