"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function InvoiceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Invoice] 견적서 로드 오류:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 text-center px-4">
      <div
        className="relative flex items-center justify-center w-24 h-24 rounded-full bg-muted"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border-2 border-border opacity-60" />
        <AlertTriangle className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
      </div>

      <div className="space-y-3 max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          오류 발생
        </p>
        <p className="text-2xl font-bold tracking-tight">견적서를 불러올 수 없습니다</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          일시적인 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도하거나 담당자에게 문의해 주세요.
        </p>
      </div>

      <Button onClick={reset} variant="outline" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        다시 시도
      </Button>
    </div>
  );
}
