import { NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from "@/lib/constants";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 従業員のログアウト処理を行い、JWTトークンを保存しているクッキーを削除する
 */
export function POST() {
    // クライアントに返すレスポンスを作成（ログアウト成功メッセージを含む）
    const response = NextResponse.json({ message: 'Logged out' });

    // JWTトークンを保存していたクッキーを削除（空文字にして、Max-Ageを0に設定）
    response.cookies.set({
        name: AUTH_TOKEN_COOKIE_NAME,
        value: '',
        httpOnly: true,
        maxAge: 0,
        // secure: process.env.NODE_ENV === 'production', // 本番環境では有効化推奨
    });

    // クッキー削除後のレスポンスを返す
    return response;
}
