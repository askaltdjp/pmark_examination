import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/services/api/auth/loginService";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 従業員のログイン認証を行い、成功時にJWTを発行してクッキーにセットする
 */
export async function POST(req: NextRequest) {
    // リクエストボディからメールアドレスとパスワードを取得
    const body = await req.json();
    const { emailAddress, password } = body;

    // 認証サービスを呼び出し、トークンを取得
    const token = await authenticateUser(emailAddress, password);

    // 認証に失敗した場合は401エラーを返す
    if (!token) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    } else {
        // 認証成功時はレスポンスを作成
        const response = NextResponse.json({ message: "Login successful" }, { status: 200 })

        // JWTトークンをHttpOnlyクッキーとしてセット（セキュア属性は環境に応じて設定推奨）
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            maxAge: 3600, // 1時間
        });

        return response;
    }
}