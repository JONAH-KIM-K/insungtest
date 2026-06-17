import Script from "next/script";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://insungtest.vercel.app"),
  title: "무료 직무 인성검사 | 200문항 분석",
  description:
    "취업 준비생을 위한 무료 인성검사. 200문항, 9개 역량 척도, 거짓말 척도, 응답 일관성 검사, 강점/약점 분석 포함. 회원가입 없이 바로 시작.",
  keywords: "인성검사, 취업 인성검사, 무료 인성검사, 인성검사 연습, 직무 적성검사, 자소서, 면접 준비",
  openGraph: {
    title: "무료 직무 인성검사 | 200문항 분석",
    description: "취업 준비생을 위한 무료 인성검사. 강점·약점·직무 적합도를 분석해드립니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://insungtest.vercel.app",
  },
  // 검색엔진 소유권 확인 — 가입 후 발급된 코드로 교체하세요
  verification: {
    google: "google-site-verification=Vyw0xCH4Ikp71oKbi7aYkH0trJBQpeLoNDTFBKjbr7w", // Google Search Console에서 발급
    other: {
      "naver-site-verification": "NAVER_VERIFICATION_CODE", // 네이버 서치어드바이저에서 발급
    },
  },
};

// AdSense Publisher ID — 승인 후 아래 값을 교체하세요
const PUBLISHER_ID = "ca-pub-2913433601964431";

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
        {/* AdSense 스크립트 — beforeInteractive로 정적 HTML에 포함시켜 크롤러가 인식 가능하게 함 */}
        {!PUBLISHER_ID.includes("YOUR") && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
