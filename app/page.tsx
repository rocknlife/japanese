"use client";

import { useState, useCallback, useRef } from "react";
import type { TabId, NoticeData } from "@/lib/types";
import {
  useMasteredKanas,
  useNotionConfig,
  useUsersData,
  useNoticesData,
} from "@/lib/useAppStore";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast, { type ToastMessage } from "@/components/Toast";
import InfoModal from "@/components/InfoModal";
import NotionModal from "@/components/NotionModal";

import KanaChartTab from "@/components/tabs/KanaChartTab";
import FoodVocabTab from "@/components/tabs/FoodVocabTab";
import DrawingPracticeTab from "@/components/tabs/DrawingPracticeTab";
import QuizTab from "@/components/tabs/QuizTab";
import NoticeBoardTab from "@/components/tabs/NoticeBoardTab";
import AttendanceTab from "@/components/tabs/AttendanceTab";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>("chart");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastIdRef = useRef(0);

  const { masteredKanas, toggle: toggleMastered, reset: resetMastered } = useMasteredKanas();
  const { notionConfig, save: saveNotionConfig, clear: clearNotionConfig } = useNotionConfig();
  const { usersData, setUsersData } = useUsersData();
  const { noticesData, setNoticesData, noticeDbId } = useNoticesData();

  const showToast = useCallback((message: string, type: ToastMessage["type"] = "success") => {
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, message, type });
  }, []);

  const handleAddNotice = useCallback(
    (n: NoticeData) => {
      setNoticesData([n, ...noticesData]);
      showToast("알림이 정상 등록되었습니다.", "success");
    },
    [noticesData, setNoticesData, showToast]
  );

  const handleDeleteNotice = useCallback(
    (id: string) => {
      setNoticesData(noticesData.filter((n) => n.id !== id));
      showToast("알림글이 삭제되었습니다.", "info");
    },
    [noticesData, setNoticesData, showToast]
  );

  const isNotionConnected = !!(notionConfig.apiKey && notionConfig.dbId);

  return (
    <>
      <Header
        activeTab={activeTab}
        masteredCount={masteredKanas.length}
        notionConnected={isNotionConnected}
        onTabChange={setActiveTab}
        onOpenNotionModal={() => setShowNotionModal(true)}
        onOpenInfoModal={() => setShowInfoModal(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5">
        {activeTab === "chart" && (
          <KanaChartTab
            masteredKanas={masteredKanas}
            onToggleMastery={toggleMastered}
            onShowToast={showToast}
          />
        )}
        {activeTab === "food" && <FoodVocabTab masteredKanas={masteredKanas} />}
        {activeTab === "drawing" && (
          <DrawingPracticeTab
            masteredKanas={masteredKanas}
            onToggleMastery={toggleMastered}
            onShowToast={showToast}
          />
        )}
        {activeTab === "quiz" && <QuizTab masteredKanas={masteredKanas} />}
        {activeTab === "notice" && (
          <NoticeBoardTab
            noticesData={noticesData}
            usersData={usersData}
            notionApiKey={notionConfig.apiKey}
            notionDbId={noticeDbId}
            onAddNotice={handleAddNotice}
            onDeleteNotice={handleDeleteNotice}
            onSyncNotices={setNoticesData}
          />
        )}
        {activeTab === "attendance" && (
          <AttendanceTab
            usersData={usersData}
            notionConfig={notionConfig}
            onUsersChange={setUsersData}
            onNotionConfigSave={saveNotionConfig}
            onNotionConfigClear={clearNotionConfig}
            showToast={showToast}
          />
        )}
      </main>

      <Footer
        onTabChange={setActiveTab}
        onOpenInfoModal={() => setShowInfoModal(true)}
        onResetProgress={() => {
          resetMastered();
          showToast("학습 진도가 초기화되었습니다.", "info");
        }}
      />

      {/* Global modals */}
      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
      {showNotionModal && (
        <NotionModal
          config={notionConfig}
          onSave={(cfg) => {
            saveNotionConfig(cfg);
            showToast("Notion 설정이 저장되었습니다.", "success");
            setShowNotionModal(false);
          }}
          onClear={() => {
            clearNotionConfig();
            showToast("Notion 연동이 해제되었습니다. 로컬 모드로 작동합니다.", "info");
            setShowNotionModal(false);
          }}
          onClose={() => setShowNotionModal(false)}
          onShowToast={showToast}
        />
      )}

      {/* Toast notification */}
      <Toast toast={toast} />
    </>
  );
}
