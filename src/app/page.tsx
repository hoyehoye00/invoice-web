import Link from "next/link";
import { FileText, Link2, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * 랜딩 페이지 — 서비스 소개 및 회원가입/로그인 유도
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            <span>노션 견적서</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">무료로 시작하기</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <Badge variant="secondary" className="gap-1.5">
            <FileText className="h-3 w-3" />
            노션 연동 견적서 서비스
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            노션 견적서를
            <br />
            웹 링크로 공유하세요
          </h1>

          <p className="text-lg text-muted-foreground">
            노션에서 작성한 견적서를 클라이언트에게 깔끔한 웹 링크로 공유하고,
            <br className="hidden sm:block" />
            PDF로 다운로드할 수 있습니다.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2 w-full sm:w-auto" asChild>
              <Link href="/signup">
                무료로 시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" asChild>
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>

        {/* 핵심 기능 3가지 */}
        <div className="mt-24 grid w-full max-w-3xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: Link2,
              title: "노션 연동",
              description: "노션 워크스페이스를 연결하고 견적서 페이지를 가져옵니다.",
            },
            {
              icon: FileText,
              title: "웹 링크 공유",
              description: "고유 URL을 생성하여 클라이언트에게 견적서를 공유합니다.",
            },
            {
              icon: Download,
              title: "PDF 다운로드",
              description: "클라이언트가 견적서를 PDF로 저장할 수 있습니다.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} 노션 견적서 서비스. All rights reserved.
          </p>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              이용약관
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
