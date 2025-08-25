import { NextRequest, NextResponse } from "next/server"
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { resultService } from "@/services/api/exam/resultService";
import { withApiErrorHandler } from "@/lib/utils/withApiErrorHandler";

/**
 * POSTリクエストを処理するAPIハンドラ
 * 試験解答結果の保存処理を行う
 */
async function handler(request: NextRequest): Promise<NextResponse> {
    // リクエストヘッダから社員情報を取得し、認証済みかを判定
    const tEmployee = await getEmployeeFromRequest(request.headers);

    // リクエストボディから試験ID、受験回数、解答情報を取得
    const body = await request.json();
    const { testId, testCnt, answers } = body;

    // 試験IDがない場合はエラー
    if (!testId) {
        throw new Error("試験IDが提供されていません。");
    }

    // 受験回数がない場合はエラー
    if (!testCnt) {
        throw new Error("受験回数が提供されていません。");
    }

    // 解答情報がない場合はエラー
    if (!answers) {
        throw new Error("解答情報が提供されていません。");
    }

    // 試験解答結果の保存を実行
    await resultService(tEmployee.id, testId, testCnt, answers);

    // 成功レスポンスを返却
    return NextResponse.json({}, { status: 200 });
}

export const POST = withApiErrorHandler(handler);