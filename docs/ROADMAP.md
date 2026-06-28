# 노션 견적서 공유 서비스 개발 로드맵

> 노션을 CMS로 사용해, 노션에서 작성한 견적서를 웹 링크로 공유하고 PDF로 다운받을 수 있게 하는 단순 공유 도구

## 개요

invoice-web은 **노션 두 개 데이터베이스를 유일한 데이터 소스**로 사용하는 견적서 공유 도구입니다. 별도 데이터베이스(Supabase 등) 없이, 관리자가 노션에서 견적서와 항목을 관리하면 클라이언트는 공유 링크로 조회 및 PDF 다운로드를 수행합니다.

MVP(Phase 0~4)가 완료되어 다음 핵심 기능을 제공합니다:

- **slug로 견적서 조회**: 견적서 DB에서 slug → 견적서 정보 + items Relation page_id 목록 조회 (F001)
- **항목 포함 견적서 렌더링**: items Relation으로 연결된 항목 DB 조회 후 견적서 UI(항목 테이블 + 합계) 렌더링 (F002)
- **PDF 다운로드**: 클라이언트가 렌더링된 견적서를 PDF로 저장 (F003)

이번 고도화(Phase 5)에서는 관리자 운영 편의를 위한 다음 기능을 추가합니다:

- **관리자 견적서 목록 조회**: 노션 Invoice DB 전체 견적서를 관리자 전용 페이지에서 한눈에 확인
- **공유 링크 복사**: 견적서 목록에서 클라이언트 공유 링크를 클립보드로 즉시 복사
- **다크모드 토글 UI**: 라이트/다크/시스템 테마 전환 UI를 공개/관리자 페이지에 적용

### 노션 데이터 구조

관리자가 노션에서 직접 관리하는 두 개의 데이터베이스 (별도 DB 없음):

```
[견적서 DB (Invoice)] ──Relation──▶ [항목 DB (Items)]
  Name: ABC 클라이언트 견적서            Name: 기획
  slug: client-abc-2026                quantity: 10
  client: ABC 클라이언트                unit_price: 100,000
  date: 2026-06-26                     amount: 1,000,000 (Formula)
  total: 4,100,000                     invoice: ↩ (역방향 Relation)
  items: [항목1, 항목2, 항목3] ──┘
```

**API 조회 흐름**: `slug`로 견적서 DB 조회 → Relation의 item page_id 배열 → 각 항목 개별 조회 → 웹 렌더링

작성일: 2026-06-24 / 고도화 갱신: 2026-06-28

