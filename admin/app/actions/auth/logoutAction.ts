"use server";

import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME } from "@/lib/definitions/system";

/**
 * ユーザのログアウト処理を行うサーバアクション
 * JWTトークンを保存していたクッキーを削除することで認証状態を無効化する
 */
export async function logoutAction(): Promise<void> {
    // クッキーからJWTトークンを削除
    (await cookies()).set({
        name: AUTH_TOKEN_COOKIE_NAME,
        value: "",
        httpOnly: true, // JavaScript からアクセス不可
        // secure: process.env.NODE_ENV === 'production', // HTTPS 通信時のみ送信
        maxAge: 0, // 有効期限を即切れにする
        path: '/',
    });
}