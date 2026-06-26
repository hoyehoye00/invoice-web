import { notFound } from "next/navigation";
import { getFullInvoice } from "@/lib/notion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PdfButton } from "@/components/invoice/pdf-button";
import { Building2, CalendarDays, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `견적서 — ${slug}` };
}

/** 원화 포맷 유틸리티 */
const KRW = (n: number) => n.toLocaleString("ko-KR") + "원";

export default async function InvoicePage({ params }: Props) {
  const { slug } = await params;
  const invoice = await getFullInvoice(slug);

  // 존재하지 않는 slug → not-found.tsx 표시
  if (!invoice) notFound();

  return (
    <div id="invoice-content" className="space-y-0">
      {/* ── 문서 전체 래퍼: 단일 카드 */}
      <Card className="overflow-hidden shadow-sm p-0">

        {/* ── 상단 헤더 바: 제목 + PDF 버튼 */}
        <div className="flex items-center justify-between px-6 py-7 border-b border-border bg-muted/90">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
            <span className="text-xl font-bold tracking-tight">견적서</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {invoice.slug}
            </Badge>
          </div>
          {/* PDF 다운로드 버튼 — 헤더 우측 배치 */}
          <PdfButton invoice={invoice} />
        </div>

        <CardContent className="p-0">

          {/* ── 정보 섹션: 발신처 / 수신처 / 발행일 */}
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">

            {/* 발신처 */}
            <div className="px-6 py-5 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                발신처
              </p>
              <p className="text-sm font-semibold">My Company</p>
              <p className="text-xs text-muted-foreground">contact@mycompany.com</p>
            </div>

            {/* 수신처 (고객사) */}
            <div className="px-6 py-5 flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                수신처
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <Building2 className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="translate-y-px">{invoice.client}</span>
              </span>
            </div>

            {/* 발행일 */}
            <div className="px-6 py-5 flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                발행일
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="translate-y-px">{invoice.date}</span>
              </span>
            </div>
          </div>

          <Separator />

          {/* ── 항목 테이블 */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6 w-[40%] font-semibold text-foreground">
                    항목명
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">
                    수량
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">
                    단가
                  </TableHead>
                  <TableHead className="text-right pr-6 font-semibold text-foreground">
                    금액
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, idx) => (
                  <TableRow
                    key={idx}
                    className={cn(
                      "transition-colors",
                      /* 홀수 행 줄무늬 */
                      idx % 2 === 1 && "bg-muted/20"
                    )}
                  >
                    <TableCell className="pl-6 font-medium">{item.name}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {KRW(item.unit_price)}
                    </TableCell>
                    <TableCell className="text-right pr-6 tabular-nums font-medium">
                      {KRW(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* ── 합계 섹션: 테이블 아래 독립 강조 영역 */}
          <div
            className="flex flex-col items-end gap-1 px-6 py-5 bg-muted/30"
            aria-label="견적 합계"
          >
            {/* 소계 보조 정보 (더미) */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>공급가액</span>
              <span className="tabular-nums w-36 text-right">
                {KRW(Math.round(invoice.total / 1.1))}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>부가세 (10%)</span>
              <span className="tabular-nums w-36 text-right">
                {KRW(invoice.total - Math.round(invoice.total / 1.1))}
              </span>
            </div>

            <Separator className="my-2 w-64" />

            {/* 최종 합계 강조 */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold">합계</span>
              <span className="tabular-nums text-2xl font-bold tracking-tight w-36 text-right">
                {KRW(invoice.total)}
              </span>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ── 하단 안내 문구 */}
      <p className="print:hidden text-center text-xs text-muted-foreground pt-4 pb-2">
        본 견적서는 발행일로부터 30일간 유효합니다.
      </p>
    </div>
  );
}
