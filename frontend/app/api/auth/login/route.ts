import { NextRequest, NextResponse } from "next/server";
import { loginService } from "@/services/api/auth/loginService";
import { AUTH_TOKEN_COOKIE_NAME, AUTH_TOKEN_COOKIE_MAX_AGE } from "@/lib/constants/system";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 社員のログイン認証を行い、成功時にJWTを発行してクッキーにセットする
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    // リクエストボディからメールアドレスとパスワードを取得
    const body = await req.json();
    const { emailAddress, password } = body;

    // 認証サービスを呼び出し、トークンを取得
    const token = await loginService(emailAddress, password);

    if (token) {
        // 認証成功時はレスポンスを作成
        const response = NextResponse.json({ message: "Login successful" }, { status: 200 })

        // JWTトークンをHttpOnlyクッキーとしてセット（セキュア属性は環境に応じて設定推奨）
        response.cookies.set({
            name: AUTH_TOKEN_COOKIE_NAME,
            value: token,
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            maxAge: AUTH_TOKEN_COOKIE_MAX_AGE,
        });

        return response;
    } else {
        // 認証に失敗した場合は401エラーを返す
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
}