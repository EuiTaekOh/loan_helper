# MCP Server 연동 가이드 (Step 6)

이 프로젝트는 `.cursor/mcp.json`에 **무료 MCP Server 4개**를 정의합니다.

| 서버 | 패키지 | 용도 |
|------|--------|------|
| **filesystem** | `@modelcontextprotocol/server-filesystem` | 프로젝트 파일 읽기·쓰기 |
| **context7** | `@upstash/context7-mcp` | React·Vitest·Tailwind 등 **최신 라이브러리 문서** 조회 |
| **fetch** | `@modelcontextprotocol/server-fetch` | 공개 URL·금융 규정 페이지 가져오기 |
| **memory** | `@modelcontextprotocol/server-memory` | 상담 FAQ·반복 요구사항 기억 |

## 1. Cursor에서 활성화

1. **Cursor 재시작** (또는 `Developer: Reload Window`)
2. **Cursor Settings → MCP** 이동
3. 프로젝트 MCP 목록에 위 4개 서버가 표시되는지 확인
4. 각 서버 상태가 **Connected(초록)** 인지 확인

> 첫 연결 시 `npx`가 패키지를 받으므로 **인터넷 연결**이 필요합니다.

## 2. Context7 API Key (선택)

무료로도 동작하지만, 호출 한도를 늘리려면 [context7.com/dashboard](https://context7.com/dashboard)에서 API Key를 발급한 뒤 `.cursor/mcp.json`의 `context7` 블록에 추가합니다.

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp", "--api-key", "여기에_API_KEY"]
}
```

또는 `env`로 전달할 수 있습니다.

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"],
  "env": {
    "CONTEXT7_API_KEY": "여기에_API_KEY"
  }
}
```

## 3. 연동 확인용 프롬프트 예시

### filesystem

```text
filesystem MCP로 src/lib/ 폴더 구조를 읽고 finance.ts가 어떤 함수를 export하는지 요약해줘.
```

### context7

```text
context7로 React 19 use() 훅 사용법 문서를 찾아서 이 프로젝트에 적용 가능한지 알려줘.
```

```text
context7로 Vitest describe/it 패턴 최신 문서를 참고해서 finance.test.ts 구조를 검토해줘.
```

### fetch

```text
fetch MCP로 한국은행 기준금리 공개 페이지를 조회하고, 참고용으로 요약해줘. (코드 반영 전 출처 URL 명시)
```

### memory

```text
memory MCP에 "전세대출 상담 시 DSR·LTV 설명이 자주 나온다"고 저장해줘.
```

## 4. 이 프로젝트에서 MCP를 쓰지 않는 경우

| 작업 | 우선 참고 |
|------|-----------|
| 금융 계산 수정 | `src/lib/finance.ts` + `finance.test.ts` |
| UI·토스 스타일 | `.cursor/rules/ui-components.mdc` |
| 제품 범위 | `docs/PRD.md` |

## 5. 문제 해결

| 증상 | 조치 |
|------|------|
| MCP 목록에 서버가 안 보임 | `.cursor/mcp.json` JSON 문법 확인 후 Cursor 재시작 |
| 빨간색 Error 상태 | MCP 패널에서 로그 확인, `npx` 수동 실행 테스트 |
| filesystem만 실패 | 경로에 한글·공백이 있어 환경에 따라 오류 가능 → 절대 경로 재확인 |
| context7 Rate limit | API Key 발급 후 `mcp.json`에 등록 |

## 6. 설정 파일 위치

```text
.cursor/mcp.json          ← 프로젝트 MCP 설정 (팀 공유)
.cursor/rules/mcp-workflow.mdc  ← Agent가 MCP를 쓸 때기준 Rule
```
