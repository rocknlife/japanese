"use client";

interface InfoModalProps {
  onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModalProps) {
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
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-circle-info"></i>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              오이시이 일본어 &amp; 주간 출석부 안내
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
              히라가나/가타카나 정밀 트레이싱 학습부터, Notion 데이터베이스 기반의
              사원 주간 출석부 기능을 하나의 환경에서 원활하게 운용할 수 있도록
              설계된 통합 학습 앱입니다.
            </p>
          </div>
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            {[
              { title: "실시간 Notion API 동기화:", desc: "비밀키와 데이터베이스 ID 입력으로 노션에 실시간 상태가 업데이트됩니다." },
              { title: "주간 통합 출석 체크:", desc: "월요일부터 일요일까지의 일주일 상태를 펼쳐 사원 현황을 입체적으로 추적합니다." },
              { title: "강조식 일본어 푸드 단어 연상:", desc: "학습 글자가 음식 및 예문 안에서 입체적으로 강조 표시됩니다." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start">
                <span className="text-rose-500 mr-2 font-bold">✔</span>
                <p className="text-[10px]">
                  <strong>{title}</strong> {desc}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-1">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs"
            >
              확인했습니다
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
