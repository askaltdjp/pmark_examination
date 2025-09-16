"use server";

import { editService } from "@/services/actions/employee/editService";

/**
 * 社員の変更処理を行うサーバアクション
 * 引数で受け取った社員情報を元に、社員Noとメールアドレスの重複チェックを行い、
 * 問題がなければ社員情報の変更を実施する。
 * 
 * @param employeeId - 社員ID
 * @param employeeNo - 社員No
 * @param name - 名前
 * @param emailAddress - メールアドレス
 * @param password - パスワード
 * @param joinDate - 入社日
 * @throws 社員Noとメールアドレスの重複時に例外をスロー
 */
export async function editAction(
    empoloyeeId: number,
    employeeNo: string,
    name: string,
    emailAddress: string,
    password: string,
    joinDate: Date,
): Promise<void> {
    // 社員情報の変更
    await editService(
        empoloyeeId,
        employeeNo,
        name,
        emailAddress,
        password,
        joinDate,
    );
}