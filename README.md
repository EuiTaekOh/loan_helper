# KB 여신 상담 도우미

은행 여신 상담원이 상담 중 빠르게 계산하고 기록할 수 있도록 만든 금융 업무 보조 웹앱입니다.  
대출 상환 계산, 예·적금 만기 계산, 상담 메모를 한 화면에서 처리할 수 있습니다.

## 프로젝트 개요

### 배경과 목표
- 대출 상환액 계산과 상담 메모 정리 같은 반복 업무를 줄이기 위한 도구 구현
- React + TypeScript + Vite + Tailwind 기반으로 실무형 화면/로직 분리 구조 적용
- Cursor Rules와 워크플로우 기반으로 AI 협업 개발 방식 정리

### 기술 스택
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Vitest

### 서비스 및 저장소
- 서비스 URL: https://taekloanhelper.vercel.app/
- GitHub: https://github.com/EuiTaekOh/loan_helper

## 설치 및 실행 방법

### 1) 설치
```bash
npm install
```

### 2) 개발 서버 실행
```bash
npm run dev
```
- 기본 실행 주소: `http://localhost:5173`

### 3) 테스트 실행
```bash
npm test
npm run test:watch
```

### 4) 빌드/미리보기
```bash
npm run build
npm run preview
```

## 주요 기능 설명

### 1) 대출 상환 계산기 (필수)
- 입력: 대출원금, 연 이자율(%), 상환기간(개월)
- 계산: 원리금균등상환
- 결과: 월 상환액, 총 상환액, 총 이자, 월별 상환 스케줄
- 예외 처리: 빈 값/0/음수/비정상 입력 시 안내 메시지 표시

### 2) 상담 메모 관리 (필수)
- 메모 추가/삭제/검색(키워드 필터링)
- `localStorage` 영속 저장 (새로고침 후 유지)
- 저장 키: `kb-loan-consultation-memos`

### 3) 대시보드 UI (필수)
- 계산기, 상환 스케줄, 상담 메모를 단일 화면으로 구성
- 한국어 해요체 문구 통일
- 금액 표시 형식: 천 단위 콤마 + `원`

### 4) Sample 시나리오 검증
`src/lib/finance.test.ts` 기준 월 상환액 케이스 검증:
- 10,000,000원 / 5.0% / 12개월 → 856,075원
- 30,000,000원 / 4.5% / 36개월 → 892,408원
- 50,000,000원 / 3.9% / 60개월 → 918,571원
- 5,000,000원 / 6.0% / 6개월 → 847,977원
- 12,000,000원 / 0.0% / 12개월 → 1,000,000원

## 구현한 고급 기능 (선택)

### 기능 확장
- 예·적금 만기 계산기 탭(단리/복리(월복리))
- 상환 스케줄 CSV 다운로드
- 인쇄 기능(`window.print()`)
- 다크모드 토글 및 모드 저장
- 반응형 레이아웃

### 강의 심화 요소
- Cursor Rules 다수 적용
- MCP Server 설정 연동(`filesystem`, `context7`, `fetch`, `memory`)
- Vitest 테스트 코드 운영
  - `src/lib/finance.test.ts`
  - `src/lib/loanForm.test.ts`
  - `src/lib/storage.test.ts`

### 배포/백엔드 현황
- Vercel 배포 완료: https://taekloanhelper.vercel.app/
- Supabase 연동은 미구현(향후 확장)

## 사용한 Cursor Rules와 워크플로우

### 적용한 Rules
- `project.mdc`
- `finance-logic.mdc`
- `ui-components.mdc`
- `consultation-domain.mdc`
- `docs-context.mdc`
- `testing.mdc`
- `mcp-workflow.mdc`
- `toss-style-design.mdc`

### 개발 워크플로우
1. `docs/PRD.md`로 요구사항/범위 정리
2. `.cursor/rules/`에 규칙 정의
3. `src/lib` 순수 함수(계산/검증/저장) 우선 구현
4. `src/components`에서 UI/상태 연결
5. Vitest로 회귀 검증
6. README/문서 동기화

## 어려웠던 점과 해결 방법

### 1) 금융 계산 반올림 오차
- 문제: 반올림 시점에 따라 총 이자/잔액 값 차이 발생
- 해결: 내부 계산 후 반환 시점 반올림, 마지막 회차 잔액 0 정리

### 2) 입력 검증 누락 위험
- 문제: UI와 계산 로직에서 검증 분산
- 해결: `loanForm.ts` 1차 검증 + `finance.ts` 2차 검증(throw) 이중 방어

### 3) UI와 계산 로직 결합 위험
- 문제: 컴포넌트 내부 공식 계산 시 유지보수 저하
- 해결: 계산/저장/포맷을 `src/lib`로 분리하고 컴포넌트는 표시/상태만 담당

## 테스트 안내

`src/lib/finance.test.ts`에서 대출 상환·예적금 만기 계산을 검증합니다.

```bash
npm test            # 전체 테스트 1회 실행
npm run test:watch  # 파일 변경 시 자동 재실행
```

주요 검증 항목:
- `monthlyPayment()` 월 상환액 원 단위 반올림
- `calculateRepayment()` 스케줄/총 이자/입력 검증
- `calculateSavingsMaturity()` 단리/복리 분기 검증

## MCP 연동

프로젝트 `.cursor/mcp.json`에 무료 MCP 4종을 설정했습니다.

| 서버 | 용도 |
|------|------|
| filesystem | 프로젝트 파일 읽기·쓰기 |
| context7 | React·Vitest·Tailwind 문서 조회 |
| fetch | 공개 URL·금융 자료 조회 |
| memory | 상담 FAQ·반복 요구사항 기억 |

상세 설정: [`docs/mcp-setup.md`](docs/mcp-setup.md)

## 프로젝트 구조

```text
KB_오의택_여신도우미/
├── README.md
├── REPORT.md
├── .cursor/
│   ├── mcp.json
│   └── rules/
├── docs/
│   ├── PRD.md
│   └── mcp-setup.md
└── src/
    ├── App.tsx
    ├── index.css
    ├── components/
    │   ├── LoanCalculator.tsx
    │   ├── RepaymentTable.tsx
    │   └── ConsultationMemo.tsx
    └── lib/
        ├── finance.ts
        ├── format.ts
        ├── loanForm.ts
        ├── storage.ts
        ├── finance.test.ts
        ├── loanForm.test.ts
        └── storage.test.ts
```

## 제출 체크리스트

- 소스 코드 ZIP 파일명: `이름_중간과제.zip`
- 압축 시 `node_modules` 제외
- 레포트 파일명: `이름_중간과제.md` 또는 `이름_중간과제.pdf`
- 제출 전 점검:
  - `npm run dev` 정상 실행
  - `npm test` 통과
  - Sample 시나리오 값 확인
