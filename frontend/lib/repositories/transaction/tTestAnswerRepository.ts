import { TTestAnswer, Prisma } from ".prisma/client_transaction/";
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
     * @param tx - トランザクションオブジェクト（オプション）
     * @returns 条件に一致する TTestAnswer オブジェクトの配列（存在しない場合は空配列）
     *          結果は id の値が小さい順（昇順）に並んでいます
     * 
     * トランザクション内で使用する場合、`tx` パラメータを指定してください。
     * 指定しない場合、`transactionPrisma` がデフォルトで使用されます。
     */
    static async findAllByEmployeeIdAndTestIdAndTestCnt(
        employeeId: number,
        testId: number,
        testCnt: number,
        tx?: Prisma.TransactionClient
    ): Promise<TTestAnswer[]> {
        const prisma = tx || transactionPrisma;

        return prisma.tTestAnswer.findMany({
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
     * TTestAnswer レコードを複数一括で作成する
     * 
     * @param newTTestAnswers - 作成する TTestAnswer レコードの配列
     * @param tx - トランザクションオブジェクト
     */
    static async createManyTTestAnswers(
        newTTestAnswers: {
            employeeId: number;
            testId: number;
            testCnt: number;
            questionNo: number;
            answer: boolean;
        }[],
        tx: Prisma.TransactionClient
    ): Promise<void> {
        const now = currentJST();

        await tx.tTestAnswer.createMany({
            data: newTTestAnswers.map(newTTestAnswer => ({
                ...newTTestAnswer,
                createAt: now,
                updateAt: now,
            })),
        });
    }
}