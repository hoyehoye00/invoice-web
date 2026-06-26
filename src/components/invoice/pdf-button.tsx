"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { Invoice } from "@/types/invoice";

export function PdfButton({ invoice }: { invoice: Invoice }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { InvoicePdf } = await import("./invoice-pdf");

      const blob = await pdf(<InvoicePdf invoice={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `견적서-${invoice.slug}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} variant="default" disabled={loading}>
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      PDF 다운로드
    </Button>
  );
}
