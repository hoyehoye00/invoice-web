import { MainLayout } from "@/components/layout/main-layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout showHeader showSidebar showFooter={false}>
      {children}
    </MainLayout>
  );
}
