"use client";

import { useEffect } from "react";

// ──────────────────────────────────────────────
// 사용 방법:
// 1. https://www.google.com/adsense 에서 계정 신청
// 2. 승인 후 Publisher ID (ca-pub-XXXXXXXXXXXXXXXX) 발급
// 3. 아래 YOUR_PUBLISHER_ID 와 YOUR_AD_SLOT_ID 를 교체
// ──────────────────────────────────────────────

const PUBLISHER_ID = "ca-pub-2913433601964431";
const AD_SLOT     = "YOUR_AD_SLOT_ID";           // ← 광고 단위 만든 후 교체 필요

export default function AdUnit({ style }) {
  const isReady = !PUBLISHER_ID.includes("YOUR") && !AD_SLOT.includes("YOUR");

  useEffect(() => {
    if (!isReady) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [isReady]);

  // Publisher ID 또는 슬롯 ID 미설정 시 빈 박스 렌더 (레이아웃 확인용, 에러 방지)
  if (!isReady) {
    return (
      <div style={{
        width: "100%", maxWidth: 728, margin: "0 auto",
        height: 90, borderRadius: 8,
        background: "rgba(255,255,255,0.03)",
        border: "1px dashed rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#334155", fontSize: 12,
        ...style,
      }}>
        광고 영역 (광고 단위 설정 후 활성화)
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
