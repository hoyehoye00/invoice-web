import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-4">
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-muted">
        <div className="absolute inset-0 rounded-full border-2 border-border opacity-60" />
        <FileX2 className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="space-y-3 max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          404 — 페이지를 찾을 수 없음
        </p>
        <p className="text-2xl font-bold tracking-tight">페이지가 존재하지 않습니다</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          요청하신 페이지를 찾을 수 없습니다.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/" className="gap-2">
          <Home className="w-4 h-4" />
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  );
}
