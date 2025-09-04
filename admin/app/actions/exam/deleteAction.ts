"use server";

import { deleteService } from "@/services/actions/exam/deleteService";

/**
 * 試験の削除処理を行うサーバアクション
 * 引数で受け取った試験IDに基づき、試験マスタと受験履歴等の関連データを削除する。
 */
export async function deleteAction(testId: number): Promise<void> {
    // 試験IDがない場合はエラー
    if (!testId) {
        throw new Error("試験IDが提供されていません。");
    }

    // 試験の削除
    await deleteService(testId);
}