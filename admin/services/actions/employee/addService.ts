import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { TEmployeeRepository } from "@/lib/repositories/transaction/tEmployeeRepository";

/**
 * 新しい社員データを追加するサービス関数
 * 
 * 登録対象の社員の社員Noとメールアドレスが既存の社員と重複していないことをチェックし、
 * 重複がなければ社員情報をDBに登録する。
 * 
 * @param employeeNo - 社員No
 * @param name - 名前
 * @param emailAddress - メールアドレス
 * @param password - パスワード
 * @param joinDate - 入社日
 * @throws 社員Noとメールアドレスの重複時にエラーをスロー
 */
export async function addService(
    employeeNo: string,
    name: string,
    emailAddress: string,
    password: string,
    joinDate: Date,
): Promise<void> {
    // 社員Noの重複チェック　※削除ユーザとは重複してもよい
    if ((await TEmployeeRepository.findByEmployeeNo(employeeNo)).length > 0) {
        throw new Error("社員番号は使用済みです。");
    }

    // メールアドレスの重複チェック　※削除ユーザとは重複してもよい
    if ((await TEmployeeRepository.findByEmailAddress(emailAddress)).length > 0) {
        throw new Error("メールアドレスは使用済みです。");
    }

    // pme_transactionのトランザクション処理
    await transactionPrisma.$transaction(async (tx) => {
        // 社員情報の新規登録
        const mTest = await TEmployeeRepository.insert(
            employeeNo,
            name,
            emailAddress,
            password,
            joinDate,
            tx,
        );
    });
}