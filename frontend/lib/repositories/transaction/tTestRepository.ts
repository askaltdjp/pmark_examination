import { TTest } from '.prisma/client_transaction/';
import { transactionPrisma } from '@/lib/prisma/transactionPrisma';

/**
 * TTestモデルのデータ操作を行うリポジトリクラス
 */
export class TTestRepository {
    /**
     * employeeId と testId を条件に TTest レコードを複数検索する（testCnt の降順で並び替え）
     * @param employeeId - 検索する従業員ID
     * @param testId - 検索する試験ID
     * @returns 条件に一致する TTest オブジェクトの配列（存在しない場合は空配列）
     *          結果は testCnt の値が大きい順（降順）に並んでいます
     */
    static async findAllByEmployeeIdAndTestId(employeeId: number, testId: number): Promise<TTest[]> {
        return transactionPrisma.tTest.findMany({
            where: {
                employeeId: employeeId,
                testId: testId,
                deleteAt: null,
            },
            orderBy: {
                testCnt: 'desc',
            }
        });
    }
}