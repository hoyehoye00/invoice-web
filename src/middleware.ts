import { NextRequest, NextResponse } from "next/server";

/** /admin 경로 접근 시 세션 쿠키 검증 — Edge Runtime에서 동작 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 페이지는 인증 없이 통과
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session");
  if (!session || session.value !== "authenticated") {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
