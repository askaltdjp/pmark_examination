"use server";

import { deleteService } from "@/services/actions/employee/deleteService";

/**
 * 社員の削除処理を行うサーバアクション
 * 引数で受け取った社員IDに基づき、社員情報のデータを削除する。
 * 
 * @param employeeId - 社員ID
 * @throws パラメータエラー時に例外をスロー
 */
export async function deleteAction(employeeId: number): Promise<void> {
    // 社員IDの入力チェック
    if (!employeeId) {
        throw new Error("社員IDが提供されていません。");
    }

    // 社員情報の削除
    await deleteService(employeeId);
}