# Development Guidelines — 노션 견적서 공유 서비스

## 1. 프로젝트 개요

- **목적**: 노션 데이터베이스를 유일한 CMS로 사용하여 견적서를 웹 링크로 공유하고 PDF 다운로드 제공
- **핵심 제약**: 별도 DB(Supabase 등) 절대 도입 금지. 데이터 소스는 **Notion API만** 사용
- **환경변수**: `NOTION_API_KEY`, `NOTION_INVOICE_DB_ID`, `NOTION_ITEMS_DB_ID` 세 개 사용

---

## 2. 디렉토리 구조 및 파일 위치 규칙

```
src/
├── app/
│   ├── layout.tsx          — 전역 Provider (ThemeProvider, TooltipProvider, Toaster) 주입
│   ├── page.tsx            — 랜딩 페이지 (인증 불필요, 독립 레이아웃)
│   ├── globals.css         — CSS 변수 정의 (테마 색상, 반경 등)
│   └── invoice/
│       └── [slug]/         — 견적서 공개 조회 (Task 001~007 구현 대상)
├── components/
│   ├── layout/
│   │   ├── main-layout.tsx — 관리자 영역 레이아웃 (Header+Sidebar+Footer)
│   │   ├── header.tsx      — 데스크톱 nav + 모바일 Sheet 포함
│   │   ├── sidebar.tsx     — Sidebar + MobileSidebar export
│   │   ├── footer.tsx      — Footer
│   │   └── nav-items.ts    — NAV_ITEMS 배열 (Header·Sidebar 공유)
│   └── ui/                 — shadcn/ui 컴포넌트 (npx shadcn add로만 추가)
├── lib/
│   ├── utils.ts            — cn() 유틸리티만 포함
│   └── notion.ts           — Notion API 클라이언트 및 조회 함수 (Phase 3에서 생성)
├── types/                  — TypeScript 인터페이스 정의 (Phase 1에서 생성)
└── providers/
    └── theme-provider.tsx  — next-themes 래퍼
tasks/                      — 작업 명세 파일 (XXX-description.md)
docs/
├── PRD.md                  — 제품 요구사항
└── ROADMAP.md              — 개발 로드맵 (작업 완료 시 ✅ 업데이트 필수)
```

---

## 3. 라우팅 규칙

### 공개 라우트 (MVP 범위)
| 경로 | 파일 | 레이아웃 |
|------|------|----------|
| `/invoice/[slug]` | `src/app/invoice/[slug]/page.tsx` | 미니멀 (Header/Sidebar 없음) |
| 존재하지 않는 slug | `src/app/invoice/[slug]/not-found.tsx` 또는 `src/app/not-found.tsx` | 동일 |

- `/invoice/[slug]`에 **`MainLayout` 사용 금지** — 독립 미니멀 레이아웃 직접 구현
- `showHeader={false} showSidebar={false}`로 MainLayout을 재활용하지 않음

### MVP 외 라우트 절대 생성 금지
- `/login`, `/signup`, `/dashboard`, `/admin` 등은 MVP 범위 외
- ROADMAP.md "MVP 이후 백로그" 항목은 현재 구현 금지

---

## 4. 컴포넌트 규칙

### shadcn/ui 컴포넌트
- 추가 시 반드시 `npx shadcn add [컴포넌트명]` 사용
- `src/components/ui/`에만 위치, 직접 수정 가능
- 스타일: `radix-nova`, 베이스 컬러: `neutral`, 아이콘: `lucide`

### 클라이언트 vs 서버 컴포넌트
- `useState`, `useEffect`, `useTheme`, `usePathname` 사용 시 파일 상단에 `"use client"` 필수
- **Notion API 호출은 반드시 서버 컴포넌트 또는 Server Action에서만** — 클라이언트에서 직접 호출 금지 (API Key 노출)
- `src/lib/notion.ts`는 서버 전용 모듈

### 네비게이션 변경
- 네비게이션 항목 추가/수정: `src/components/layout/nav-items.ts`의 `NAV_ITEMS`만 수정
- Header와 Sidebar는 NAV_ITEMS를 공유하므로 개별 수정 불필요

---

## 5. 스타일링 규칙

- 클래스 병합은 반드시 `cn()` 사용 (`src/lib/utils.ts`에서 import)
- 인라인 스타일 사용 금지, Tailwind 클래스만 사용
- 커스텀 색상 추가 시 `src/app/globals.css`의 CSS 변수에 정의
- 다크모드: `next-themes` 관리, `<html>`의 `suppressHydrationWarning`은 의도된 것 — 제거 금지
- TailwindCSS v4 문법 사용 (`@import "tailwindcss"`, `@theme inline`)

