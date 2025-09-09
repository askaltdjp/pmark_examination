import { Prisma } from ".prisma/client_master/";
import { QuestionData } from "@/lib/definitions/types";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * MTestQuestionモデルのデータ操作を行うリポジトリクラス
 */
export class MTestQuestionRepository {
    /**
     * 指定された testId に一致する MTestQuestion レコードを論理削除する
     * 
     * @param testId - 論理削除対象の testId
     * @param tx - トランザクションオブジェクト
     */
    static async deleteByTestId(testId: number, tx: Prisma.TransactionClient): Promise<void> {
        const now = currentJST();

        await tx.mTestQuestion.updateMany({
            where: { testId },
            data: {
                deleteAt: now,
                updateAt: now,
            },
        });
    }

    /**
     * MTestQuestionレコードを複数一括で作成する
     * 
     * @param testId - 追加対象の試験ID
     * @param questionDataList - 試験問題
     * @param tx - トランザクションオブジェクト
     */
    static async createManyMTestQuestions(
        testId: number,
        questionDataList: QuestionData[],
        tx: Prisma.TransactionClient,
    ): Promise<void> {
        const now = currentJST();

        await tx.mTestQuestion.createMany({
            data: questionDataList.map(questionData => ({
                ...questionData,
                testId,
                createAt: now,
                updateAt: now,
                deleteAt: null,
            })),
        });
    }
}