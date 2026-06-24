# CLAUDE.md

**노션 견적서 서비스** — 노션 데이터베이스를 CMS로 사용하여 관리자가 작성한 견적서를 클라이언트에게 웹 링크로 공유하고 PDF로 다운받을 수 있는 서비스. 별도 DB 없이 노션만 사용.

# Project Context
- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router, Turbopack) | 15.5 |
| 언어 | TypeScript | 5 |
| UI 컴포넌트 | shadcn/ui (radix-nova 스타일) | 4 |
| 스타일링 | TailwindCSS | 4 |
| 상태/테마 | next-themes | 0.4 |
| 폼 | react-hook-form + zod | 7 / 4 |
| 토스트 | sonner | 2 |
| 아이콘 | lucide-react | 1 |
| 날짜 | date-fns | 4 |
| 유틸 훅 | react-use | 17 |

## 명령어

```bash
npm run dev      # Turbopack 개발 서버 (localhost:3000)
npm run build    # Turbopack 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

ShadcnUI 컴포넌트 추가:
```bash
npx shadcn add [컴포넌트명]
```

## 아키텍처

**Next.js 15 App Router** 기반 스타터킷으로, 두 레이어로 구성됩니다.

### 레이아웃 시스템

`src/app/layout.tsx` → 전역 Provider 주입 (`ThemeProvider`, `TooltipProvider`, `Toaster`)

`MainLayout` (`src/components/layout/main-layout.tsx`) → 실제 페이지 레이아웃. Header/Sidebar/Footer 각각 `showHeader`, `showSidebar`, `showFooter` prop으로 제어 가능.

네비게이션 항목은 `src/components/layout/nav-items.ts`의 `NAV_ITEMS` 배열 하나로 관리되며, Header(데스크톱 nav + 모바일 Sheet)와 Sidebar 양쪽에서 공유.

### 컴포넌트 구조

- `src/components/ui/` — shadcn/ui 컴포넌트 (직접 수정 가능, shadcn add로 추가)
- `src/components/layout/` — Header, Sidebar, Footer, MainLayout
- `src/providers/` — next-themes 래퍼

### 스타일링

TailwindCSS v4 + shadcn/ui (스타일: `radix-nova`, 베이스 컬러: `neutral`). CSS 변수는 `src/app/globals.css`에 정의. 클래스 병합은 `cn()` 유틸리티 (`src/lib/utils.ts`) 사용.

다크모드는 `next-themes`로 라이트/다크/시스템 세 모드 지원. `suppressHydrationWarning`이 `<html>`에 설정되어 있으므로 테마 관련 hydration 불일치는 의도된 것.

### 주요 의존성

| 용도 | 라이브러리 |
|------|-----------|
| 폼 | react-hook-form + zod + @hookform/resolvers |
| 토스트 | sonner |
| 아이콘 | lucide-react |
| 날짜 | date-fns |
| 유틸 훅 | react-use |
