import { masterPrisma } from "@/lib/prisma/masterPrisma";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";
import { QuestionData } from "@/lib/definitions/types";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";
import { TTestAnswerRepository } from "@/lib/repositories/transaction/tTestAnswerRepository";

/**
 * 試験情報と関連データを更新するサービス関数
 *
 * 指定された試験期間が他の試験と重複していないかを確認し、
 * 問題なければ試験マスタおよび試験問題マスタを更新する。
 *
 * 既存の試験問題は一度論理削除し、新しい内容で再登録する。
 * また、関連する受験データ（t_test, t_test_answer）も論理削除する。
 *
 * ※ 複数のデータベース（master, transaction）を跨いで処理を行うが、
 *    DB間トランザクションは保証されないため、整合性には注意が必要。
 *
 * @param testId - 試験ID
 * @param name - 名前
 * @param startAt - 開始日
 * @param endAt - 終了日
 * @param questionNum - 出題数
 * @param passNum - 合格数
 * @param questionDataList - 試験問題
 * @throws 期間重複時にエラーをスロー
 */
export async function editService(
    testId: number,
    name: string,
    startAt: Date,
    endAt: Date,
    questionNum: number,
    passNum: number,
    questionDataList: QuestionData[],
): Promise<void> {
    // 既存の試験と試験期間が重複していないことのチェック
    const overlapping = await MTestRepository.findOverlappingRecord(startAt, endAt, testId);
    if (overlapping) {
        throw new Error(
            `試験ID：${overlapping.id}\n試験名：${overlapping.name}\n試験期間：${overlapping.startAt.toISOString().slice(0, 10)} ～ ${overlapping.endAt.toISOString().slice(0, 10)}\n\n上記と試験期間が重複しています。`
        );
    }

    // FIXME: 複数DBを跨いだ厳密なトランザクション制御が必要

    // pme_masterのトランザクション処理
    await masterPrisma.$transaction(async (tx) => {
        // 試験マスタの更新
        await MTestRepository.update(
            testId,
            name,
            startAt,
            endAt,
            questionNum,
            passNum,
            tx,
        );
        // 真面目に更新処理を行うと大変なのでdelete->insertで対応
        // 試験問題マスタの削除
        await MTestQuestionRepository.deleteByTestId(testId, tx);
        // 試験問題マスタの追加
        await MTestQuestionRepository.createManyMTestQuestions(testId, questionDataList, tx);
    });

    // pme_transactionのトランザクション処理
    await transactionPrisma.$transaction(async (tx) => {
        // 受験履歴の削除
        await TTestRepository.deleteByTestId(testId, tx);
        // 解答履歴の削除
        await TTestAnswerRepository.deleteByTestId(testId, tx);
    });
}