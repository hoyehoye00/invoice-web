export interface InvoiceItem {
  name: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  slug: string;
  /** 견적서 수신처 (노션 Title 필드 "name" 에서 가져옴) */
  client: string;
  date: string;
  total: number;
  items: InvoiceItem[];
}
