import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import path from "path";
import ExcelJS from "exceljs";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 仮実装：Excelを読み込んで返却するだけ
 */
async function handler(req: NextRequest) {
    // リクエストボディから試験IDと受験回数を取得
    const body = await req.json();
    const { testId, testCnt } = body;

    console.log(`testId:${testId}`);
    console.log(`testCnt:${testCnt}`);

    // テンプレートファイルのパスを取得
    const filePath = path.resolve(process.cwd(), "templates/sample.xlsx");

    // ExcelJS でファイルを読み込む
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // ワークブックの内容をバッファに書き出す（変更なし）
    const buffer = await workbook.xlsx.writeBuffer();

    // ファイルをレスポンスとして返す（ダウンロード）
    return new NextResponse(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": 'attachment; filename="sample.xlsx"',
        },
    });
}

// エラーハンドリングを共通化したAPIハンドラとしてエクスポート
export const POST = withErrorHandler(handler);