# 노션 견적서 공유 서비스 개발 로드맵

> 노션을 CMS로 사용해, 노션에서 작성한 견적서를 웹 링크로 공유하고 PDF로 다운받을 수 있게 하는 단순 공유 도구

## 개요

invoice-web은 **노션 두 개 데이터베이스를 유일한 데이터 소스**로 사용하는 견적서 공유 도구입니다. 별도 데이터베이스(Supabase 등) 없이, 관리자가 노션에서 견적서와 항목을 관리하면 클라이언트는 공유 링크로 조회 및 PDF 다운로드만 수행합니다:

- **slug로 견적서 조회**: 견적서 DB에서 slug → 견적서 정보 + items Relation page_id 목록 조회 (F001)
- **항목 포함 견적서 렌더링**: items Relation으로 연결된 항목 DB 조회 후 견적서 UI(항목 테이블 + 합계) 렌더링 (F002)
- **PDF 다운로드**: 클라이언트가 렌더링된 견적서를 PDF로 저장 (F003)

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

작성일: 2026-06-24

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-routing-skeleton.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**

3. **작업 구현**
   - 작업 파일의 명세서를 따라 기능 구현
   - **노션 API 연동, PDF 생성 등 핵심 로직 구현 시 Playwright MCP로 E2E 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 테스트 통과 확인 후 다음 단계로 진행

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

---

## 개발 단계

### Phase 0: 프로젝트 기반 세팅 ✅

> **목표**: Next.js 15 스타터킷 기반 환경 구성. 공통 스택과 레이아웃 시스템을 확보하여 이후 모든 Phase의 기반을 마련한다.

- [✅] Task 000: Next.js 15 스타터킷 세팅
  - Next.js 15 (App Router, Turbopack) + TypeScript 5 + React 19 구성
  - TailwindCSS v4 + shadcn/ui (radix-nova) 설정
  - next-themes (라이트/다크/시스템), sonner, lucide-react 기본 스택 구성
  - MainLayout (Header/Sidebar/Footer) 및 NAV_ITEMS 네비게이션 시스템 구축

**완료 기준**: `npm run dev`로 개발 서버 정상 구동, 공통 레이아웃 및 테마 전환 동작.

---

### Phase 1: 애플리케이션 골격 구축 ✅

> **목표**: 공개 라우트 구조와 빈 페이지 골격, 타입 정의를 먼저 완성한다 (구조 우선 접근법). 별도 DB 없이 노션만 사용하는 단순 구조이므로 전체 앱 플로우를 빠르게 체험 가능하게 한다.

- [✅] Task 001: 프로젝트 라우트 구조 및 빈 페이지 골격 생성
  - 견적서 공개 조회 페이지(`/invoice/[slug]`) 껍데기 생성 (F001, F002, F003)
  - 오류 안내 페이지(`not-found.tsx`) 생성
  - 공개 조회 영역 레이아웃 구성 (불필요한 Header/Sidebar 제거, 미니멀 레이아웃)

- [✅] Task 002: 타입 정의
  - `Invoice` TypeScript 인터페이스 정의 (`src/types/`) — 견적서 DB 구조(slug, client, date, total, items) 반영
  - `InvoiceItem` TypeScript 인터페이스 정의 — 항목 DB 구조(name, quantity, unit_price, amount) 반영
  - 노션 API 응답 타입 정의
  - 환경변수 타입 정의 (`NOTION_API_KEY`, `NOTION_INVOICE_DB_ID`, `NOTION_ITEMS_DB_ID`)

**완료 기준**: 공개 조회/오류 라우트가 빈 페이지로 접근 가능, 타입 정의 완료, 라우팅 동작.

---

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

> **목표**: 공개 조회 페이지와 오류 페이지 UI를 하드코딩된 더미 데이터로 완성한다. 노션 API 연동 전에도 전체 화면 플로우를 검증할 수 있게 한다.

- [✅] Task 003: 공통 컴포넌트 및 더미 데이터 유틸리티 구현
  - shadcn/ui 기반 필요 컴포넌트만 추가 (Button, Card, Skeleton, Table 등)
  - 더미 Invoice + InvoiceItem 데이터 유틸리티 작성
  - 토스트(sonner) 패턴 확립

- [✅] Task 004: 견적서 공개 조회 및 오류 페이지 UI 완성 (F002, F003)
  - 공개 조회 페이지 UI: 견적서 헤더(client, date), 항목 테이블(name/quantity/unit_price/amount), 합계(total), "PDF 다운로드" 버튼
  - 오류 안내 페이지 UI: "존재하지 않거나 삭제되었습니다" 메시지
  - 로딩/스켈레톤 상태 UI 및 반응형/모바일 최적화

**완료 기준**: 공개 조회 페이지와 오류 페이지가 더미 데이터로 완전히 렌더링, 화면 플로우(공개조회→PDF 버튼) 동작, 반응형 검증 완료.

