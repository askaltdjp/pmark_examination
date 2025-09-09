"use server";

import { headers } from "next/headers";
import { MTestQuestion } from ".prisma/client_master";
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { startService } from "@/services/actions/exam/startService";

/**
 * 試験開始用のサーバアクション
 * 指定された試験IDに基づいて受験履歴を新規作成し、
 * 試験問題マスタと現在の受験回数を取得して返却する
 */
export async function startAction(
    testId: number
): Promise<{ mTestQuestions: MTestQuestion[]; testCnt: number }> {
    // 試験IDの入力チェック
    if (testId === 0) {
        throw new Error("試験IDが提供されていません。");
    }

    // リクエストヘッダから社員情報を取得し、認証済みかを判定
    const requestHeaders = await headers();
    const tEmployee = await getEmployeeFromRequest(requestHeaders);

    // 受験履歴を新規作成して、対象の試験問題マスタと受験回数を返却
    return await startService(tEmployee.id, testId);
}