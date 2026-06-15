import "./globals.css";

export const metadata = {
  title: "무료 직무 인성검사 | 200문항 AI 분석",
  description:
    "취업 준비생을 위한 무료 인성검사. 200문항, 9개 역량 척도, AI 기반 결과 리포트. 거짓말 척도, 강점/약점 분석 포함.",
  keywords: "인성검사, 취업 인성검사, 무료 인성검사, 직무 적성검사, AI 인성분석",
  openGraph: {
    title: "무료 직무 인성검사 | 200문항 AI 분석",
    description: "취업 준비생을 위한 무료 인성검사. AI가 강점·약점·직무 적합도를 분석해드립니다.",
    type: "website",
    locale: "ko_KR",
  },
};

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
      <body>{children}</body>
    </html>
  );
}
