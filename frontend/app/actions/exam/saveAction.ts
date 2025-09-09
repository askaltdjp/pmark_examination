"use server";

import { headers } from "next/headers";
import { getEmployeeFromRequest } from "@/lib/utils/employeeUtils";
import { saveService } from "@/services/actions/exam/saveService";

/**
 * 試験解答結果を保存するサーバアクション
 * 指定された試験IDと受験回数、解答情報に基づき、
 * 該当社員の試験解答結果を保存する
 */
export async function saveAction(
    testId: number,
    testCnt: number,
    answers: { questionNo: number; answer: boolean }[]
): Promise<void> {
    // リクエストヘッダから社員情報を取得し、認証済みかを判定
    const requestHeaders = await headers();
    const tEmployee = await getEmployeeFromRequest(requestHeaders);

    // 試験IDの入力チェック
    if (testId === 0) {
        throw new Error("試験IDが提供されていません。");
    }

    // 受験回数の入力チェック
    if (testCnt === 0) {
        throw new Error("受験回数が提供されていません。");
    }

    // 解答情報の入力チェック
    if (answers.length === 0) {
        throw new Error("解答情報が提供されていません。");
    }

    // 試験解答結果を保存
    await saveService(tEmployee.id, testId, testCnt, answers);
}