import { authMiddleware } from '@/lib/middleware/authMiddleware';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware エントリーポイント
 * リクエスト毎に authMiddleware を呼び出して認証処理を行う
 */
export function middleware(request: NextRequest) {
    // 他のミドルウェアを追加する場合は、
    // authMiddleware がリダイレクトレスポンスを返した場合、
    // それ以降の処理はスキップし、そのレスポンスを即返すように注意してください。
    return authMiddleware(request);
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
