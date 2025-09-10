import { NextRequest, NextResponse } from "next/server";

type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

/**
 * APIハンドラに共通のエラーハンドリングを付与する高階関数
 * @param handler - ラップ対象のAPIハンドラ
 * @returns エラー時に500レスポンスを返すラップ済み関数
 */
export function withApiErrorHandler(handler: RouteHandler): RouteHandler {
    return async function (request: NextRequest): Promise<NextResponse> {
        try {
            // 元のAPIハンドラを実行
            return await handler(request);
        } catch (error: any) {
            // エラー発生時はログ出力し、500ステータスとエラーメッセージを返す
            console.error("API Error:", error);
            const message = error instanceof Error ? error.message : "予期しないエラーが発生しました。";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    };
}