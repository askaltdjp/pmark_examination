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
     * emailAddressをキーにTEmployeeレコードを検索する
     * @param emailAddress - 検索するメールアドレス
     * @returns 見つかったTEmployeeオブジェクト、なければnull
     */
    static async findByEmail(emailAddress: string): Promise<TEmployee | null> {
        return transactionPrisma.tEmployee.findFirst({
            where: {
                emailAddress,
                deleteAt: null
            }
        });
    }
}