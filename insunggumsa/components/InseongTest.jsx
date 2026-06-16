"use client";

import { useState, useMemo, useCallback } from "react";
import { ALL_QUESTIONS, DIM_META } from "../lib/questions";
import { analyzeScores } from "../lib/analysis";
import AdUnit from "./AdUnit";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Welcome ───────────────────────────────────
function WelcomeScreen({ mode, setMode, onStart }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F2044 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Sans KR', sans-serif", padding: "24px",
    }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div style={{
          display: "inline-block",
          background: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.4)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 28,
          color: "#A5B4FC", fontSize: 12, letterSpacing: "0.08em", fontWeight: 600,
        }}>
          취업 준비용 무료 인성검사
        </div>

        <h1 style={{ color: "#F1F5F9", fontSize: 38, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
          직무 인성검사
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 15, margin: "0 0 40px", lineHeight: 1.7 }}>
          200문항 · 9개 역량 척도 · 무료<br />
          삼성, LG, CJ 등 대기업 인성검사 유형 반영
        </p>

        <div style={{ marginBottom: 36 }}>
          <p style={{ color: "#64748B", fontSize: 13, marginBottom: 14, fontWeight: 600, letterSpacing: "0.05em" }}>
            응답 방식 선택
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { key: "likert", label: "리커트 5점 척도", sub: "전혀 아니다 ~ 매우 그렇다" },
              { key: "yesno",  label: "예 / 아니요",    sub: "이분법적 판단" },
            ].map(({ key, label, sub }) => (
              <button key={key} onClick={() => setMode(key)} style={{
                flex: 1, padding: "16px 12px", borderRadius: 12, cursor: "pointer",
                border: mode === key ? "2px solid #6366F1" : "2px solid rgba(255,255,255,0.08)",
                background: mode === key ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                color: mode === key ? "#A5B4FC" : "#64748B",
                transition: "all 0.2s",
              }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
          {[{ icon: "📋", label: "200문항" }, { icon: "⏱", label: "약 20~30분" }, { icon: "🔒", label: "완전 무료" }].map(
            ({ icon, label }) => (
              <div key={label} style={{
                flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10,
                padding: "14px 8px", color: "#94A3B8", fontSize: 12,
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                {label}
              </div>
            )
          )}
        </div>

        <div style={{
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 10, padding: "12px 16px", marginBottom: 32,
          textAlign: "left", color: "#FCD34D", fontSize: 12, lineHeight: 1.7,
        }}>
          <strong>검사 안내</strong><br />
          정답은 없습니다. 솔직하게 응답할수록 더 정확한 결과가 나옵니다. 응답을 꾸미면 신뢰도 척도에서 감지됩니다.
        </div>

        <button onClick={onStart} style={{
          width: "100%", padding: "18px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #6366F1, #4F46E5)",
          color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
          fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 32,
        }}>
          검사 시작하기 →
        </button>

        {/* 광고: 시작 화면 하단 */}
        <AdUnit style={{ marginTop: 8 }} />
      </div>
    </div>
  );
}

// ── Question Navigator ────────────────────────
function QuestionNavigator({ shuffled, current, answers, onJump, onClose }) {
  const totalQ = shuffled.length;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#1E293B", borderRadius: 20, padding: "24px",
        width: "100%", maxWidth: 600, maxHeight: "85vh", overflow: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 700 }}>문항 현황</div>
            <div style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>
              응답 완료 {Object.keys(answers).length} / {totalQ}
              {" · "}
              <span style={{ color: "#F59E0B" }}>미응답 {totalQ - Object.keys(answers).length}문항</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8,
            color: "#94A3B8", fontSize: 18, cursor: "pointer", padding: "4px 10px",
          }}>✕</button>
        </div>

        {/* 범례 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          {[
            { color: "#6366F1", label: "현재 문항" },
            { color: "#10B981", label: "응답 완료" },
            { color: "#334155", label: "미응답" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
              <span style={{ color: "#64748B", fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* 문항 번호 격자 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {shuffled.map((q, idx) => {
            const isAnswered = answers[q.id] != null;
            const isCurrent = idx === current;
            return (
              <button key={idx} onClick={() => { onJump(idx); onClose(); }} style={{
                width: 36, height: 36, borderRadius: 8, border: "none",
                background: isCurrent ? "#6366F1" : isAnswered ? "#10B981" : "#334155",
                color: isCurrent || isAnswered ? "white" : "#64748B",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                transition: "all 0.1s",
              }}>
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Test ──────────────────────────────────────
function TestScreen({ shuffled, current, setCurrent, answers, onAnswer, onSubmit, mode }) {
  const totalQ = shuffled.length;
  const q = shuffled[current];
  const answered = answers[q?.id];
  const allAnswered = Object.keys(answers).length === totalQ;
  const progress = ((current + 1) / totalQ) * 100;
  const [fade, setFade] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const dimInfo = DIM_META[q?.dim] || {};

  const navigate = useCallback((dir) => {
    setFade(false);
    setTimeout(() => { setCurrent((c) => c + dir); setFade(true); }, 200);
  }, [setCurrent]);

  const jumpTo = useCallback((idx) => {
    setFade(false);
    setTimeout(() => { setCurrent(idx); setFade(true); }, 200);
  }, [setCurrent]);

  const handleAnswer = (val) => {
    onAnswer(q.id, val);
    if (current < totalQ - 1) {
      setFade(false);
      setTimeout(() => { setCurrent((c) => c + 1); setFade(true); }, 300);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans KR', sans-serif" }}>
      {showNav && (
        <QuestionNavigator
          shuffled={shuffled} current={current} answers={answers}
          onJump={jumpTo} onClose={() => setShowNav(false)}
        />
      )}
      {/* Progress */}
      <div style={{ background: "#1E293B", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ color: "#64748B", fontSize: 13 }}>진행률</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setShowNav(true)} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, color: "#94A3B8", fontSize: 11, cursor: "pointer",
                padding: "3px 10px", fontFamily: "'Noto Sans KR', sans-serif",
              }}>
                문항 목록
              </button>
              <span style={{ color: "#A5B4FC", fontSize: 13, fontWeight: 700 }}>
                {current + 1} <span style={{ color: "#475569" }}>/ {totalQ}</span>
              </span>
            </div>
          </div>
          <div style={{ height: 4, background: "#334155", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`, borderRadius: 4,
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)", transition: "width 0.3s ease",
            }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ maxWidth: 640, width: "100%", opacity: fade ? 1 : 0, transition: "opacity 0.2s ease" }}>
          {q?.dim !== "L" && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: `${dimInfo.color}18`, border: `1px solid ${dimInfo.color}40`,
              borderRadius: 100, padding: "4px 12px", marginBottom: 24,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: dimInfo.color }} />
              <span style={{ color: dimInfo.color, fontSize: 12, fontWeight: 600 }}>{dimInfo.label}</span>
            </div>
          )}

          <div style={{ color: "#475569", fontSize: 13, marginBottom: 12 }}>문항 {current + 1}</div>
          <h2 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 700, lineHeight: 1.5, margin: "0 0 40px" }}>
            {q?.text}
          </h2>

          {mode === "likert" ? (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button key={val} onClick={() => handleAnswer(val)} style={{
                    flex: 1, minHeight: 56, borderRadius: 14,
                    border: answered === val ? "2px solid #6366F1" : "2px solid rgba(255,255,255,0.08)",
                    background: answered === val ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                    color: answered === val ? "#A5B4FC" : "#64748B",
                    fontSize: 20, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}>{val}</button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                <span style={{ color: "#475569", fontSize: 11 }}>전혀 아니다</span>
                <span style={{ color: "#475569", fontSize: 11 }}>매우 그렇다</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 16 }}>
              {[{ val: 5, label: "예", emoji: "✓" }, { val: 1, label: "아니요", emoji: "✗" }].map(({ val, label, emoji }) => (
                <button key={label} onClick={() => handleAnswer(val)} style={{
                  flex: 1, padding: "20px", borderRadius: 16, cursor: "pointer",
                  border: answered === val ? "2px solid #6366F1" : "2px solid rgba(255,255,255,0.08)",
                  background: answered === val ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                  color: answered === val ? "#A5B4FC" : "#64748B",
                  fontSize: 18, fontWeight: 700, transition: "all 0.15s",
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</div>
                  {label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            <button onClick={() => navigate(-1)} disabled={current === 0} style={{
              padding: "12px 24px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
              color: current === 0 ? "#334155" : "#94A3B8",
              fontSize: 14, cursor: current === 0 ? "default" : "pointer",
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>← 이전</button>

            {current === totalQ - 1 ? (
              <button
                onClick={() => allAnswered ? onSubmit() : setShowNav(true)}
                style={{
                  flex: 1, padding: "12px 24px", borderRadius: 10, border: "none",
                  background: allAnswered ? "linear-gradient(135deg,#6366F1,#4F46E5)" : "rgba(245,158,11,0.15)",
                  color: allAnswered ? "white" : "#F59E0B",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  border: allAnswered ? "none" : "1px solid rgba(245,158,11,0.3)",
                }}
              >
                {allAnswered ? "결과 보기 →" : `⚠ 미응답 ${totalQ - Object.keys(answers).length}문항 확인`}
              </button>
            ) : (
              <button onClick={() => navigate(1)} disabled={!answered} style={{
                flex: 1, padding: "12px 24px", borderRadius: 10, border: "none",
                background: answered ? "rgba(99,102,241,0.2)" : "#1E293B",
                color: answered ? "#A5B4FC" : "#475569",
                fontSize: 14, cursor: answered ? "pointer" : "default",
                fontFamily: "'Noto Sans KR', sans-serif",
              }}>다음 →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Grouped Bar Chart ─────────────────────────
function GroupedBarChart({ scores }) {
  const GROUPS = [
    {
      label: "대인관계",
      color: "#6366F1",
      dims: [
        { key: "E", label: "외향성" },
        { key: "A", label: "친화성" },
        { key: "S", label: "사회성" },
      ],
    },
    {
      label: "업무수행",
      color: "#10B981",
      dims: [
        { key: "C", label: "성실성" },
        { key: "P", label: "적극성" },
        { key: "R", label: "리더십" },
      ],
    },
    {
      label: "개인성향",
      color: "#F59E0B",
      dims: [
        { key: "O", label: "개방성" },
        { key: "N", label: "정서\n안정성" },
        { key: "T", label: "스트레스\n내성" },
      ],
    },
  ];

  const maxScore = 5;
  const chartHeight = 160;

  return (
    <div style={{ background: "#1E293B", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
      <h3 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 700, margin: "0 0 24px" }}>역량별 점수</h3>
      <div style={{ display: "flex", gap: 16 }}>
        {GROUPS.map((group) => (
          <div key={group.label} style={{ flex: 1 }}>
            {/* 그룹 레이블 */}
            <div style={{
              textAlign: "center", color: group.color, fontSize: 12, fontWeight: 700,
              marginBottom: 16, padding: "4px 8px",
              background: `${group.color}15`, borderRadius: 6,
            }}>
              {group.label}
            </div>

            {/* 막대 차트 */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8, height: chartHeight }}>
              {group.dims.map((dim, i) => {
                const score = scores[dim.key] ?? 0;
                const pct = (score / maxScore) * 100;
                const barH = (pct / 100) * chartHeight;
                const opacity = 0.6 + i * 0.2;
                return (
                  <div key={dim.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    {/* 점수 */}
                    <div style={{ color: "#F1F5F9", fontSize: 11, fontWeight: 700 }}>
                      {score.toFixed(1)}
                    </div>
                    {/* 막대 */}
                    <div style={{
                      width: 28, height: barH, borderRadius: "4px 4px 0 0",
                      background: `${group.color}`,
                      opacity,
                      transition: "height 0.8s ease",
                      minHeight: 4,
                    }} />
                  </div>
                );
              })}
            </div>

            {/* 구분선 */}
            <div style={{ height: 2, background: `${group.color}40`, borderRadius: 2, margin: "4px 0 10px" }} />

            {/* 차원 레이블 */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {group.dims.map((dim) => (
                <div key={dim.key} style={{
                  flex: 1, textAlign: "center", color: "#64748B", fontSize: 10, lineHeight: 1.3,
                  whiteSpace: "pre-line",
                }}>
                  {dim.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div style={{ marginTop: 20, display: "flex", gap: 16, justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map(v => (
          <div key={v} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: "#475569" }} />
            <span style={{ color: "#475569", fontSize: 10 }}>{v}점</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────
function ResultsScreen({ results, onRestart }) {
  const { scores, analysis } = results;
  const lScore = scores["L"] ?? 3;
  const reliabilityPct = Math.max(0, Math.min(100, ((5 - lScore) / 4) * 100));
  const reliabilityLabel =
    reliabilityPct >= 70 ? { text: "높음", color: "#10B981" }
    : reliabilityPct >= 40 ? { text: "보통", color: "#F59E0B" }
    : { text: "낮음", color: "#EF4444" };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", fontFamily: "'Noto Sans KR', sans-serif", padding: "32px 16px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-block", background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)", borderRadius: 100,
            padding: "6px 16px", color: "#A5B4FC", fontSize: 12, fontWeight: 600, marginBottom: 16,
          }}>검사 완료</div>
          <h1 style={{ color: "#F1F5F9", fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>인성검사 결과 리포트</h1>
          <p style={{ color: "#64748B", fontSize: 13 }}>200문항 기반 분석</p>
        </div>

        {/* 광고: 결과 상단 */}
        <AdUnit style={{ marginBottom: 24 }} />

        {/* 신뢰도 */}
        <div style={{
          background: "#1E293B", borderRadius: 16, padding: "20px 24px", marginBottom: 16,
          border: `1px solid ${reliabilityLabel.color}30`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 4 }}>응답 신뢰도 (거짓말 척도)</div>
              <div style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700 }}>
                신뢰도 <span style={{ color: reliabilityLabel.color }}>{reliabilityLabel.text}</span>
              </div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              border: `3px solid ${reliabilityLabel.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: reliabilityLabel.color, fontSize: 15, fontWeight: 800,
            }}>{Math.round(reliabilityPct)}%</div>
          </div>
          <div style={{ height: 6, background: "#0F172A", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${reliabilityPct}%`, borderRadius: 4, background: reliabilityLabel.color }} />
          </div>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 12 }}>{analysis.reliabilityComment}</p>
        </div>

        {/* 일관성 */}
        {analysis.consistencyPct != null && (() => {
          const cColor = analysis.consistencyLevel === "high" ? "#10B981"
            : analysis.consistencyLevel === "medium" ? "#F59E0B" : "#EF4444";
          const cText = analysis.consistencyLevel === "high" ? "높음"
            : analysis.consistencyLevel === "medium" ? "보통" : "낮음";
          return (
            <div style={{
              background: "#1E293B", borderRadius: 16, padding: "20px 24px", marginBottom: 20,
              border: `1px solid ${cColor}30`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 4 }}>응답 일관성</div>
                  <div style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700 }}>
                    일관성 <span style={{ color: cColor }}>{cText}</span>
                  </div>
                </div>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  border: `3px solid ${cColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: cColor, fontSize: 15, fontWeight: 800,
                }}>{analysis.consistencyPct}%</div>
              </div>
              <div style={{ height: 6, background: "#0F172A", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${analysis.consistencyPct}%`, borderRadius: 4, background: cColor }} />
              </div>
              <p style={{ color: "#64748B", fontSize: 13, marginTop: 12 }}>{analysis.consistencyComment}</p>
            </div>
          );
        })()}

        {/* 성격 유형 */}
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
          border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: "24px", marginBottom: 20,
        }}>
          <div style={{ color: "#A5B4FC", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>성격 유형</div>
          <div style={{ color: "#F1F5F9", fontSize: 26, fontWeight: 800, marginBottom: 12 }}>{analysis.personalityType}</div>
          <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{analysis.typeDescription}</p>
        </div>

        {/* 역량별 그룹 차트 */}
        <GroupedBarChart scores={scores} />

        {/* 강점 / 개선 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[
            { key: "strengths",  title: "✦ 강점",     color: "#10B981" },
            { key: "weaknesses", title: "▲ 개선 영역", color: "#F59E0B" },
          ].map(({ key, title, color }) => (
            <div key={key} style={{ background: "#1E293B", borderRadius: 16, padding: "20px" }}>
              <div style={{ color, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>{title}</div>
              {analysis[key]?.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    background: `${color}18`, color, fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{i + 1}</div>
                  <span style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 직무 / 조언 */}
        <div style={{ background: "#1E293B", borderRadius: 16, padding: "24px", marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "#6366F1", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🎯 적합한 직무 · 환경</div>
            <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{analysis.careerFit}</p>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
            <div style={{ color: "#8B5CF6", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>💡 취업 준비 조언</div>
            <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{analysis.advice}</p>
          </div>
        </div>

        {/* 광고: 결과 하단 */}
        <AdUnit style={{ marginBottom: 24 }} />

        <button onClick={onRestart} style={{
          width: "100%", padding: 16, borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
          color: "#64748B", fontSize: 14, cursor: "pointer",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}>다시 검사하기</button>

        <p style={{ textAlign: "center", color: "#334155", fontSize: 11, marginTop: 24 }}>
          이 검사는 참고용입니다. 공식 채용 인성검사를 대체하지 않습니다.
        </p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────
export default function InseongTest() {
  const [phase, setPhase] = useState("welcome");
  const [mode, setMode] = useState("likert");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const shuffled = useMemo(() => shuffle(ALL_QUESTIONS), []);

  const handleAnswer = useCallback((qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  }, []);

  const computeScores = () => {
    const sums = {}, counts = {};
    for (const q of ALL_QUESTIONS) {
      const raw = answers[q.id];
      if (raw == null) continue;
      const score = q.rev ? 6 - raw : raw;
      sums[q.dim] = (sums[q.dim] || 0) + score;
      counts[q.dim] = (counts[q.dim] || 0) + 1;
    }
    const avgs = {};
    for (const dim in sums) avgs[dim] = sums[dim] / counts[dim];
    return avgs;
  };

  const handleSubmit = () => {
    const scores = computeScores();
    const analysis = analyzeScores(scores, answers, ALL_QUESTIONS);
    setResults({ scores, analysis });
    setPhase("results");
  };

  const restart = () => { setAnswers({}); setCurrent(0); setResults(null); setPhase("welcome"); };

  if (phase === "welcome") return <WelcomeScreen mode={mode} setMode={setMode} onStart={() => setPhase("test")} />;
  if (phase === "test") return (
    <TestScreen
      shuffled={shuffled} current={current} setCurrent={setCurrent}
      answers={answers} onAnswer={handleAnswer} onSubmit={handleSubmit} mode={mode}
    />
  );
  if (phase === "results") return <ResultsScreen results={results} onRestart={restart} />;
  return null;
}
