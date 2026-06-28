"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ExternalLink, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { InvoiceSummary } from "@/types/invoice";
import { CopyLinkButton } from "./copy-link-button";

type Props = {
  invoices: InvoiceSummary[];
};

function formatKRW(amount: number) {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "yyyy.MM.dd");
}

export function InvoiceList({ invoices }: Props) {
  const [query, setQuery] = useState("");

  // 견적서명 + 클라이언트명 대소문자 무관 검색
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(
      (inv) =>
        inv.name.toLowerCase().includes(q) ||
        inv.client.toLowerCase().includes(q) ||
        inv.slug.toLowerCase().includes(q)
    );
  }, [invoices, query]);

  const hasFilter = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* 검색 바 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="견적서명, 클라이언트, slug 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {hasFilter && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="검색어 초기화"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 결과 카운트 배지 */}
        {hasFilter && (
          <Badge variant="secondary">
            {filtered.length} / {invoices.length}건
          </Badge>
        )}
      </div>

      {/* 목록 없음 */}
      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <p className="text-lg font-medium">견적서가 없습니다</p>
          <p className="mt-1 text-sm">노션 Invoice DB에 견적서를 추가해 주세요</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <p className="text-base font-medium">검색 결과가 없습니다</p>
          <p className="mt-1 text-sm">
            &ldquo;{query}&rdquo; 에 해당하는 견적서를 찾을 수 없습니다
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => setQuery("")}
          >
            검색어 초기화
          </Button>
        </div>
      ) : (
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
            {filtered.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.name}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell className="text-right">
                  {formatKRW(invoice.total)}
                </TableCell>
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
      )}
    </div>
  );
}
