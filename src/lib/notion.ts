import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import type { Invoice, InvoiceItem, InvoiceSummary } from "@/types/invoice";
import type { NotionInvoiceRow, NotionItemRow } from "@/types/notion";

// 서버 전용 — 클라이언트 컴포넌트에서 import 금지
const notionClient = new Client({ auth: process.env.NOTION_API_KEY });

/** 노션 API 응답을 InvoiceItem으로 변환 */
async function fetchInvoiceItems(pageIds: string[]): Promise<InvoiceItem[]> {
  const results = await Promise.allSettled(
    pageIds.map((id) => notionClient.pages.retrieve({ page_id: id }))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof notionClient.pages.retrieve>>> =>
        r.status === "fulfilled"
    )
    .map((r) => {
      const props = (r.value as unknown as NotionItemRow).properties;
      return {
        name: props.name?.title?.[0]?.plain_text ?? "",
        quantity: props.quantity?.number ?? 0,
        unit_price: props.unit_price?.number ?? 0,
        amount: props.amount?.formula?.number ?? 0,
      };
    });
}

/** 노션 DB에서 slug로 견적서 + 항목 전체 조회 (캐싱 없는 내부 함수) */
async function fetchFullInvoice(slug: string): Promise<Invoice | null> {
  const dbId = process.env.NOTION_INVOICE_DB_ID;
  if (!dbId) throw new Error("NOTION_INVOICE_DB_ID 환경변수가 설정되지 않았습니다");

  const response = await notionClient.databases.query({
    database_id: dbId,
    filter: {
      property: "slug",
      rich_text: { equals: slug },
    },
  });

  if (response.results.length === 0) return null;

  const row = response.results[0] as unknown as NotionInvoiceRow;
  const props = row.properties;
  const itemPageIds = props.items?.relation.map((r) => r.id) ?? [];
  const items = itemPageIds.length > 0 ? await fetchInvoiceItems(itemPageIds) : [];

  return {
    slug: props.slug?.rich_text?.[0]?.plain_text ?? "",
    client: props.name?.title?.[0]?.plain_text ?? "",
    date: props.date?.date?.start ?? "",
    total: props.total?.number ?? 0,
    items,
  };
}

/**
 * slug로 견적서 + 항목 목록 전체 조회 (F001, F002)
 * slug별 60초 캐싱 — 노션 API 레이트 리밋 대응
 */
export function getFullInvoice(slug: string): Promise<Invoice | null> {
  return unstable_cache(
    fetchFullInvoice,
    [`invoice-${slug}`],
    { revalidate: 60, tags: [`invoice-${slug}`] }
  )(slug);
}

/** 노션 Invoice DB 전체 조회 → InvoiceSummary 배열 반환 (캐싱 없는 내부 함수) */
async function fetchAllInvoices(): Promise<InvoiceSummary[]> {
  const dbId = process.env.NOTION_INVOICE_DB_ID;
  if (!dbId) throw new Error("NOTION_INVOICE_DB_ID 환경변수가 설정되지 않았습니다");

  const response = await notionClient.databases.query({
    database_id: dbId,
    sorts: [{ property: "date", direction: "descending" }],
  });

  return response.results.map((result) => {
    const row = result as unknown as NotionInvoiceRow;
    const props = row.properties;
    return {
      id: row.id,
      name: props.name?.title?.[0]?.plain_text ?? "(제목 없음)",
      slug: props.slug?.rich_text?.[0]?.plain_text ?? "",
      client: props.name?.title?.[0]?.plain_text ?? "",
      date: props.date?.date?.start ?? "",
      total: props.total?.number ?? 0,
    };
  });
}

/**
 * 관리자용 견적서 전체 목록 조회
 * 60초 캐싱 — 목록 갱신 빈도 대응
 */
export const getAllInvoices = unstable_cache(
  fetchAllInvoices,
  ["all-invoices"],
  { revalidate: 60, tags: ["all-invoices"] }
);
