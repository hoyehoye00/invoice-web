import { getAllInvoices } from "@/lib/notion";
import { InvoiceList } from "@/components/admin/invoice-list";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminPage() {
  const invoices = await getAllInvoices();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">견적서 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            노션 Invoice DB의 견적서 목록입니다
          </p>
        </div>
        <LogoutButton />
      </div>
      <InvoiceList invoices={invoices} />
    </div>
  );
}
