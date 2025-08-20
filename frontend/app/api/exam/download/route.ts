import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { getEmployeeFromRequest } from '@/lib/utils/employeeUtils';
import { downloadService } from "@/services/api/exam/downloadService";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 受け取った試験IDと受験回数に基づいて試験結果のExcelファイルを生成して返却する
 */
async function handler(request: NextRequest): Promise<NextResponse> {
    // リクエストヘッダから社員情報を取得
    const tEmployee = await getEmployeeFromRequest(request.headers);

    // リクエストボディから試験IDと受験回数を取得
    const body = await request.json();
    const { testId, testCnt } = body;

    // ダウンロード用Excelファイルの生成処理を呼び出す
    const { buffer, fileName } = await downloadService(tEmployee, testId, testCnt);

    // Excelファイルをバイナリとしてレスポンスにセットし、ダウンロードさせる
    return new NextResponse(buffer, {
        status: 200,
        headers: {
            // ExcelのMIMEタイプ
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            // ファイル名の指定（UTF-8エンコード済み）
            'Content-Disposition': `attachment; filename*=UTF-8''${fileName}`,
        },
    });
}

// エラーハンドリングを共通化したAPIハンドラとしてエクスポート
export const POST = withErrorHandler(handler);