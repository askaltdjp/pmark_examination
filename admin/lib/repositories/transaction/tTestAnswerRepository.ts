import { Prisma } from ".prisma/client_transaction";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * TTestAnswerモデルのデータ操作を行うリポジトリクラス
 */
export class TTestAnswerRepository {
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