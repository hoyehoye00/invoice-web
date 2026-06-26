import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX2, Home } from "lucide-react";

/**
 * 존재하지 않는 slug 접근 시 표시되는 오류 안내 페이지
 */
export default function InvoiceNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 text-center px-4">

      {/* 아이콘 배경 원 */}
      <div
        className="relative flex items-center justify-center w-24 h-24 rounded-full bg-muted"
        aria-hidden="true"
      >
        {/* 바깥 링 */}
        <div className="absolute inset-0 rounded-full border-2 border-border opacity-60" />
        <FileX2 className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
      </div>

      {/* 메시지 */}
      <div className="space-y-3 max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          404 — 견적서를 찾을 수 없음
        </p>
        {/* globals.css h1 스타일 오버라이드: 비즈니스 문서 페이지에 적합한 크기로 조정 */}
        <p className="text-2xl font-bold tracking-tight">
          이 견적서는 존재하지 않습니다
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          링크가 잘못되었거나 견적서가 삭제되었을 수 있습니다.
          <br />
          전달받은 링크를 다시 확인하거나 담당자에게 문의해 주세요.
        </p>
      </div>

      {/* 홈 버튼 */}
      <Button asChild variant="outline" size="default">
        <Link href="/" className="gap-2">
          <Home className="w-4 h-4" aria-hidden="true" />
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  );
}
