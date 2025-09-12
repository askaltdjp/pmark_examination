import { Prisma, TTestAnswer } from ".prisma/client_transaction";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * TTestAnswerモデルのデータ操作を行うリポジトリクラス
 */
export class TTestAnswerRepository {
    /**
     * employeeId と testId と testCnt を条件に TTestAnswer レコードを複数検索する（id の昇順で並び替え）
     * 
     * @param employeeId - 検索する社員ID
     * @param testId - 検索する試験ID
     * @param testCnt - 検索する受験回数
     * @returns 条件に一致する TTestAnswer オブジェクトの配列（存在しない場合は空配列）
     *          結果は id の値が小さい順（昇順）に並んでいます
    */
    static async findAllByEmployeeIdAndTestIdAndTestCnt(
        employeeId: number,
        testId: number,
        testCnt: number,
    ): Promise<TTestAnswer[]> {
        return transactionPrisma.tTestAnswer.findMany({
            where: {
                employeeId,
                testId,
                testCnt,
                deleteAt: null,
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    /**
     * 指定された testId に一致する削除されていない TTestAnswer レコードを論理削除する
     * 
     * @param testId - 論理削除対象の testId
     * @param tx - トランザクションオブジェクト
     */
    static async deleteByTestId(testId: number, tx: Prisma.TransactionClient): Promise<void> {
        const now = currentJST();

        await tx.tTestAnswer.updateMany({
            where: {
                testId,
                deleteAt: null, // 削除されていないレコードのみ対象
            },
            data: {
                deleteAt: now,
                updateAt: now,
            },
        });
    }
}