---

## 6. TypeScript 규칙

- `src/types/` 디렉토리에 도메인 타입 정의
- 견적서 타입: `Invoice` (`slug`, `client`, `date`, `total`, `items: InvoiceItem[]`)
- 항목 타입: `InvoiceItem` (`name`, `quantity`, `unit_price`, `amount`)
- 노션 응답 타입: `NotionInvoiceRow`, `NotionItemRow` (`src/types/notion.ts`)
- 환경변수는 `process.env.NOTION_API_KEY`, `process.env.NOTION_INVOICE_DB_ID`, `process.env.NOTION_ITEMS_DB_ID`로 접근
- 경로 별칭 `@/` = `src/` (tsconfig paths 설정됨)
- `strict: true` 활성화 — `any` 타입 사용 지양

---

## 7. Notion API 연동 규칙

- `src/lib/notion.ts`에 `@notionhq/client` 기반 서버 전용 클라이언트 작성
- **조회 흐름**: `slug`로 견적서 DB 조회 → items Relation `page_id` 배열 확보 → 각 항목 페이지 개별 조회
- 함수 목록:
  - `getInvoiceBySlug(slug)`: 견적서 DB에서 slug 필터 조회 → `Invoice` 반환 (F001)
  - `getInvoiceItems(pageIds)`: page_id 배열 → 각 항목 페이지 조회 → `InvoiceItem[]` 반환 (F002)
- 두 개의 DB ID: `NOTION_INVOICE_DB_ID`(견적서 DB), `NOTION_ITEMS_DB_ID`(항목 DB)
- 노션 API 레이트 리밋 고려 — Next.js `revalidate` 캐싱 전략 적용 권장

---

## 8. PDF 생성 규칙

- `html2canvas + jsPDF` 조합 사용 (PRD 결정사항)
- PDF 생성 트리거: "PDF 다운로드" 버튼 클릭 → 클라이언트 사이드 처리
- PDF 생성 로직은 클라이언트 컴포넌트에서만 가능 (`"use client"` 필수)

---

## 9. 테스트 규칙

- **핵심 기능(F001~F003) 구현 후 Playwright MCP E2E 테스트 필수**
- Task 005~008은 각 Task 완료 후 Playwright MCP 테스트 시나리오 실행
- 테스트 시나리오: 유효 slug 조회, 무효 slug 오류 페이지, PDF 다운로드 동작

---

## 10. 워크플로우 규칙

### Task 파일 관리
- 새 Task: `tasks/XXX-description.md` 형식으로 생성
- Task 완료 시 `docs/ROADMAP.md`에서 해당 항목을 `✅`로 표시

### 다중 파일 동시 수정이 필요한 경우
| 변경 사항 | 동시 수정 파일 |
|-----------|---------------|
| 네비게이션 항목 추가 | `nav-items.ts`만 수정 (Header/Sidebar 자동 반영) |
| 새 페이지 라우트 추가 | `src/app/[경로]/page.tsx` + `docs/ROADMAP.md` |
| 새 타입 정의 | `src/types/[파일].ts` + 해당 타입을 사용하는 모듈 |
| 환경변수 추가 | `.env.local` + `src/lib/notion.ts` 또는 사용 파일 + `docs/ROADMAP.md` (Task 명세) |

---

## 11. 금지 사항

- **Supabase, PostgreSQL, MySQL 등 외부 DB 도입 금지**
- **`/invoice/[slug]`에 MainLayout 적용 금지** (미니멀 공개 레이아웃 사용)
- **Notion API Key를 클라이언트 컴포넌트에서 직접 사용 금지** (서버 사이드 전용)
- **MVP 범위 외 기능 구현 금지** (인증, 대시보드, 만료일, 통계, 이메일 발송 등)
- **`src/components/ui/` 컴포넌트를 `npx shadcn add` 없이 직접 파일 생성 금지**
- **`suppressHydrationWarning` 제거 금지** (next-themes hydration 의도된 동작)
- **인라인 스타일(`style={{}}`) 사용 금지** — Tailwind 클래스 사용
- **`any` 타입 남용 금지** — 명시적 타입 또는 `unknown` 사용

---

## 12. 개발 명령어

```bash
npm run dev      # Turbopack 개발 서버 (localhost:3000)
npm run build    # Turbopack 프로덕션 빌드
npm run lint     # ESLint 실행
npx shadcn add [컴포넌트명]  # shadcn/ui 컴포넌트 추가
```
