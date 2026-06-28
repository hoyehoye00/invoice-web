import { NextRequest, NextResponse } from "next/server";

/** 관리자 로그인: ADMIN_PASSWORD 비교 후 HttpOnly 세션 쿠키 발급 */
export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "서버 설정 오류입니다" },
      { status: 500 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "authenticated", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 86400, // 24시간
  });
  return response;
}
