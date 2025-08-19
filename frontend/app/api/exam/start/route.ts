import { NextRequest, NextResponse } from 'next/server'
import { getEmployeeFromRequest } from '@/lib/utils/employeeUtils';
import { startService } from '@/services/api/exam/startService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';

/**
 * POSTリクエストを処理するAPIハンドラ
 * 指定された試験IDに基づいて試験開始処理を行う
 */
async function handler(request: NextRequest): Promise<NextResponse> {
    // リクエストヘッダから社員情報を取得
    const tEmployee = await getEmployeeFromRequest(request.headers);

    // リクエストボディから試験IDを取得
    const body = await request.json();
    const { testId } = body;

    // 試験IDがない場合はエラー
    if (!testId) {
        throw new Error('試験IDが提供されていません。');
    }

    // 試験開始処理を実行
    await startService(tEmployee.id, testId);

    // 成功レスポンスを返却
    return NextResponse.json({}, { status: 200 });
}

// エラーハンドリングを共通化したAPIハンドラとしてエクスポート
export const POST = withErrorHandler(handler);