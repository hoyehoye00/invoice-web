/** 견적서 DB 행의 properties 타입 (실제 노션 필드명 기준) */
export interface NotionInvoiceProperties {
  /** 견적서 제목 — 노션 Title 필드 (예: "A회사 견적서") */
  name: { title: Array<{ plain_text: string }> };
  slug: { rich_text: Array<{ plain_text: string }> };
  date: { date: { start: string } | null };
  total: { number: number | null };
  items: { relation: Array<{ id: string }> };
}

/** 견적서 DB 행 응답 타입 */
export interface NotionInvoiceRow {
  id: string;
  properties: NotionInvoiceProperties;
}

/** 항목 DB 행의 properties 타입 */
export interface NotionItemProperties {
  name: { title: Array<{ plain_text: string }> };
  quantity: { number: number | null };
  unit_price: { number: number | null };
  amount: { formula: { number: number | null } };
}

/** 항목 DB 행 응답 타입 */
export interface NotionItemRow {
  id: string;
  properties: NotionItemProperties;
}
