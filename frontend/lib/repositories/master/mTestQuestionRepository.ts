import { MTestQuestion } from '.prisma/client_master';
import { masterPrisma } from '@/lib/prisma/masterPrisma';

/**
 * MTestQuestionモデルのデータ操作を行うリポジトリクラス
 */
export class MTestQuestionRepository {
    /**
     * 試験IDと問題番号の配列を条件に、MTestQuestionレコードを複数件取得する
     * 
     * @param testId - 検索対象の試験ID
     * @param questionNos - 検索対象の問題番号の配列（IN句として使用）
     * @returns 条件に一致するMTestQuestionオブジェクトの配列（存在しない場合は空配列）
     */
    static async findByTestIdAndQuestionNos(testId: number, questionNos: number[]): Promise<MTestQuestion[]> {
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