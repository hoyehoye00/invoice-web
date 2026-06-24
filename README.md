# 노션 견적서 서비스

노션에서 작성한 견적서를 클라이언트에게 웹 링크로 공유하고 PDF로 다운로드할 수 있는 서비스입니다.

## 프로젝트 개요

**목적**: 프리랜서/소규모 사업자가 노션에서 작성한 견적서를 클라이언트에게 웹 링크로 공유하고 PDF로 다운받을 수 있게 한다

**타겟 사용자**: 노션을 사용하는 프리랜서 및 소규모 사업자, 그리고 견적서를 받는 클라이언트

## 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 — 서비스 소개 및 회원가입/로그인 유도 |
| `/signup` | 회원가입 페이지 — 이메일/비밀번호 회원가입 |
| `/login` | 로그인 페이지 — 이메일/비밀번호 로그인 |
| `/dashboard` | 대시보드 — 노션 연동 관리 및 견적서 관리 (인증 필요) |
| `/i/[slug]` | 견적서 공개 조회 — 클라이언트가 공유 URL로 접속하여 확인 및 PDF 다운로드 |

## 핵심 기능

- **노션 연동**: 노션 워크스페이스를 OAuth로 연결하고 견적서 페이지 목록 조회
- **공유 링크 생성**: 견적서마다 고유 slug 기반 공개 URL 자동 생성
- **견적서 공개 조회**: 인증 없이 공유 링크로 견적서 내용 확인
- **PDF 다운로드**: 클라이언트가 견적서를 PDF로 저장
- **링크 활성화/비활성화**: 공유 링크 공개 여부 토글

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router, Turbopack) | 15.5 |
| 언어 | TypeScript | 5 |
| Runtime | React | 19 |
| UI 컴포넌트 | shadcn/ui (radix-nova 스타일) | 4 |
| 스타일링 | TailwindCSS | 4 |
| 인증 + DB | Supabase | - |
| 노션 연동 | @notionhq/client | - |
| 폼 | react-hook-form + zod | 7 / 4 |
| 배포 | Vercel | - |

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 Supabase, Notion API 키 입력

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NOTION_CLIENT_ID=
NOTION_CLIENT_SECRET=
NOTION_REDIRECT_URI=
```

## 개발 상태

- [x] 기본 프로젝트 구조 설정
- [ ] Supabase 인증 연동 (회원가입/로그인)
- [ ] 노션 OAuth 연동
- [ ] 견적서 목록 조회 및 공유 링크 생성
- [ ] 견적서 공개 조회 페이지
- [ ] PDF 다운로드 기능

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 가이드](./CLAUDE.md) - 개발 지침
