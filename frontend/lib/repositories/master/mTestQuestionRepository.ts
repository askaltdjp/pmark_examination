import { MTestQuestion } from ".prisma/client_master";
import { masterPrisma } from "@/lib/prisma/masterPrisma";

/**
 * MTestQuestionモデルのデータ操作を行うリポジトリクラス
 */
export class MTestQuestionRepository {
    /**
     * 指定された試験IDに紐づくすべてのMTestQuestionレコードを取得する
     * 
     * @param testId - 検索対象の試験ID
     * @returns 指定された試験IDに関連するMTestQuestionオブジェクトの配列
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
}