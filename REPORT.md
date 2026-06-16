# KB 여신 상담 도우미 프로젝트 레포트

## 1) 프로젝트 개요

### 프로젝트 배경
은행 여신 상담 업무에서는 대출 상환액 계산, 월별 상환 스케줄 설명, 상담 메모 정리가 반복적으로 발생합니다.  
본 프로젝트는 이러한 반복 업무를 줄이기 위해, 상담원이 한 화면에서 계산과 기록을 함께 처리할 수 있는 웹 도구를 만드는 것을 목표로 했습니다.

### 프로젝트 목표
- React + TypeScript + Vite + Tailwind 기반의 금융 업무 도우미 웹앱 구현
- 대출 상환 계산과 상담 메모 기능을 단일 대시보드로 통합
- Cursor Rules와 워크플로우를 활용한 AI 협업 개발 방식 정리

### 개발 환경
- OS: macOS (개인 PC)
- Node.js: 20 이상 권장
- 패키지 매니저: npm
- 주요 스택: React 19, TypeScript, Vite, Tailwind CSS, Vitest

---

## 2) 설치 및 실행 방법

### 2-1. 프로젝트 설치
```bash
npm install
```

### 2-2. 개발 서버 실행
```bash
npm run dev
```
- 실행 후 터미널에 표시되는 로컬 주소(기본 `http://localhost:5173`)로 접속합니다.

### 2-3. 테스트 실행
```bash
npm test
```
- 금융 계산 로직과 메모/입력 검증 로직 테스트를 1회 실행합니다.

```bash
npm run test:watch
```
- 파일 변경 시 자동으로 테스트를 재실행합니다.

### 2-4. 빌드 및 미리보기
```bash
npm run build
npm run preview
```

---

## 3) 주요 기능 설명

### 3-1. 대출 상환 계산기 (필수)
- 입력값: 대출원금, 연 이자율(%), 상환기간(개월)
- 계산 방식: 원리금균등 상환
- 출력값: 월 상환액, 총 상환액, 총 이자
- 월별 상환 스케줄: 회차/월 상환액/원금/이자/잔액
- 표시 형식: 모든 금액을 천 단위 콤마 + `원`으로 출력
- 입력 검증: 빈 값/0/음수/비정상 값 차단 및 안내 메시지 제공

핵심 계산 로직은 `src/lib/finance.ts`의 순수 함수로 분리했습니다.
- `calculateRepayment()`: 대출 상환 및 스케줄 계산
- `monthlyPayment()`: 월 상환액 원 단위 반올림 반환

### 3-2. 상담 메모 관리 (필수)
- 메모 추가/삭제/검색(키워드 필터링) 지원
- 저장 방식: 브라우저 `localStorage`
- 저장 키: `kb-loan-consultation-memos`
- 새로고침 후에도 메모 유지

관련 모듈:
- `src/lib/storage.ts`: 메모 CRUD 및 검색
- `src/components/ConsultationMemo.tsx`: UI/상태 관리

### 3-3. 단일 대시보드 UI (필수)
- `App.tsx`에서 계산기, 상환 스케줄, 상담 메모를 한 화면에 배치
- 함수형 컴포넌트와 `useState`/`useMemo` 중심으로 상태 구성
- 사용자 안내 문구를 한국어 해요체로 통일

### 3-4. 과제 Sample 시나리오 기준 검증
`src/lib/finance.test.ts`에 명시된 케이스를 기준으로 월 상환액 계산 정확도를 검증했습니다.
- 10,000,000원 / 5.0% / 12개월 → 856,075원
- 30,000,000원 / 4.5% / 36개월 → 892,408원
- 50,000,000원 / 3.9% / 60개월 → 918,571원
- 5,000,000원 / 6.0% / 6개월 → 847,977원
- 12,000,000원 / 0.0% / 12개월 → 1,000,000원

또한 1회차/마지막 회차 잔액(0원), 이자율 0% 분기, 예외 입력 처리를 함께 테스트했습니다.

---

## 4) 사용한 Cursor Rules와 워크플로우

### 4-1. 적용한 주요 Rules
프로젝트 내 `.cursor/rules/`에서 다음 규칙을 사용했습니다.
- `project.mdc`: 기술 스택, 한국어 UI, 함수형 컴포넌트, 계산 로직 분리
- `finance-logic.mdc`: 금융 계산은 `src/lib/finance.ts`에서만 처리, 테스트 연계
- `ui-components.mdc`: Tailwind + toss 스타일 클래스 기준, 컴포넌트 UI 규칙
- `consultation-domain.mdc`: 여신 상담 도메인 용어/문구 일관성
- `docs-context.mdc`: PRD를 1차 기준으로 기능 범위 관리
- `testing.mdc`: Vitest 기반 TDD/회귀 검증 규칙
- `mcp-workflow.mdc`: MCP 사용 시점과 목적 정의
- `toss-style-design.mdc`: 토스 스타일 가이드 적용

