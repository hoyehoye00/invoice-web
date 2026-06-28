"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

/** 관리자 로그아웃 버튼 — 세션 쿠키 삭제 후 로그인 페이지로 이동 */
export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    // 쿠키 삭제 후 서버 상태 갱신 → 미들웨어가 /admin/login으로 리다이렉트
    router.refresh();
    router.push("/admin/login");
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      로그아웃
    </Button>
  );
}
