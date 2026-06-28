import { format } from "date-fns";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { InvoiceSummary } from "@/types/invoice";
import { CopyLinkButton } from "./copy-link-button";

type Props = {
  invoices: InvoiceSummary[];
};

/** 합계를 원화 형식으로 변환 */
function formatKRW(amount: number) {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}

/** 날짜 문자열을 yyyy.MM.dd 형식으로 변환 */
function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "yyyy.MM.dd");
}

export function InvoiceList({ invoices }: Props) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <p className="text-lg font-medium">견적서가 없습니다</p>
        <p className="mt-1 text-sm">노션 Invoice DB에 견적서를 추가해 주세요</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>견적서명</TableHead>
          <TableHead>클라이언트</TableHead>
          <TableHead>날짜</TableHead>
          <TableHead className="text-right">합계</TableHead>
          <TableHead className="text-center">액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.name}</TableCell>
            <TableCell>{invoice.client}</TableCell>
            <TableCell>{formatDate(invoice.date)}</TableCell>
            <TableCell className="text-right">{formatKRW(invoice.total)}</TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/invoice/${invoice.slug}`} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5" />
                    바로 보기
                  </Link>
                </Button>
                <CopyLinkButton slug={invoice.slug} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
