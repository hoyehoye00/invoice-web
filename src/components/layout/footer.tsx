import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} 노션 견적서 서비스. All rights reserved.
          </p>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors px-2">
              소개
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a href="#" className="hover:text-foreground transition-colors px-2">
              개인정보처리방침
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a href="#" className="hover:text-foreground transition-colors px-2">
              이용약관
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
