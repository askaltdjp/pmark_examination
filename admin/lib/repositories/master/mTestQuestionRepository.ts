import { MTestQuestion, Prisma } from ".prisma/client_master/";
import { QuestionData } from "@/lib/definitions/types";
import { masterPrisma } from "@/lib/prisma/masterPrisma";
import { currentJST } from "@/lib/utils/timeUtils";

/**
 * MTestQuestionモデルのデータ操作を行うリポジトリクラス
 */
export class MTestQuestionRepository {
    /**
     * 指定された testId に紐づくすべての MTestQuestion レコードを取得する
     * 
     * @param testId - 検索対象の testId
     * @returns 指定された testId に関連するMTestQuestionオブジェクトの配列
     */
    static async findAllByTestId(testId: number): Promise<MTestQuestion[]> {
        return await masterPrisma.mTestQuestion.findMany({
            where: {
                testId,
                deleteAt: null,
            },
        });
    }

    /**
     * 試験IDと問題番号の配列を条件に、MTestQuestionレコードを複数件取得する
     * 
     * @param testId - 検索対象の試験ID
     * @param questionNos - 検索対象の問題Noの配列（IN句として使用）
     * @returns 条件に一致するMTestQuestionオブジェクトの配列
     */
    static async findAllByTestIdAndQuestionNos(testId: number, questionNos: number[]): Promise<MTestQuestion[]> {
        return await masterPrisma.mTestQuestion.findMany({
            where: {
                testId,
                questionNo: {
                    in: questionNos,
                },
                deleteAt: null,
            },
        });
    }

    /**
     * 指定された testId に一致する削除されていない MTestQuestion レコードを論理削除する
     * 
     * @param testId - 論理削除対象の testId
     * @param tx - トランザクションオブジェクト
     */
    static async deleteByTestId(testId: number, tx: Prisma.TransactionClient): Promise<void> {
        const now = currentJST();

        await tx.mTestQuestion.updateMany({
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