import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinQ Backoffice",
  description: "FinQ 운영 지표 관리자 대시보드",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
