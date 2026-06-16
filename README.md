# 여신도우미

은행 여신 상담을 돕는 웹앱 템플릿입니다.

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS

## 실행 방법

```bash
npm install
npm run dev
```

## 테스트 (Step 7 — TDD)

`src/lib/finance.test.ts`에서 Vitest로 대출 상환·예·적금 만기 계산 로직을 검증합니다.

```bash
npm test           # 전체 테스트 1회 실행
npm run test:watch # 파일 저장 시 자동 재실행 (TDD)
```

주요 검증 항목:

- `monthlyPayment()` — 월 상환액 원 단위 정수 반올림 (채점 시나리오 5건)
- `calculateRepayment()` — 원리금균등 스케줄·총 이자·입력 검증
- `calculateSavingsMaturity()` — 단리/복리(월복리) 만기 계산

## MCP Server 연동 (Step 6)

프로젝트 `.cursor/mcp.json`에 무료 MCP 4개가 정의되어 있습니다.

| 서버 | 용도 |
|------|------|
| filesystem | 프로젝트 파일 읽기·쓰기 |
| context7 | React·Vitest·Tailwind 최신 문서 조회 |
| fetch | 공개 URL·금융 자료 조회 |
| memory | 상담 FAQ·반복 요구사항 기억 |

연동 확인·API Key·테스트 프롬프트: [`docs/mcp-setup.md`](docs/mcp-setup.md)

## 프로젝트 구조

```text
KB_오의택_여신도우미/
├── README.md
├── .cursor/
│   ├── mcp.json
│   └── rules/
│       └── project.mdc
├── docs/
│   ├── PRD.md
│   ├── mcp-setup.md
│   └── prompts.md
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── lib/
    │   ├── finance.ts
    │   ├── finance.test.ts
    │   ├── storage.ts
    │   └── storage.test.ts
    └── components/
        ├── LoanCalculator.tsx
        ├── RepaymentTable.tsx
        └── ConsultationMemo.tsx
```

## 구현 범위

- 기본 대시보드 레이아웃
- 대출 상환 계산기 컴포넌트 스켈레톤
- 월별 상환 스케줄 컴포넌트 스켈레톤
- 상담 메모 컴포넌트 스켈레톤
- 금융 계산/로컬스토리지 유틸 함수 스텁
