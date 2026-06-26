import type { Invoice, InvoiceItem } from "@/types/invoice";

export const DUMMY_ITEMS: InvoiceItem[] = [
  { name: "기획 컨설팅", quantity: 10, unit_price: 100000, amount: 1000000 },
  { name: "UI/UX 디자인", quantity: 5, unit_price: 120000, amount: 600000 },
  { name: "프론트엔드 개발", quantity: 20, unit_price: 150000, amount: 3000000 },
];

export const DUMMY_INVOICE: Invoice = {
  slug: "client-abc-2026",
  client: "ABC 클라이언트",
  date: "2026-06-26",
  total: 4600000,
  items: DUMMY_ITEMS,
};
