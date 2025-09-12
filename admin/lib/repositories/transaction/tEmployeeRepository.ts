import { Prisma, TEmployee } from ".prisma/client_transaction";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * TEmployeeモデルのデータ操作を行うリポジトリクラス
 */
export class TEmployeeRepository {
    /**
     * idをキーにTEmployeeレコードを検索する
     * @param id - 検索するID
     * @returns 見つかったTEmployeeオブジェクト、なければnull
     */
    static async findById(id: number): Promise<TEmployee | null> {
        return transactionPrisma.tEmployee.findFirst({
            where: {
                id,
                deleteAt: null,
            }
        });
    }

    /**
     * t_employee テーブルの全レコードを取得する
     * 
     * @param includeDeleted 退職社員（delete_at が NOT NULL）も含めるかどうか（デフォルト: false）
     * @returns TEmployee のレコード配列
     */
    static async findAll(includeDeleted: boolean = false): Promise<TEmployee[]> {
        return await transactionPrisma.tEmployee.findMany({
            where: includeDeleted ? undefined : {
                deleteAt: null,
            },
        });
    }

    /**
     * 指定された id に一致する TEmployee レコードを論理削除する
     * 
     * @param id - 論理削除対象の id
     * @param tx - トランザクションオブジェクト
     */
    static async deleteById(id: number, tx: Prisma.TransactionClient): Promise<void> {
        const now = currentJST();

        await tx.tEmployee.update({
            where: {
                id,
            },
            data: {
                deleteAt: now,
                updateAt: now,
            },
        });
    }
}