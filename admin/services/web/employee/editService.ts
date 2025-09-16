import { TEmployee } from ".prisma/client_transaction/client";
import { TEmployeeRepository } from "@/lib/repositories/transaction/tEmployeeRepository";

/**
 * 社員変更画面の表示に必要な情報を取得するサービス関数
 *
 * @param employeeId - 社員ID
 * @returns 社員情報
 */
export async function editService(employeeId: number): Promise<TEmployee> {
    // 社員情報取得
    const tEmployee = await TEmployeeRepository.findById(employeeId);
    if (tEmployee === null) {
        throw new Error("社員情報が存在しません。");
    }

    return tEmployee;
}