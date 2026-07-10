import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오이시이 일본어 - 맛있는 일본어 공부방 & 스마트 출석부",
  description:
    "히라가나/가타카나 정밀 트레이싱 학습부터 Notion 기반 주간 출석부까지, 하나의 환경에서 운용하는 통합 일본어 학습 앱입니다.",
};

export const viewport: Viewport = {
  themeColor: "#f43f5e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="bg-slate-50">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-slate-50 text-slate-800 min-h-screen flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
