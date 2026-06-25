# Task 002: 타입 정의

## 목표

`src/types/` 디렉토리를 생성하고 도메인 타입을 정의한다. 노션 DB 행 구조를 반영한 `Invoice` 인터페이스, 노션 블록 타입, 환경변수 타입 선언을 포함한다.

## 관련 파일

| 파일 | 타입 | 설명 |
|------|------|------|
| `src/types/invoice.ts` | CREATE | Invoice 인터페이스 |
| `src/types/notion.ts` | CREATE | 노션 블록 타입, API 응답 타입 |
| `src/types/env.d.ts` | CREATE | 환경변수 타입 선언 (ProcessEnv augmentation) |
| `src/types/index.ts` | CREATE | 전체 타입 re-export 인덱스 |
| `tsconfig.json` | REFERENCE | strict 모드 및 paths 별칭 확인 |
| `shrimp-rules.md` | REFERENCE | TypeScript 규칙 §6 참조 |

## 수락 기준

- [ ] `src/types/` 디렉토리에 invoice.ts, notion.ts, env.d.ts, index.ts 4개 파일 생성
- [ ] `Invoice` 인터페이스에 `id`, `title`, `slug`, `pageId` 필드 존재
- [ ] `NotionBlockType` union type에 주요 블록 타입 포함 (paragraph, heading_1~3, table, image 등)
- [ ] `process.env.NOTION_API_KEY`, `process.env.NOTION_DATABASE_ID` 타입 인식
- [ ] `npm run build` 또는 `tsc --noEmit` 타입 오류 없음
- [ ] `any` 타입 미사용 (strict 모드 준수)

## 타입 상세 명세

### Invoice (src/types/invoice.ts)

```typescript
interface Invoice {
  id: string;        // 노션 페이지 ID
  title: string;     // 견적서 제목
  slug: string;      // 공유 URL용 슬러그
  pageId: string;    // 견적서 내용 노션 페이지 ID
}
```

### NotionBlockType (src/types/notion.ts)

```typescript
type NotionBlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'table'
  | 'table_row'
  | 'image'
  | 'divider'
  | 'quote'
  | 'code'
  | 'callout';
```

### 환경변수 (src/types/env.d.ts)

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    NOTION_API_KEY: string | undefined;
    NOTION_DATABASE_ID: string | undefined;
  }
}
```

## 구현 단계

### Step 1: src/types/invoice.ts 생성
- `Invoice` 인터페이스 정의
- JSDoc 주석으로 각 필드 설명

### Step 2: src/types/notion.ts 생성
- `NotionBlockType` union type 정의
- `NotionRichText` 인터페이스 정의 (plain_text, href, annotations)
- `NotionBlock` 인터페이스 정의 (id, type, has_children)

### Step 3: src/types/env.d.ts 생성
- `NodeJS.ProcessEnv` augmentation
- NOTION_API_KEY, NOTION_DATABASE_ID 타입 선언

### Step 4: src/types/index.ts 생성
- invoice.ts, notion.ts의 타입 re-export
- env.d.ts는 전역 선언이므로 re-export 불필요

## 진행 상황

- [ ] Step 1: invoice.ts 생성
- [ ] Step 2: notion.ts 생성
- [ ] Step 3: env.d.ts 생성
- [ ] Step 4: index.ts 생성
- [ ] 타입 검증
