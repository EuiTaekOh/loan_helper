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

## 프로젝트 구조

```text
KB_오의택_여신도우미/
├── README.md
├── .cursor/
│   └── rules/
│       └── project.mdc
├── docs/
│   ├── PRD.md
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
    │   └── storage.ts
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
