"use server";

import { addService } from "@/services/actions/employee/addService";

/**
 * 社員の登録処理を行うサーバアクション
 * 引数で受け取った社員情報を元に、社員Noとメールアドレスの重複チェックを行い、
 * 問題がなければ社員情報へ新規登録を実施する。
 * 
 * @param employeeNo - 社員No
 * @param name - 名前
 * @param emailAddress - メールアドレス
 * @param password - パスワード
 * @param joinDate - 入社日
 * @throws 社員Noとメールアドレスの重複時に例外をスロー
 */
export async function addAction(
    employeeNo: string,
    name: string,
    emailAddress: string,
    password: string,
    joinDate: Date,
): Promise<void> {
    // 社員情報の新規登録
    await addService(
        employeeNo,
        name,
        emailAddress,
        password,
        joinDate,
    );
}