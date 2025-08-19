import { NextRequest, NextResponse } from 'next/server'
import { getEmployeeFromRequest } from '@/lib/utils/employeeUtils';
import { startService } from '@/services/api/exam/startService';

/**
 * POSTリクエストを処理するAPIハンドラ
 * 指定された試験IDに基づいて試験開始処理を行う
 */
export async function POST(request: NextRequest) {
    try {
        // リクエストヘッダから従業員情報を取得
        const tEmployee = await getEmployeeFromRequest(request.headers);

        // リクエストボディから試験IDを取得
        const body = await request.json();
        const { testId } = body;

        // 試験IDがない場合はエラー
        if (!testId) {
            throw new Error('試験IDが提供されていません');
        }

        // 試験開始処理を実行
        await startService(tEmployee.id, testId);

        // 成功時は200ステータスで返す
        return NextResponse.json({}, { status: 200 });

    } catch (error: any) {
        const message = error instanceof Error ? error.message : '試験開始処理中にエラーが発生しました';
        console.error('試験開始処理中にエラーが発生しました:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}