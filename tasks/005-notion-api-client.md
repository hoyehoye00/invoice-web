# Task 005: 환경변수 설정 및 노션 API 클라이언트 구성

## 목표
`@notionhq/client` 기반 서버 전용 노션 클라이언트를 구성하고, slug로 견적서를 조회하는 함수를 작성한다.

## 관련 파일
- `.env.local` — 환경변수 3개
- `src/lib/notion.ts` — 노션 클라이언트 및 조회 함수
- `src/types/notion.ts` — 노션 API 응답 타입

## 수락 기준
- `getInvoiceBySlug(slug)`: 유효 slug → Invoice, 무효 slug → null
- `getInvoiceItems(pageIds)`: page_id 배열 → InvoiceItem[]
- `getFullInvoice(slug)`: 위 두 함수 조합, 전체 Invoice 반환
- Notion API Key는 서버 전용 (`src/lib/notion.ts` 서버 컴포넌트에서만 사용)

## 구현 단계
- [x] @notionhq/client 설치
- [x] .env.local 환경변수 3개 추가
- [x] src/lib/notion.ts 작성 (getInvoiceBySlug, getInvoiceItems, getFullInvoice)
- [x] TypeScript 타입 오류 없음 확인
