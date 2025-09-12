import { TEmployee } from ".prisma/client_transaction/client";
import { TEmployeeRepository } from "@/lib/repositories/transaction/tEmployeeRepository";

/**
 * 社員一覧画面の表示に必要な情報を取得するサービス関数
 *
 * @returns オブジェクト（社員情報の配列）
 */
export async function listService(): Promise<{
    tEmployees: TEmployee[];
}> {
    // 在籍中の社員情報を取得
    const tEmployees = await TEmployeeRepository.findAll();
    tEmployees.sort((a, b) => a.employeeNo.localeCompare(b.employeeNo)); // 社員Noで昇順ソート

    return { tEmployees };
}
