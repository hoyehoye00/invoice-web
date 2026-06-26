---
name: project-invoice-ui-patterns
description: 견적서 공개 조회 페이지(page.tsx)의 레이아웃 패턴 및 디자인 결정 사항
metadata:
  type: project
---

## 견적서 페이지 레이아웃 패턴

전체 문서를 단일 Card로 래핑하는 "문서형 단일 카드" 구조를 채택.

### page.tsx 구조 (3-tier)

1. **헤더 바** (`bg-muted/30`, `border-b`): 좌측 — FileText 아이콘 + "견적서" 텍스트 + slug Badge(secondary, font-mono), 우측 — PdfButton
2. **정보 섹션** (`grid-cols-1 sm:grid-cols-3`): 발신처(더미) / 수신처(client) / 발행일 — `divide-y sm:divide-y-0 sm:divide-x`로 반응형 구분선
3. **테이블** (`bg-muted/40` 헤더, 홀수행 `bg-muted/20` 줄무늬): pl-6/pr-6으로 좌우 패딩 통일, `tabular-nums` 숫자 정렬
4. **합계 섹션** (`bg-muted/30`, `flex-col items-end`): 공급가액/부가세 보조 + Separator + 합계 `text-2xl font-bold`

### 핵심 설계 결정

- `id="invoice-content"` 반드시 최외곽 div에 유지 (PDF 캡처 대상)
- `<h1>` 사용 금지: globals.css에 `h1 { text-4xl font-extrabold }` 전역 스타일 있어 레이아웃 깨짐. 대신 `<p>` 또는 `<span>`에 클래스 직접 지정
- PdfButton은 헤더 바 우측 배치 (Phase 3 구현 예정)
- 발신처는 현재 더미 고정값 ("My Company") — 추후 노션 연동 시 교체

### not-found.tsx 패턴

- `min-h-[70vh]` 수직 중앙 정렬
- 아이콘: `w-24 h-24` 원형 컨테이너(`bg-muted`) + `border-2 border-border` 바깥 링 + FileX2 아이콘
- 제목은 `<p className="text-2xl font-bold">` (h1 전역 스타일 회피)
- "홈으로 돌아가기": `Button asChild variant="outline"` + `Link` 조합

### invoice-skeleton.tsx 패턴

page.tsx 레이아웃 섹션과 1:1 대응:
- 헤더 바 → 아이콘/텍스트/배지/버튼 각각 Skeleton
- 정보 섹션 → 3열 grid, 각 열 2~3줄 Skeleton
- 테이블 → 헤더 행 1개 + 데이터 행 3개 (flex + gap-4)
- 합계 섹션 → 공급가액/부가세/구분선/합계 Skeleton

**Why:** 스켈레톤이 실제 레이아웃과 불일치하면 로딩 → 완료 전환 시 CLS(레이아웃 이동) 발생

**How to apply:** 향후 page.tsx 레이아웃 변경 시 invoice-skeleton.tsx도 반드시 함께 업데이트
