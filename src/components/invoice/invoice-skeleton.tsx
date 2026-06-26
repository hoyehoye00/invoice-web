import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/**
 * 견적서 로딩 중 표시되는 스켈레톤 UI
 * page.tsx의 개선된 레이아웃(단일 카드 구조)과 1:1 대응
 */
export function InvoiceSkeleton() {
  return (
    <div className="space-y-0">
      <Card className="overflow-hidden shadow-sm">

        {/* ── 상단 헤더 바 스켈레톤 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            {/* 아이콘 */}
            <Skeleton className="w-5 h-5 rounded" />
            {/* "견적서" 텍스트 */}
            <Skeleton className="h-5 w-16" />
            {/* slug 배지 */}
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
          {/* PDF 버튼 */}
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        <CardContent className="p-0">

          {/* ── 정보 섹션 스켈레톤: 발신처 / 수신처 / 발행일 */}
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {/* 발신처 */}
            <div className="px-6 py-5 space-y-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
            {/* 수신처 */}
            <div className="px-6 py-5 space-y-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-32" />
            </div>
            {/* 발행일 */}
            <div className="px-6 py-5 space-y-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Separator />

          {/* ── 테이블 헤더 스켈레톤 */}
          <div className="px-6 py-3 bg-muted/40 flex items-center gap-4">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-12 ml-auto" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* ── 테이블 행 스켈레톤 (3행) */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 flex items-center gap-4 border-t border-border"
            >
              <Skeleton className="h-4 w-[40%]" />
              <Skeleton className="h-4 w-8 ml-auto" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}

          <Separator />

          {/* ── 합계 섹션 스켈레톤 */}
          <div className="flex flex-col items-end gap-2 px-6 py-5 bg-muted/30">
            {/* 공급가액 */}
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-36" />
            </div>
            {/* 부가세 */}
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
            {/* 구분선 */}
            <Skeleton className="h-px w-64 my-1" />
            {/* 합계 강조 */}
            <div className="flex items-center gap-6">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-8 w-36" />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ── 하단 안내 문구 스켈레톤 */}
      <div className="flex justify-center pt-4 pb-2">
        <Skeleton className="h-3 w-56" />
      </div>
    </div>
  );
}
