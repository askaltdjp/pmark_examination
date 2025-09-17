import { NextRequest, NextResponse } from "next/server";
import { withApiErrorHandler } from "@/lib/utils/withApiErrorHandler";
import { downloadQuestionsService } from "@/services/api/exam/downloadQuestionsService";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 受け取った試験IDに基づいて試験問題のCSVファイルを生成して返却する
 */
async function handler(request: NextRequest): Promise<NextResponse> {
    // リクエストボディから試験IDを取得
    const body: { testId: number; } = await request.json();
    const { testId } = body;

    // 試験IDの入力チェック
    if (!testId) {
        throw new Error("試験IDが提供されていません。");
    }

    // ダウンロード用CSVファイルの生成処理を呼び出す
    const { csvWithBom, fileName } = await downloadQuestionsService(testId);

    // CSVファイルをレスポンスにセットし、ダウンロードさせる
    return new NextResponse(csvWithBom, {
        status: 200,
        headers: {
            // CSVのMIMEタイプ
            "Content-Type": "text/csv; charset=utf-8",
            // ファイル名の指定（UTF-8エンコード済み）
            "Content-Disposition": `attachment; filename*=UTF-8''${fileName}`,
        },
    });
}

export const POST = withApiErrorHandler(handler);