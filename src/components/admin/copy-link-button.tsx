"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildInvoiceShareUrl } from "@/lib/utils";

type Props = {
  slug: string;
};

/** 견적서 공유 링크를 클립보드에 복사하는 버튼 */
export function CopyLinkButton({ slug }: Props) {
  const handleCopy = async () => {
    const url = buildInvoiceShareUrl(slug);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("링크가 복사되었습니다");
    } catch {
      toast.error("링크 복사에 실패했습니다");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
      <Copy className="h-3.5 w-3.5" />
      링크 복사
    </Button>
  );
}
