import type { NextRequest } from 'next/server';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { apiAuthMiddleware } from '@/lib/middleware/apiAuthMiddleware';

/**
 * Next.js Middleware エントリーポイント
 * API か ページ遷移かで適切な認証ミドルウェアを呼び分ける
 */
export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // APIリクエストの場合は、API用のミドルウェアを使用
    if (pathname.startsWith('/api/')) {
        const response = await apiAuthMiddleware(request);
        if (response.status !== 200) {
            // 認証失敗 → そのままエラーレスポンスを返す（処理継続しない）
            return response;
        }
        return response;
    }

    // ページ遷移などは通常の認証ミドルウェアを使用
    return await authMiddleware(request);
}

export const config = {
    // このパス群に対してミドルウェアを適用
    matcher: [
        '/auth/:path*',
        '/home/:path*',
        '/api/:path*',
        '/',
    ],
};