### 4-2. 워크플로우
1. `docs/PRD.md`로 범위와 요구사항 먼저 정리  
2. Rules에 개발 제약/원칙을 명시해 AI 출력 품질 고정  
3. `src/lib`에 순수 함수/검증/저장 로직을 먼저 구현  
4. `src/components`에서 UI와 상태를 연결  
5. Vitest로 계산/입력/저장 로직 회귀 검증  
6. README와 문서(`docs/mcp-setup.md`, 본 REPORT) 동기화

---

## 5) 구현한 고급 기능 (선택 구현사항)

과제 명세의 Phase 2 항목 중 다음 기능을 구현했습니다.

### 5-1. 기능 확장
- 예·적금 만기 계산기 탭 추가 (단리/복리(월복리))
- 상환 스케줄 CSV 다운로드
- 상환 스케줄 인쇄 기능 (`window.print()`)
- 다크모드 토글 및 모드 상태 저장(localStorage)
- 반응형 레이아웃(모바일/태블릿/데스크톱 대응)

### 5-2. 강의 심화 요소
- Cursor Rules 다수 적용으로 작업 방식 고도화
- MCP 설정 파일(`.cursor/mcp.json`) 구성
  - filesystem / context7 / fetch / memory
- Vitest 기반 테스트 코드 작성 및 유지
  - `finance.test.ts`
  - `loanForm.test.ts`
  - `storage.test.ts`

### 5-3. 배포/백엔드 구현 현황
- Supabase 연동(메모 클라우드 저장): 미구현
- Vercel 배포: 구현 완료
  - 배포 URL: https://taekloanhelper.vercel.app/
- GitHub 저장소: https://github.com/EuiTaekOh/loan_helper

현재 버전은 프론트엔드 기능과 Vercel 배포까지 완료했으며, 백엔드 연동은 향후 확장 항목으로 관리하고 있습니다.

---

## 6) 어려웠던 점과 해결 방법

### 어려움 1) 금융 계산 정확도와 반올림 처리
- 문제: 월 상환액/총 이자/스케줄 잔액에서 반올림 시점에 따라 값이 달라질 수 있었습니다.
- 해결: 내부 계산은 부동소수점으로 유지하고, 반환 시점에만 `round2`를 적용했습니다. 마지막 회차는 잔액을 강제로 0으로 정리해 누적 오차를 방지했습니다.

### 어려움 2) 입력값 예외 처리 중복
- 문제: UI 입력과 계산 함수 양쪽에서 검증이 필요해 누락 위험이 있었습니다.
- 해결: `loanForm.ts`에서 1차 검증, `finance.ts`에서 2차 검증(throw)으로 이중 방어 구조를 구성했습니다.

### 어려움 3) UI와 비즈니스 로직 결합 위험
- 문제: 컴포넌트 내부에서 계산식을 직접 쓰면 유지보수성이 떨어질 수 있었습니다.
- 해결: 계산/저장/포맷을 각각 `src/lib`로 분리하고, 컴포넌트는 입력/출력/상태 연결만 담당하게 구성했습니다.

### 어려움 4) 과제 요구사항과 구현 결과 정합성
- 문제: 필수/선택/가점 요소가 많아 누락 가능성이 있었습니다.
- 해결: `과제 설명.html`의 Phase/Step/Sample 시나리오를 체크리스트로 전환해 기능 단위로 대조했습니다.

---

## 7) 제출 체크리스트

### 7-1. 코드 제출물
- 전체 프로젝트 폴더를 ZIP으로 압축
- 파일명: `이름_중간과제.zip`
- `node_modules` 폴더 제외

예시(터미널):
```bash
zip -r 이름_중간과제.zip . -x "node_modules/*" ".git/*"
```

### 7-2. 레포트 제출물
- 본 문서(`REPORT.md`)를 제출 형식에 맞게 사용
- 파일명: `이름_중간과제.md` 또는 `이름_중간과제.pdf`

### 7-3. 제출 전 최종 점검
- `npm install` 후 `npm run dev` 정상 실행
- `npm test` 통과
- Sample 시나리오 주요 값 확인
- 메모 새로고침 유지/검색/삭제 동작 확인

---

## 8) 참고 문서

- 과제 명세: `과제 설명.html`
- 요구사항 문서: `docs/PRD.md`
- 실행/구조 안내: `README.md`
- MCP 연동 가이드: `docs/mcp-setup.md`
- 서비스 배포 URL: https://taekloanhelper.vercel.app/
- GitHub 저장소: https://github.com/EuiTaekOh/loan_helper