---

### Phase 3: 노션 API 연동 및 핵심 기능 구현 ✅

> **목표**: 환경변수 Notion API Key로 노션 데이터베이스에서 slug를 조회하고 페이지를 실시간 렌더링하며, PDF 다운로드를 구현하여 MVP를 완성한다.

- [✅] Task 005: 환경변수 설정 및 노션 API 클라이언트 구성
  - 환경변수 구성 (`NOTION_API_KEY`, `NOTION_INVOICE_DB_ID`, `NOTION_ITEMS_DB_ID`)
  - `@notionhq/client` 서버 사이드 클라이언트 유틸 작성 (`src/lib/notion.ts`)
  - 견적서 DB에서 slug로 견적서 + items Relation page_id 목록 조회 함수 구현 (F001)
  - **Playwright MCP로 유효/무효 slug 조회 동작 검증 E2E 테스트**

- [✅] Task 006: 항목 조회 및 견적서 렌더링 구현 (F002)
  - items Relation page_id 배열 → 각 항목 DB 페이지 개별 조회
  - 견적서 UI 렌더링: 헤더(client, date) + 항목 테이블(name/quantity/unit_price/amount) + 합계(total)
  - 존재하지 않는 slug → 오류 안내 페이지 표시
  - Playwright MCP로 유효 링크 렌더링 및 무효 링크 오류 페이지 E2E 테스트 완료

- [✅] Task 007: PDF 다운로드 구현 (F003)
  - "PDF 다운로드" 버튼 클릭 시 @react-pdf/renderer로 PDF 생성 및 다운로드
  - 한글 폰트(Noto Sans KR ttf) 로컬 포함, 항목 테이블 + 합계 레이아웃 보존
  - Playwright MCP로 PDF 파일 생성 E2E 테스트 완료

- [✅] Task 008: 핵심 기능 통합 테스트
  - **Playwright MCP로 공개 조회 → PDF 다운로드 핵심 플로우 통합 테스트**
  - 에러 핸들링 및 엣지 케이스 테스트 (노션 DB에 없는 slug, 삭제된 노션 페이지, 노션 API 오류)

**완료 기준**: 노션 DB slug 조회, 클라이언트 공개 조회, PDF 다운로드까지 전체 MVP 플로우 동작, 통합 E2E 테스트 통과.

---

### Phase 4: 최적화 및 배포 ✅

> **목표**: 성능 최적화와 환경변수 기반 배포 파이프라인을 구축하여 프로덕션 출시 준비를 완료한다.

- [✅] Task 009: 성능 최적화 및 에러 처리 강화
  - 노션 페이지 렌더링 캐싱 전략 적용 (Next.js revalidate 또는 단기 캐싱)
  - 로딩/에러 바운더리 정비 및 사용자 피드백 개선
  - 노션 API 레이트 리밋/오류 처리

- [✅] Task 010: Vercel 배포 및 환경 구성
  - Vercel 프로젝트 연결 및 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_INVOICE_DB_ID`, `NOTION_ITEMS_DB_ID`)
  - 프로덕션 빌드 검증 및 도메인 연결
  - 기본 모니터링/로깅 구성

**완료 기준**: 프로덕션 환경 정상 배포, 환경변수 기반 노션 연동 및 공유 링크 동작 확인.

---

## 기술적 의사결정 사항 (미결정 항목)

다음 항목은 구현 단계에서 검증 후 확정한다.

| 항목 | 후보 | 결정 기준 |
|------|------|-----------|
| PDF 생성 | `html2canvas + jsPDF` vs `@react-pdf/renderer` | html2canvas는 렌더링 화면 그대로 캡처(구현 단순), @react-pdf/renderer는 레이아웃 정밀 제어 가능. 품질/구현 비용 기준 결정 |
| 노션 DB 조회 방식 | 매 요청 실시간 조회 vs Next.js revalidate 캐싱 | 실시간성(F002) vs 성능/레이트 리밋 기준 결정 |
| items 조회 방식 | Relation page_id 개별 조회 vs Items DB 전체 필터 조회 | 항목 수가 적으면 개별 조회, 많으면 필터 조회가 레이트 리밋 측면에서 유리 |

---

## MVP 이후 백로그

PRD에서 MVP 범위 제외로 명시된 기능 (추후 우선순위 재평가).

- [ ] 인증 시스템 (회원가입/로그인/로그아웃, 대시보드)
- [ ] 별도 데이터베이스 도입 (Supabase 등)
- [ ] 견적서 만료일 설정
- [ ] 견적서 열람 횟수/통계 확인
- [ ] 비밀번호로 견적서 보호
- [ ] 견적서 커스텀 브랜딩 (로고, 색상)
- [ ] 이메일 직접 발송 기능
- [ ] 여러 노션 워크스페이스 연동
- [ ] 알림 기능
