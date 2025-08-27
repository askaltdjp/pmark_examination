"use server";

import { cookies } from 'next/headers'
import { loginService } from "@/services/actions/auth/loginService";
import { AUTH_TOKEN_COOKIE_NAME, AUTH_TOKEN_COOKIE_MAX_AGE } from "@/lib/definitions/system";

/**
 * ユーザ認証を行うサーバアクション
 * 認証に成功した場合はJWTトークンをHttpOnlyクッキーにセットする
 * 認証に失敗した場合は例外を投げる
 */
export async function loginAction(emailAddress: string, password: string): Promise<void> {
    // 認証サービスを呼び出し、トークンを取得
    const token = await loginService(emailAddress, password);

    if (token) {
        // JWTトークンをクッキーにセット
        (await cookies()).set({
            name: AUTH_TOKEN_COOKIE_NAME,
            value: token,
            httpOnly: true, // JavaScript からアクセス不可
            // secure: process.env.NODE_ENV === 'production', // HTTPS 通信時のみ送信
            maxAge: AUTH_TOKEN_COOKIE_MAX_AGE,
            path: '/',
        });
    } else {
        // 認証に失敗した場合はエラーを投げる
        throw new Error("Invalid credentials");
    }
}