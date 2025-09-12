import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { TEmployeeRepository } from "@/lib/repositories/transaction/tEmployeeRepository";

/**
 * 指定された社員IDに紐づくトランザクションデータを削除するサービス関数
 *
 * @param emplyeeId - 削除対象の社員ID
 */
export async function deleteService(emplyeeId: number): Promise<void> {
    // pme_transactionのトランザクション処理
    await transactionPrisma.$transaction(async (tx) => {
        // 社員情報の削除
        await TEmployeeRepository.deleteById(emplyeeId, tx);
    });
}