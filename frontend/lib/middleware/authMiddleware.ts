import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/utils/authUtils';
import { AUTH_TOKEN_COOKIE_NAME, EMPLOYEE_ID_HEADER } from "@/lib/constants";

/**
 * 認証用ミドルウェア関数
  */
export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
    const pathname = request.nextUrl.pathname;

    // 認証処理をスキップするパス（ログイン画面など）
    if (
        pathname.startsWith('/auth/login') ||
        pathname.startsWith('/api/auth/login')
    ) {
        return NextResponse.next();
    }

    // CookieからJWTトークンを取得
    const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

    // トークンが存在しない場合はログイン画面にリダイレクト
    if (!token) {
        return redirectToLogin(request);
    }

    // JWTトークンを検証しペイロードを取得
    const payload = await verifyJwt(token);

    // トークンが無効、もしくはemployeeIdがない場合もログインへリダイレクト
    if (!payload?.employeeId) {
        return redirectToLogin(request);
    }

    // 認証成功時はレスポンスヘッダーに employeeId をセットしリクエストを続行
    const response = NextResponse.next();
    response.headers.set(EMPLOYEE_ID_HEADER, String(payload.employeeId));
    return response;
}

/**
 * ログイン画面へリダイレクトするヘルパー関数
 * @param request - NextRequest
 * @returns ログイン画面へのリダイレクトレスポンス
 */
function redirectToLogin(request: NextRequest): NextResponse {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
}
