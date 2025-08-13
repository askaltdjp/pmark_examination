import { NextRequest, NextResponse } from "next/server";
import path from "path";
import ExcelJS from "exceljs";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 仮実装：Excelを読み込んで返却するだけ
 */
export async function POST(req: NextRequest) {
    try {
        // リクエストボディのJSONを取得
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
    } catch (error) {
        console.error("ファイル処理エラー:", error);
        return new NextResponse(
            JSON.stringify({ error: "ファイルの読み込みに失敗しました" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
