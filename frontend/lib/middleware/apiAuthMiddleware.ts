import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/utils/authUtils';
import { AUTH_TOKEN_COOKIE_NAME, EMPLOYEE_ID_HEADER } from "@/lib/constants";

/**
 * API用認証ミドルウェア関数
 */
export async function apiAuthMiddleware(request: NextRequest): Promise<NextResponse> {
    const pathname = request.nextUrl.pathname;

    // 認証処理をスキップするパス（認証APIなど）
    if (pathname.startsWith('/api/auth/login')) {
        return NextResponse.next();
    }

    // CookieからJWTトークンを取得
    const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;

    // トークンが存在しない場合はステータスコード401を返却
    if (!token) {
        return unauthorizedResponse('認証トークンが存在しません');
    }

    // JWTトークンを検証しペイロードを取得
    const payload = await verifyJwt(token);

    // トークンが無効、もしくはemployeeIdがない場合もステータスコード401を返却
    if (!payload?.employeeId) {
        return unauthorizedResponse('無効なトークンです');
    }

    // 認証成功時はレスポンスヘッダーに employeeId をセットしリクエストを続行
    const response = NextResponse.next();
    response.headers.set(EMPLOYEE_ID_HEADER, String(payload.employeeId));
    return response;
}

/**
 * 認証失敗時の JSON レスポンスを返す
 */
function unauthorizedResponse(message: string): NextResponse {
    return NextResponse.json(
        { error: message },
        { status: 401 }
    );
}
