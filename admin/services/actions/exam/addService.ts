import { masterPrisma } from "@/lib/prisma/masterPrisma";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { QuestionData } from "@/lib/definitions/types";

/**
 * 新しい試験データを追加するサービス関数
 * 
 * 指定された試験期間が既存の試験と重複していないことをチェックし、
 * 重複がなければ試験情報をDBに登録する。
 * 
 * @param name - 名前
 * @param startAt - 開始日
 * @param endAt - 終了日
 * @param questionNum - 出題数
 * @param passNum - 合格数
 * @param questionDataList - 試験問題
 * @throws 期間重複時にエラーをスロー
 */
export async function addService(
    name: string,
    startAt: Date,
    endAt: Date,
    questionNum: number,
    passNum: number,
    questionDataList: QuestionData[],
): Promise<void> {
    // 既存の試験と試験期間が重複していないことのチェック
    const overlapping = await MTestRepository.findOverlappingRecord(startAt, endAt);
    if (overlapping) {
        throw new Error(
            `試験ID：${overlapping.id}\n試験名：${overlapping.name}\n試験期間：${overlapping.startAt.toISOString().slice(0, 10)} ～ ${overlapping.endAt.toISOString().slice(0, 10)}\n\n上記と試験期間が重複しています。`
        );
    }

    // pme_masterのトランザクション処理
    await masterPrisma.$transaction(async (tx) => {
        // 試験マスタの新規登録
        const mTest = await MTestRepository.insert(
            name,
            startAt,
            endAt,
            questionNum,
            passNum,
            tx,
        );
        // 試験問題マスタの新規登録
        await MTestQuestionRepository.createManyMTestQuestions(mTest.id, questionDataList, tx);
    });
}