import { NextResponse } from "next/server";

/** 관리자 로그아웃: 세션 쿠키 삭제 후 OK 반환 (리다이렉트는 클라이언트가 담당) */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
