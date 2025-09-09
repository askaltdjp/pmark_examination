import { TTest, Prisma } from ".prisma/client_transaction/";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { currentJST } from "@/lib/utils/timeUtils";
import { TestResult } from "@/lib/definitions/labels";

/**
 * TTestモデルのデータ操作を行うリポジトリクラス
 */
export class TTestRepository {
    /**
     * employeeId と testId と testCnt を条件に TTest レコードを1件検索する
     * 
     * @param employeeId - 検索する社員ID
     * @param testId - 検索する試験ID
     * @param testCnt - 検索する受験回数
     * @param tx - トランザクションオブジェクト（オプション）
     * @returns 条件に一致する TTest オブジェクト（存在しない場合は null）
     * 
     * トランザクション内で使用する場合、`tx` パラメータを指定してください。
     * 指定しない場合、`transactionPrisma` がデフォルトで使用されます。
     */
    static async findByEmployeeIdAndTestIdAndTestCnt(
        employeeId: number,
        testId: number,
        testCnt: number,
        tx?: Prisma.TransactionClient
    ): Promise<TTest | null> {
        const prisma = tx || transactionPrisma;

        return prisma.tTest.findFirst({
            where: {
                employeeId,
                testId,
                testCnt,
                deleteAt: null,
            },
        });
    }

    /**
     * employeeId と testId を条件に TTest レコードを複数検索する（testCnt の降順で並び替え）
     * 
     * @param employeeId - 検索する社員ID
     * @param testId - 検索する試験ID
     * @param tx - トランザクションオブジェクト（オプション）
     * @returns 条件に一致する TTest オブジェクトの配列（存在しない場合は空配列）
     *          結果は testCnt の値が大きい順（降順）に並んでいます
     * 
     * トランザクション内で使用する場合、`tx` パラメータを指定してください。
     * 指定しない場合、`transactionPrisma` がデフォルトで使用されます。
     */
    static async findAllByEmployeeIdAndTestId(
        employeeId: number,
        testId: number,
        tx?: Prisma.TransactionClient
    ): Promise<TTest[]> {
        const prisma = tx || transactionPrisma;

        return prisma.tTest.findMany({
            where: {
                employeeId,
                testId,
                deleteAt: null,
            },
            orderBy: {
                testCnt: 'desc',
            },
        });
    }

    /**
     * employeeId と testId を条件に、testCnt の最大値を取得する
     *
     * @param employeeId - 社員ID
     * @param testId - 試験ID
     * @param tx - トランザクションオブジェクト（オプション）
     * @returns 最大の testCnt（存在しない場合は 0）
     */
    static async findMaxTestCntByEmployeeIdAndTestId(
        employeeId: number,
        testId: number,
        tx?: Prisma.TransactionClient
    ): Promise<number> {
        const prisma = tx || transactionPrisma;

        const result = await prisma.tTest.aggregate({
            where: {
                employeeId,
                testId,
                // deleteAt: null, 論理削除は考慮しない
            },
            _max: {
                testCnt: true,
            },
        });

        return result._max.testCnt ?? 0;
    }

    /**
     * TTest の新しいレコードを作成する
     * 
     * @param employeeId - 社員ID
     * @param testId - 試験ID
     * @param testCnt - 受験回数
     * @param tx - トランザクションオブジェクト
     * @returns 作成した TTest レコード
     */
    static async createTTest(
        employeeId: number,
        testId: number,
        testCnt: number,
        tx: Prisma.TransactionClient
    ): Promise<TTest> {
        const now = currentJST();

        const tTest = await tx.tTest.create({
            data: {
                employeeId,
                testId,
                testCnt,
                correctNum: 0,
                result: TestResult.Interrupted,
                testAt: now,
                createAt: now,
                updateAt: now,
            },
        });

        return tTest;
    }

    /**
     * TTest レコードの correctNum（正解数）および result（試験結果）を更新する
     *
     * @param id - 更新対象の TTest レコードのID
     * @param correctNum - 正解数
     * @param result - 試験結果（TestResult enum を参照）
     * @param tx - トランザクションオブジェクト
     */
    static async updateCorrectNumAndResult(
        id: number,
        correctNum: number,
        result: number,
        tx: Prisma.TransactionClient
    ): Promise<void> {
        const now = currentJST();

        await tx.tTest.update({
            where: {
                id,
            },
            data: {
                correctNum,
                result,
                updateAt: now,
            },
        });
    }
}