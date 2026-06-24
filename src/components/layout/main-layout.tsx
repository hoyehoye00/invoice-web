import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";

type MainLayoutProps = {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
};

export function MainLayout({
  children,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header />}
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}
