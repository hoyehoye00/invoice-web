# Task 001: 프로젝트 라우트 구조 및 빈 페이지 골격 생성

## 목표

Next.js 15 App Router 기반으로 견적서 공개 조회 라우트(`/invoice/[slug]`)의 빈 페이지 골격과 미니멀 레이아웃을 구성한다. 오류 안내 페이지(`not-found.tsx`)도 함께 생성한다.

## 관련 기능

- F001: slug로 견적서 조회
- F002: 노션 페이지 실시간 렌더링
- F003: PDF 다운로드

## 관련 파일

| 파일 | 타입 | 설명 |
|------|------|------|
| `src/app/invoice/[slug]/layout.tsx` | CREATE | 미니멀 레이아웃 (Header/Sidebar 없음) |
| `src/app/invoice/[slug]/page.tsx` | CREATE | 견적서 공개 조회 페이지 골격 |
| `src/app/invoice/[slug]/not-found.tsx` | CREATE | 존재하지 않는 slug 오류 안내 페이지 |
| `src/app/layout.tsx` | REFERENCE | 루트 레이아웃 패턴 참조 |
| `src/app/page.tsx` | REFERENCE | 독립 레이아웃 패턴 참조 |
| `shrimp-rules.md` | REFERENCE | 라우팅 규칙 §3 참조 |

## 수락 기준

- [ ] `localhost:3000/invoice/test-slug` 접속 시 빈 페이지 렌더링 (Header/Sidebar/Footer 없음)
- [ ] not-found 페이지에 "이 견적서는 존재하지 않거나 삭제되었습니다" 메시지 표시
- [ ] `npm run build` 오류 없음
- [ ] TypeScript 타입 오류 없음
- [ ] `MainLayout` 미사용 확인 (shrimp-rules §3, §11 준수)

## 구현 단계

### Step 1: layout.tsx — 미니멀 레이아웃 생성
- 서버 컴포넌트 (use client 불필요)
- MainLayout 사용 금지 (shrimp-rules §3)
- 단순 래퍼: `min-h-screen bg-background` 컨테이너 + `mx-auto max-w-4xl px-4 py-8` 내부 main
- 루트 layout.tsx의 Provider(ThemeProvider, TooltipProvider, Toaster)는 이미 상속됨

### Step 2: page.tsx — 빈 페이지 골격 생성
- 서버 컴포넌트
- Next.js 15 async params: `params: Promise<{ slug: string }>` → `const { slug } = await params`
- `generateMetadata` 함수로 동적 메타데이터 설정
- 현재는 slug 값만 표시하는 빈 껍데기

### Step 3: not-found.tsx — 오류 안내 페이지 생성
- 오류 안내 메시지: "이 견적서는 존재하지 않거나 삭제되었습니다"
- `lucide-react`의 `FileX` 아이콘 활용
- 홈(`/`)으로 돌아가는 링크 버튼 포함
- shadcn/ui `Button` 컴포넌트 활용

## 진행 상황

- [ ] Step 1: layout.tsx 생성
- [ ] Step 2: page.tsx 생성
- [ ] Step 3: not-found.tsx 생성
- [ ] 빌드 검증
