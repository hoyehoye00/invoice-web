"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="mb-4 h-10 w-10 text-destructive" />
      <h2 className="text-lg font-semibold">견적서 목록을 불러오지 못했습니다</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message ?? "노션 API 호출 중 오류가 발생했습니다"}
      </p>
      <Button onClick={reset} className="mt-6" variant="outline">
        다시 시도
      </Button>
    </div>
  );
}
