import type { Metadata } from "next";
import { cookies } from "next/headers";
import SiteHeader from "@/app/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heimdallr — 자율 모의 침투 테스트",
  description:
    "ARTEX 컨셉을 계승한 방어 중심 자율 모의 침투 테스트 + 사이버 보안 지식 축적 시스템",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale =
    cookieStore.get("heimdallr_locale")?.value === "en"
      ? "en"
      : cookieStore.get("heimdallr_locale")?.value === "zh"
        ? "zh"
        : cookieStore.get("heimdallr_locale")?.value === "ja"
          ? "ja"
          : "ko";

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
