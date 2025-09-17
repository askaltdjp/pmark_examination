import { NextRequest, NextResponse } from "next/server";
import { withApiErrorHandler } from "@/lib/utils/withApiErrorHandler";
import { downloadResultsService } from "@/services/api/exam/downloadResultsService";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 受け取った試験IDに基づいて該当社員の試験結果のExcelファイルを生成して返却する
 */
async function handler(request: NextRequest): Promise<NextResponse> {
    // リクエストボディから試験IDを取得
    const body: { employeeId: number; testId: number; testCnt: number; } = await request.json();
    const { testId } = body;

    // 試験IDの入力チェック
    if (!testId) {
        throw new Error("試験IDが提供されていません。");
    }

    // ダウンロード用Excelファイルの生成処理を呼び出す
    const { buffer, fileName } = await downloadResultsService(testId);

    // Excelファイルをバイナリとしてレスポンスにセットし、ダウンロードさせる
    return new NextResponse(buffer, {
        status: 200,
        headers: {
            // ExcelのMIMEタイプ
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            // ファイル名の指定（UTF-8エンコード済み）
            "Content-Disposition": `attachment; filename*=UTF-8''${fileName}`,
        },
    });
}

export const POST = withApiErrorHandler(handler);