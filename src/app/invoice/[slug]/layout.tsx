import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex justify-end px-4 py-2 border-b">
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
