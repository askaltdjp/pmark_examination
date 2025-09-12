import { TEmployee } from ".prisma/client_transaction";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";

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
     * t_employee テーブルの全レコードを取得する（deleteAt が null でないレコードも含む）
     * 
     * @returns TEmployee の全レコード配列
     */
    static async findAll(): Promise<TEmployee[]> {
        return await transactionPrisma.tEmployee.findMany();
    }
}