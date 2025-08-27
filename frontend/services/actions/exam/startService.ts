import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { MTestQuestion } from ".prisma/client_master";
import { TTestRepository } from "@/lib/repositories/transaction/tTestRepository";
import { transactionPrisma } from "@/lib/prisma/transactionPrisma";
import { currentJST } from "@/lib/utils/timeUtils";
import { TestResult } from "@/lib/constants/labels";
import { MTestQuestionRepository } from "@/lib/repositories/master/mTestQuestionRepository";

/**
 * 試験開始処理を行うサービス関数
 *
 * @param employeeId - 社員ID
 * @param testId - 試験ID
 * @returns オブジェクト（ランダム抽選した試験問題と受験回数）
 * @throws 条件に合わない場合や処理中にエラーが発生した場合に例外をスローします
 */
export async function startService(
    employeeId: number,
    testId: number
): Promise<{
    mTestQuestions: MTestQuestion[];
    testCnt: number;
}> {
    // 試験IDに基づいて試験マスタを取得
    const mTest = await MTestRepository.findById(testId);
    if (!mTest) {
        throw new Error(`試験マスタが存在しません。[testId=${testId}]`);
    }

    // 現在の日時を取得
    const now = currentJST();

    // 試験の実施期間内かどうかを確認
    if (mTest.startAt > now || now > mTest.endAt) {
        throw new Error(`試験の実施期間外です。[testId=${testId}]`);
    }

    // 社員の受験履歴を取得（最新情報を取得）
    const tTests = await TTestRepository.findAllByEmployeeIdAndTestId(employeeId, testId);
    const tTest = tTests ? tTests[0] : null;

    // すでに合格している場合は試験を開始できないようにする
    if (tTest?.result === TestResult.Pass) {
        throw new Error(`合格した試験は開始できません。[employeeId=${employeeId}] [testId=${testId}]`);
    }

    // 出題数だけランダムで試験問題を抽出
    const mTestQuestions = (
        await MTestQuestionRepository.findAllByTestId(testId)
    )
        .sort(() => Math.random() - 0.5) // 簡易的なランダム抽選
        .slice(0, mTest.questionNum);

    // 今回の受験回数を計算
    // 注意：受験回数に論理削除されたデータも含めないと、insert時にduplicateエラーが発生する
    const maxTestCnt = await TTestRepository.findMaxTestCntByEmployeeIdAndTestId(employeeId, testId);
    const testCnt = maxTestCnt + 1;

    // トランザクション処理
    await transactionPrisma.$transaction(async (tx) => {
        // 受験履歴を新規作成
        await TTestRepository.createTTest(employeeId, testId, testCnt, tx);
    });

    return { mTestQuestions, testCnt };
}