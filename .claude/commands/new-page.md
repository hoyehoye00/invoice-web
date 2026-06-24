# /new-page — 새 App Router 페이지 스캐폴딩

새 페이지를 만들 때 반복되는 작업(파일 생성 → 레이아웃 연결 → 네비 등록)을 자동화합니다.

## 사용법

```
/new-page <페이지-경로> [페이지-한글-제목] [아이콘명]
```

**예시:**
- `/new-page users 사용자 관리 Users`
- `/new-page settings/profile 프로필 설정 UserCog`
- `/new-page analytics 분석 BarChart3`

인수가 없으면 사용자에게 아래 3가지를 질문하세요:
1. 페이지 경로 (예: `users`, `settings/profile`)
2. 페이지 제목 (한글 또는 영문)
3. lucide-react 아이콘명 (기본값: `FileText`)

---

## 실행 절차

### 1단계 — 기존 파일 확인

```
src/app/<경로>/page.tsx
src/components/layout/nav-items.ts
```

이미 해당 경로의 페이지가 존재하면 덮어쓰기 전에 사용자에게 확인을 요청하세요.

### 2단계 — 필요한 shadcn/ui 컴포넌트 확인

사용자가 추가로 사용할 컴포넌트를 지정했다면, `src/components/ui/` 디렉토리에 해당 파일이 있는지 확인합니다.
없는 컴포넌트가 있으면 `npx shadcn add <컴포넌트명>`을 실행합니다.

### 3단계 — 페이지 파일 생성

`src/app/<경로>/page.tsx`를 아래 템플릿으로 생성합니다.

**템플릿 패턴** (기존 `src/app/page.tsx` 패턴을 따름):

```tsx
import { MainLayout } from "@/components/layout/main-layout";

export default function <PascalCase경로>Page() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1><페이지-제목></h1>
          <p className="text-muted-foreground">
            <페이지-제목> 페이지입니다.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
```

규칙:
- 클라이언트 상태(`useState` 등)가 없으면 `"use client"` 제거 (Server Component 유지)
- 경로명은 PascalCase로 변환 (예: `settings/profile` → `SettingsProfilePage`)
- import는 프로젝트 규칙대로 `@/` 경로 별칭 사용

### 4단계 — NAV_ITEMS에 항목 추가

`src/components/layout/nav-items.ts`의 `NAV_ITEMS` 배열에 항목을 추가합니다.

**현재 패턴:**
```ts
import {
  LayoutDashboard,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/docs", label: "문서", icon: BookOpen },
];
```

추가할 항목:
```ts
{ href: "/<경로>", label: "<페이지-제목>", icon: <아이콘명> },
```

- lucide-react import 목록에 아이콘을 추가합니다.
- 아이콘명이 lucide-react에 존재하지 않을 수 있으니, 비슷한 대안을 제안해도 됩니다.

### 5단계 — 완료 보고

작업 완료 후 아래 형식으로 보고합니다:

```
✅ 페이지 생성 완료

생성된 파일:
  src/app/<경로>/page.tsx

네비게이션 추가:
  NAV_ITEMS ← { href: "/<경로>", label: "<제목>", icon: <아이콘> }

개발 서버에서 확인:
  http://localhost:3000/<경로>
```

---

## 주의사항

- `src/components/ui/`의 shadcn 컴포넌트는 직접 수정하지 않습니다.
- 스타일링은 TailwindCSS v4 클래스 + `cn()` 유틸리티를 사용합니다 (`src/lib/utils.ts`).
- 다크모드는 별도 처리 불필요 — `next-themes` + CSS 변수로 자동 지원됩니다.
- 새 페이지에 폼이 필요하면 `/new-form` 커맨드를 안내하세요.
