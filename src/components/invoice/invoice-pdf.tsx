"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";

// 한글 폰트 — 구글 Noto Sans KR (CDN)
// @react-pdf는 상대경로 미지원 — window.location.origin으로 절대 URL 구성
const fontBase = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
Font.register({
  family: "NotoSansKR",
  fonts: [
    { src: `${fontBase}/fonts/NotoSansKR-Regular.ttf`, fontWeight: 400 },
    { src: `${fontBase}/fonts/NotoSansKR-Bold.ttf`, fontWeight: 700 },
  ],
});

const KRW = (n: number) => n.toLocaleString("ko-KR") + "원";

const s = StyleSheet.create({
  page: { fontFamily: "NotoSansKR", fontSize: 10, padding: 40, color: "#111" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  title: { fontSize: 22, fontWeight: 700 },
  slug: { fontSize: 9, color: "#666", marginTop: 4 },
  metaGrid: { flexDirection: "row", borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5", marginBottom: 20 },
  metaCell: { flex: 1, padding: "10px 8px" },
  metaLabel: { fontSize: 8, color: "#999", marginBottom: 4, textTransform: "uppercase" },
  metaValue: { fontSize: 10, fontWeight: 700 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f5f5f5", padding: "6px 8px", borderBottom: "1px solid #e5e5e5" },
  tableRow: { flexDirection: "row", padding: "7px 8px", borderBottom: "1px solid #f0f0f0" },
  colName: { flex: 3 },
  colNum: { flex: 1, textAlign: "right" },
  thText: { fontSize: 9, fontWeight: 700, color: "#444" },
  totalArea: { marginTop: 16, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", gap: 40, marginBottom: 4 },
  totalLabel: { fontSize: 9, color: "#888", width: 60, textAlign: "right" },
  totalValue: { fontSize: 9, color: "#888", width: 80, textAlign: "right" },
  divider: { borderTop: "1px solid #ccc", width: 160, marginVertical: 6 },
  sumLabel: { fontSize: 11, fontWeight: 700, width: 60, textAlign: "right" },
  sumValue: { fontSize: 14, fontWeight: 700, width: 80, textAlign: "right" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#bbb" },
});

export function InvoicePdf({ invoice }: { invoice: Invoice }) {
  const supplyPrice = Math.round(invoice.total / 1.1);
  const vat = invoice.total - supplyPrice;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* 헤더 */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>견적서</Text>
            <Text style={s.slug}>{invoice.slug}</Text>
          </View>
        </View>

        {/* 발신처 / 수신처 / 발행일 */}
        <View style={s.metaGrid}>
          <View style={s.metaCell}>
            <Text style={s.metaLabel}>발신처</Text>
            <Text style={s.metaValue}>My Company</Text>
            <Text style={{ fontSize: 8, color: "#888", marginTop: 2 }}>contact@mycompany.com</Text>
          </View>
          <View style={[s.metaCell, { borderLeft: "1px solid #e5e5e5" }]}>
            <Text style={s.metaLabel}>수신처</Text>
            <Text style={s.metaValue}>{invoice.client}</Text>
          </View>
          <View style={[s.metaCell, { borderLeft: "1px solid #e5e5e5" }]}>
            <Text style={s.metaLabel}>발행일</Text>
            <Text style={s.metaValue}>{invoice.date}</Text>
          </View>
        </View>

        {/* 항목 테이블 헤더 */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colName]}>항목명</Text>
          <Text style={[s.thText, s.colNum]}>수량</Text>
          <Text style={[s.thText, s.colNum]}>단가</Text>
          <Text style={[s.thText, s.colNum]}>금액</Text>
        </View>

        {/* 항목 행 */}
        {invoice.items.map((item, i) => (
          <View key={i} style={[s.tableRow, i % 2 === 1 ? { backgroundColor: "#fafafa" } : {}]}>
            <Text style={s.colName}>{item.name}</Text>
            <Text style={s.colNum}>{item.quantity}</Text>
            <Text style={s.colNum}>{KRW(item.unit_price)}</Text>
            <Text style={[s.colNum, { fontWeight: 700 }]}>{KRW(item.amount)}</Text>
          </View>
        ))}

        {/* 합계 */}
        <View style={s.totalArea}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>공급가액</Text>
            <Text style={s.totalValue}>{KRW(supplyPrice)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>부가세 (10%)</Text>
            <Text style={s.totalValue}>{KRW(vat)}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.totalRow}>
            <Text style={s.sumLabel}>합계</Text>
            <Text style={s.sumValue}>{KRW(invoice.total)}</Text>
          </View>
        </View>

        {/* 하단 안내 */}
        <Text style={s.footer}>본 견적서는 발행일로부터 30일간 유효합니다.</Text>
      </Page>
    </Document>
  );
}
