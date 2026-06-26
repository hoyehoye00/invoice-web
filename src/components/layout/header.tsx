"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Menu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MobileSidebar } from "./sidebar";
import { NAV_ITEMS } from "./nav-items";

function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const themes = [
    { value: "light", label: "라이트", icon: Sun },
    { value: "dark", label: "다크", icon: Moon },
    { value: "system", label: "시스템", icon: Monitor },
  ];

  const CurrentIcon =
    theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="테마 변경">
          {mounted && <CurrentIcon className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        {/* 모바일 사이드바 트리거 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="메뉴 열기"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b px-6 py-4">
              <SheetTitle className="flex items-center gap-2 text-left">
                <FileText className="h-5 w-5 text-primary" />
                노션 견적서
              </SheetTitle>
            </SheetHeader>
            <MobileSidebar />
          </SheetContent>
        </Sheet>

        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
        >
          <FileText className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">노션 견적서</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 우측 액션 영역 */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
