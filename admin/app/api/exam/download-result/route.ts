import { NextRequest, NextResponse } from "next/server";
import { withApiErrorHandler } from "@/lib/utils/withApiErrorHandler";
import { downloadResultService } from "@/services/api/exam/downloadResultService";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 受け取った社員IDと試験IDと受験回数に基づいて試験結果のExcelファイルを生成して返却する
 */
async function handler(request: NextRequest): Promise<NextResponse> {
    // リクエストボディから社員ID・試験ID・受験回数を取得
    const body: { employeeId: number; testId: number; testCnt: number; } = await request.json();
    const { employeeId, testId, testCnt } = body;

    // 社員IDの入力チェック
    if (!employeeId) {
        throw new Error("社員IDが提供されていません。");
    }

    // 試験IDの入力チェック
    if (!testId) {
        throw new Error("試験IDが提供されていません。");
    }

    // 受験回数の入力チェック
    if (!testCnt) {
        throw new Error("受験回数が提供されていません。");
    }

    // ダウンロード用Excelファイルの生成処理を呼び出す
    const { buffer, fileName } = await downloadResultService(employeeId, testId, testCnt);

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