> 이전 로드맵 원본은 `docs/roadmaps/ROADMAP_v1.md`에 보관되어 있습니다.

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `011-admin-invoice-list.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
   - 직전 완료 작업을 예시로 참조 (예: 현재가 `011`이면 `005`, `002`를 참조). 새 작업 문서는 빈 체크박스 상태로 시작.

3. **작업 구현**
   - 작업 파일의 명세서를 따라 기능 구현
   - **노션 API 연동, 클립보드 복사 등 핵심 로직 구현 시 Playwright MCP로 E2E 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

---

## 개발 단계

### Phase 0: 프로젝트 기반 세팅 ✅

> Next.js 15 스타터킷 기반 환경 구성. 공통 스택과 레이아웃 시스템 확보.

- [✅] **Task 000: Next.js 15 스타터킷 세팅**
  - Next.js 15 (App Router, Turbopack) + TypeScript 5 + React 19 구성
  - TailwindCSS v4 + shadcn/ui (radix-nova) 설정
  - next-themes / sonner / lucide-react 기본 스택, MainLayout(Header/Sidebar/Footer) 및 NAV_ITEMS 시스템 구축

---

### Phase 1: 애플리케이션 골격 구축 ✅

> 공개 라우트 구조와 빈 페이지 골격, 타입 정의 완성 (구조 우선 접근법).

- [✅] **Task 001: 프로젝트 라우트 구조 및 빈 페이지 골격 생성** — See: `/tasks/001-routing-skeleton.md`
  - 견적서 공개 조회 페이지(`/invoice/[slug]`) 껍데기 + 오류 페이지(`not-found.tsx`)
  - 공개 조회 영역 미니멀 레이아웃 구성
- [✅] **Task 002: 타입 정의** — See: `/tasks/002-type-definitions.md`
  - `Invoice` / `InvoiceItem` 인터페이스, 노션 API 응답 타입, 환경변수 타입 정의

---

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

> 공개 조회 페이지와 오류 페이지 UI를 더미 데이터로 완성.

- [✅] **Task 003: 공통 컴포넌트 및 더미 데이터 유틸리티 구현**
  - shadcn/ui 필요 컴포넌트 추가(Button/Card/Skeleton/Table 등), 더미 데이터 유틸(`src/lib/dummy-data.ts`), 토스트 패턴 확립
- [✅] **Task 004: 견적서 공개 조회 및 오류 페이지 UI 완성 (F002, F003)**
  - 견적서 헤더 + 항목 테이블 + 합계 + "PDF 다운로드" 버튼, 오류 안내 UI, 로딩 스켈레톤, 반응형 최적화

---

### Phase 3: 노션 API 연동 및 핵심 기능 구현 ✅

> 환경변수 Notion API Key로 slug 조회 및 실시간 렌더링, PDF 다운로드 구현하여 MVP 완성.

- [✅] **Task 005: 환경변수 설정 및 노션 API 클라이언트 구성 (F001)** — See: `/tasks/005-notion-api-client.md`
  - `@notionhq/client` 서버 유틸(`src/lib/notion.ts`), slug 조회 함수, Playwright MCP E2E 검증
- [✅] **Task 006: 항목 조회 및 견적서 렌더링 구현 (F002)**
  - items Relation 개별 조회, 견적서 UI 렌더링, 무효 slug → 오류 페이지, E2E 테스트 완료
- [✅] **Task 007: PDF 다운로드 구현 (F003)**
  - `@react-pdf/renderer` 기반 PDF 생성/다운로드, 한글 폰트 포함, E2E 테스트 완료
- [✅] **Task 008: 핵심 기능 통합 테스트**
  - 공개 조회 → PDF 다운로드 핵심 플로우 통합 테스트, 에러/엣지 케이스 검증

---

### Phase 4: 최적화 및 배포 ✅

> 성능 최적화와 환경변수 기반 배포 파이프라인 구축.

- [✅] **Task 009: 성능 최적화 및 에러 처리 강화**
  - 노션 렌더링 캐싱(`unstable_cache`, 60초 revalidate), 로딩/에러 바운더리 정비, 레이트 리밋 처리
- [✅] **Task 010: Vercel 배포 및 환경 구성**
  - Vercel 연결 및 환경 변수 설정, 프로덕션 빌드 검증, 기본 모니터링/로깅

---

### Phase 5: 관리자 운영 편의 고도화 ✅

> **목표**: env 파일의 비밀번호 기반 간단 인증으로 관리자 페이지를 보호하고, 노션 전체 견적서를 한 페이지에서 조회하며 공유 링크를 빠르게 복사하고, 전 페이지에 일관된 다크모드 UX를 제공한다.
>
> **개발 순서(구조 우선)**: 관리자 인증(011) → 목록 조회(012) → 링크 복사(013) → 다크모드 토글(014). 011에서 로그인/세션 보호를 먼저 완성한 뒤, 012에서 보호된 관리자 레이아웃 위에 목록을 올리고, 013은 목록 행에 기능을 얹고, 014는 공통 Header에 독립적으로 적용한다.

- [✅] **Task 011: 관리자 비밀번호 인증 구현**
  - `.env.local`의 `ADMIN_PASSWORD` 환경변수와 입력값을 서버에서 비교하여 인증
  - 인증 성공 시 `HttpOnly` 세션 쿠키 발급, 미들웨어에서 쿠키 검증
  - 로그인 페이지(`/admin/login`), 로그아웃 기능 구현 (쿠키 삭제 버그 수정 완료)
  - **구현 파일**
    - `src/app/admin/login/page.tsx` — react-hook-form + zod 비밀번호 폼
    - `src/app/api/admin/login/route.ts` — POST: `ADMIN_PASSWORD` 비교 후 HttpOnly 쿠키 발급
    - `src/app/api/admin/logout/route.ts` — POST: 쿠키 만료(MaxAge=0), 리다이렉트는 클라이언트 담당
    - `src/middleware.ts` — `/admin/:path*` Edge 미들웨어, 미인증 시 `/admin/login` 리다이렉트
    - `src/components/admin/logout-button.tsx` — fetch 후 `router.refresh()` + `router.push` 순서로 쿠키 삭제 보장
    - `src/types/env.d.ts` — `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL` 타입 추가

- [✅] **Task 012: 관리자 견적서 목록 페이지 구현**
  - `/admin` 라우트, 노션 Invoice DB 전체 조회 → shadcn Table 렌더링
  - Header/Sidebar 포함 관리자 레이아웃, 빈 상태/로딩 스켈레톤/에러 바운더리 구현
  - **구현 파일**
    - `src/types/invoice.ts` — `InvoiceSummary` 타입 추가
    - `src/lib/notion.ts` — `getAllInvoices()` 추가 (date desc 정렬, 60초 캐싱)
    - `src/app/admin/layout.tsx` / `page.tsx` / `loading.tsx` / `error.tsx`
    - `src/components/admin/invoice-list.tsx` — Table + 날짜/원화 포맷, 빈 상태 UI
    - `src/components/layout/nav-items.ts` — `/admin` 견적서 관리 항목으로 교체

- [✅] **Task 013: 링크 복사 및 바로 보기 기능 구현**
  - 각 행에 "바로 보기"(새 탭) + "링크 복사" 버튼 추가
  - **구현 파일**
    - `src/components/admin/copy-link-button.tsx` — clipboard API + sonner 토스트
    - `src/components/admin/invoice-list.tsx` — 액션 컬럼에 바로 보기(`ExternalLink`) + 복사 버튼 연결
    - `src/lib/utils.ts` — `buildInvoiceShareUrl(slug)` 추가 (`NEXT_PUBLIC_SITE_URL` 또는 `window.location.origin` fallback)

- [✅] **Task 014: 다크모드 토글 UI 구현**
  - ThemeToggle을 별도 파일로 분리, 공개 견적서 페이지 미니멀 헤더에도 추가
  - **구현 파일**
    - `src/components/layout/theme-toggle.tsx` — `ThemeToggle` 분리 (`mounted` 가드 유지)
    - `src/components/layout/header.tsx` — 인라인 함수 제거, import 교체
    - `src/app/invoice/[slug]/layout.tsx` — 미니멀 헤더에 ThemeToggle 추가

**완료 기준**: 관리자 비밀번호 인증으로 `/admin` 접근 보호, 인증 후 노션 전체 견적서 목록 조회 가능, 각 행에서 공유 링크 복사 동작, 공개/관리자 전 페이지에서 다크모드 토글이 일관되게 동작하며 모든 Playwright E2E 테스트 통과.

---

## 기술적 의사결정 사항 (미결정 항목)

| 항목 | 후보 | 결정 기준 |
|------|------|-----------|
| 관리자 목록 조회 방식 | 매 요청 실시간 조회 vs revalidate 캐싱 | 견적서 수/갱신 빈도 기준. 운영 편의상 짧은 캐싱(예: 30~60초) 권장 |
| 공유 도메인 소스 | `NEXT_PUBLIC_SITE_URL` 환경변수 vs `window.location.origin` | 환경변수 우선, 미설정 시 origin fallback (로컬/프리뷰 대응) |
| 관리자 페이지 보호 | **`.env.local`의 `ADMIN_PASSWORD` 기반 단순 비밀번호 인증 (확정)** | 별도 회원 DB 없이 단일 비밀번호로 접근 제어. 기존 `.env.local`에 추가, 세션은 `HttpOnly` 쿠키, 미들웨어에서 검증. 향후 다중 관리자 필요 시 인증 시스템 도입 재평가 |

---

## MVP 이후 백로그

PRD에서 MVP 범위 제외로 명시된 기능 (추후 우선순위 재평가).

- [ ] **고도화 인증 시스템** (회원가입/로그인/로그아웃, DB 기반 다중 관리자) — Phase 5의 단순 비밀번호 인증을 대체
- [ ] 별도 데이터베이스 도입 (Supabase 등)
- [ ] 견적서 만료일 설정
- [ ] 견적서 열람 횟수/통계 확인
- [ ] 비밀번호로 견적서 보호
- [ ] 견적서 커스텀 브랜딩 (로고, 색상)
- [ ] 이메일 직접 발송 기능
- [ ] 여러 노션 워크스페이스 연동
- [ ] 알림 기능
