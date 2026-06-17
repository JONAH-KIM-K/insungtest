# 인성검사 - 배포 가이드

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local
# .env.local 열고 ANTHROPIC_API_KEY 입력
npm run dev
# http://localhost:3000 열기
```

---

## Vercel 배포 (무료)

### 1단계 - GitHub 업로드
1. [github.com](https://github.com) → 로그인 → **New repository**
2. Repository name: `insunggumsa` (또는 원하는 이름)
3. `git init`, `git add .`, `git commit -m "init"`, `git push`

### 2단계 - Vercel 연결
1. [vercel.com](https://vercel.com) → **Continue with GitHub**으로 로그인
2. **Add New → Project** → GitHub 레포 선택 → **Import**
3. Framework: **Next.js** (자동 감지됨)

### 3단계 - 환경변수 등록 ⬅ 중요
Vercel 프로젝트 설정에서:
- **Settings → Environment Variables**
- `ANTHROPIC_API_KEY` = `sk-ant-본인키...` 입력
- **Save**

### 4단계 - 배포
- **Deploy** 클릭
- 1~2분 후 `https://insunggumsa-xxx.vercel.app` 주소 생성됨

---

## 도메인 연결 (선택)

### 무료 옵션
Vercel이 기본으로 주는 `xxx.vercel.app` 도메인 그대로 사용 가능

### 커스텀 도메인
1. 도메인 구입: [가비아](https://gabia.com), [namecheap](https://namecheap.com) 등 (연 1~2만원)
2. Vercel → Settings → Domains → 도메인 입력
3. DNS 설정 (Vercel이 안내해줌)

추천 도메인 예시:
- `인성검사.kr` (한글 도메인)
- `insunggumsa.com`
- `jobtest.kr`

---

## 파일 구조

```
├── app/
│   ├── layout.jsx        # SEO 메타태그
│   ├── page.jsx          # 홈페이지
│   ├── globals.css
│   └── api/analyze/
│       └── route.js      # 서버사이드 Claude API 호출 (키 보안)
├── components/
│   └── InseongTest.jsx   # 메인 컴포넌트
├── lib/
│   └── questions.js      # 200문항 데이터
└── .env.local.example
```

---

## API 키 발급

1. [console.anthropic.com](https://console.anthropic.com) 로그인
2. **API Keys → Create Key**
3. `sk-ant-...` 형태의 키 복사
4. Vercel 환경변수에 등록
