import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { scores } = await request.json();

    const DIM_LABELS = {
      L: "응답신뢰도", E: "외향성", C: "성실성", A: "친화성", O: "개방성",
      N: "정서안정성", S: "사회성", R: "리더십", T: "스트레스내성", P: "적극성",
    };

    const scoreText = Object.entries(scores)
      .map(([dim, val]) => `${DIM_LABELS[dim]}(${dim}): ${Number(val).toFixed(2)}`)
      .join(", ");

    const prompt = `당신은 산업심리학 전문가입니다. 취업 지원자의 인성검사 결과입니다 (1~5점 척도):
${scoreText}
※ 응답신뢰도(L)는 높을수록 솔직하지 않을 가능성이 있습니다.

반드시 아래 JSON만 출력하세요. 마크다운 없이 순수 JSON:
{
  "reliabilityComment": "응답 신뢰도 한 문장 평가",
  "personalityType": "성격 유형 이름 (4~8자)",
  "typeDescription": "성격 유형 설명 3~4문장",
  "strengths": ["강점1", "강점2", "강점3"],
  "weaknesses": ["개선점1", "개선점2", "개선점3"],
  "careerFit": "잘 맞는 직무/환경 2문장",
  "advice": "취업 준비 실용 조언 2문장"
}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.map((i) => i.text || "").join("") || "";
    const clean = text.replace(/```json\n?|```/g, "").trim();
    const analysis = JSON.parse(clean);

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ analysis: null }, { status: 500 });
  }
}
