import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "무료 직무 인성검사 | 200문항 AI 분석",
  description:
    "취업 준비생을 위한 무료 인성검사. 200문항, 9개 역량 척도, 거짓말 척도, 강점/약점 분석 포함.",
  keywords: "인성검사, 취업 인성검사, 무료 인성검사, 직무 적성검사, 인성검사 연습",
  openGraph: {
    title: "무료 직무 인성검사 | 200문항 분석",
    description: "취업 준비생을 위한 무료 인성검사. 강점·약점·직무 적합도를 분석해드립니다.",
    type: "website",
    locale: "ko_KR",
  },
};

// AdSense Publisher ID — 승인 후 아래 값을 교체하세요
const PUBLISHER_ID = "ca-pub-YOUR_PUBLISHER_ID";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* AdSense 스크립트 — Publisher ID 교체 후 활성화 */}
        {!PUBLISHER_ID.includes("YOUR") && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
