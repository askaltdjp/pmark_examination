import { TTest, Prisma } from '.prisma/client_transaction/';
import { transactionPrisma } from '@/lib/prisma/transactionPrisma';
import { currentJST } from '@/lib/utils/timeUtils';
import { TestResult } from '@/lib/constants/labels';

/**
 * TTestモデルのデータ操作を行うリポジトリクラス
 */
export class TTestRepository {
    /**
     * employeeId と testId を条件に TTest レコードを複数検索する（testCnt の降順で並び替え）
     * 
     * @param employeeId - 検索する従業員ID
     * @param testId - 検索する試験ID
     * @param tx - トランザクションオブジェクト（オプション）
     * @returns 条件に一致する TTest オブジェクトの配列（存在しない場合は空配列）
     *          結果は testCnt の値が大きい順（降順）に並んでいます
     * 
     * トランザクション内で使用する場合、`tx` パラメータを指定してください。
     * 指定しない場合、`transactionPrisma` がデフォルトで使用されます。
     */
    static async findAllByEmployeeIdAndTestId(employeeId: number, testId: number, tx?: Prisma.TransactionClient): Promise<TTest[]> {
        const prisma = tx || transactionPrisma;
        return prisma.tTest.findMany({
            where: {
                employeeId,
                testId,
                deleteAt: null,
            },
            orderBy: {
                testCnt: 'desc',
            }
        });
    }

    /**
     * TTest の新しいレコードを作成する
     * 
     * @param employeeId - 社員ID
     * @param testId - 試験ID
     * @param testCnt - 受験回数
     * @param tx - トランザクションオブジェクト（オプション）
     * @returns 作成した TTest レコード
     * 
     * トランザクション内で使用する場合、`tx` パラメータを指定してください。
     * 指定しない場合、`transactionPrisma` がデフォルトで使用されます。
     */
    static async createTTest(employeeId: number, testId: number, testCnt: number, tx?: Prisma.TransactionClient): Promise<TTest> {
        const prisma = tx || transactionPrisma;
        const now = currentJST();
        const tTest = await prisma.tTest.create({
            data: {
                employeeId,
                testId,
                testCnt,
                correctNum: 0,
                result: TestResult.Interrupted,
                testAt: now,
            },
        });

        return tTest;
    }
}